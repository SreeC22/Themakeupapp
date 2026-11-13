import { createHash } from "node:crypto";
import type { PoolClient } from "pg";
import { pool } from "../index";
import { validateBatch } from "./batch";
import { categories, normalizeName, taxonomy } from "./taxonomy";

export const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export async function importBatch(input: unknown, dryRun = false) {
  const report = { dryRun, accepted: 0, duplicates: 0, rejected: 0, unresolved: 0, errors: [] as string[] };
  const source = input as Record<string, unknown> | null;
  const inputRecords = source && typeof source === "object"
    ? ["brands","listings","evidence"].reduce((n,key)=>n+(Array.isArray(source[key]) ? source[key].length : 0),0) : 0;
  let parsed: ReturnType<typeof validateBatch>;
  try { parsed = validateBatch(input); }
  catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ...report, rejected: inputRecords || 1, unresolved: message.includes("Unresolved") ? 1 : 0, errors: [message] };
  }
  const { batch, duplicateRows } = parsed;
  const sha = hash(batch);
  const client = await pool.connect();
  const insert = async (sql: string, values: unknown[]) => {
    const result = await client.query(sql, values);
    if (result.rowCount) report.accepted += result.rowCount; else report.duplicates++;
  };
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(724130)");
    const existing = await client.query("SELECT id, sha256 FROM catalog_imports WHERE id=$1 OR sha256=$2", [batch.id, sha]);
    if (existing.rows.length) {
      if (existing.rows[0].sha256 !== sha) throw new Error("Batch ID already exists with different content. Use a new batch ID.");
      await client.query("ROLLBACK");
      return { ...report, duplicates: batch.brands.length + batch.listings.length + batch.evidence.length, alreadyImported: true };
    }
    for (const r of batch.retailers) {
      const old = await client.query("SELECT name FROM catalog_retailers WHERE id=$1", [r.id]);
      if (old.rows.length && normalizeName(old.rows[0].name) !== normalizeName(r.name)) throw new Error(`Retailer ID belongs to a different name: ${r.id}`);
    }
    // Catch alias/canonical collisions across batches before any writes.
    for (const b of batch.brands) {
      const names = [b.name, ...b.aliases].map(normalizeName);
      const conflicts = await client.query(`SELECT brand_id FROM catalog_aliases WHERE normalized_name=ANY($1::text[]) AND brand_id<>$2
        UNION SELECT id FROM catalog_brands WHERE normalized_name=ANY($1::text[]) AND id<>$2`, [names, b.id]);
      if (conflicts.rows.length) throw new Error(`Alias belongs to an existing canonical brand: ${b.name}. Resolve its ID explicitly.`);
      const old = await client.query("SELECT name FROM catalog_brands WHERE id=$1", [b.id]);
      if (old.rows.length && normalizeName(old.rows[0].name) !== normalizeName(b.name)) throw new Error(`Canonical name change requires review: ${b.id}`);
    }
    await client.query("INSERT INTO catalog_imports(id,sha256) VALUES($1,$2)", [batch.id, sha]);
    for (const d of taxonomy) await client.query("INSERT INTO catalog_divisions(id,name) VALUES($1,$2) ON CONFLICT DO NOTHING", [d.id, d.name]);
    for (const c of categories) await client.query("INSERT INTO catalog_categories(id,name,division_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [c.id, c.name, c.divisionId]);
    for (const r of batch.retailers) await client.query("INSERT INTO catalog_retailers(id,name,country) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [r.id, r.name, r.country]);
    for (const b of batch.brands) {
      await insert("INSERT INTO catalog_brands(id,name,normalized_name) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [b.id, b.name, normalizeName(b.name)]);
      for (const name of new Set([b.name, ...b.aliases])) await client.query("INSERT INTO catalog_aliases(normalized_name,name,brand_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [normalizeName(name), name, b.id]);
    }
    for (const c of batch.coverage) await client.query(`INSERT INTO catalog_coverage(batch_id,retailer_id,source_url,checked_on,status,inclusion_rules,gaps)
      VALUES($1,$2,$3,$4,$5,$6,$7)`, [batch.id,c.retailerId,c.sourceUrl,c.checkedOn,c.status,c.inclusionRules,c.gaps]);
    for (const l of batch.listings) await insert(`INSERT INTO catalog_listings(brand_id,retailer_id,source_url,checked_on,batch_id) VALUES($1,$2,$3,$4,$5)
      ON CONFLICT(brand_id,retailer_id) DO UPDATE SET source_url=excluded.source_url,checked_on=excluded.checked_on,batch_id=excluded.batch_id
      WHERE catalog_listings.checked_on<excluded.checked_on`, [l.brandId,l.retailerId,l.sourceUrl,l.checkedOn,batch.id]);
    for (const e of batch.evidence) {
      const values = [hash(e), e.brandId,e.retailerId,e.categoryId,e.status,e.sourceUrl,e.checkedOn,e.productName??null,e.productUrl??null,e.note,batch.id];
      const old = await client.query("SELECT id FROM catalog_evidence WHERE brand_id=$1 AND retailer_id=$2 AND category_id=$3 AND checked_on=$4", [e.brandId,e.retailerId,e.categoryId,e.checkedOn]);
      if (old.rows.length && old.rows[0].id !== hash(e)) throw new Error(`Conflicting existing same-date evidence for ${e.brandId}/${e.categoryId}`);
      await insert(`INSERT INTO catalog_evidence(id,brand_id,retailer_id,category_id,status,source_url,checked_on,product_name,product_url,note,batch_id)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT DO NOTHING`, values);
    }
    report.duplicates = Math.max(report.duplicates, duplicateRows);
    await client.query(dryRun ? "ROLLBACK" : "COMMIT");
    return report;
  } catch (e) {
    await rollback(client);
    return { ...report, accepted: 0, rejected: inputRecords || 1, errors: [e instanceof Error ? e.message : String(e)] };
  } finally { client.release(); }
}
async function rollback(client: PoolClient) { await client.query("ROLLBACK"); }
