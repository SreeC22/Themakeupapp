import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pool } from "@workspace/db";
import type { Brand, Product, Shade, Claim } from "@workspace/db/neu";

// Explicit development-only curation command. Never called by startup or deploy.
if (process.env.NODE_ENV === "production") throw new Error("Catalog import is development-only.");
const seed = JSON.parse(await readFile(new URL("../../lib/db/src/neu/seed.json", import.meta.url), "utf8")) as { brands: Brand[]; products: Product[]; shades: Shade[] };
const ids = new Set(seed.products.map(p => p.id));
if (ids.size !== seed.products.length || new Set(seed.shades.map(s => s.id)).size !== seed.shades.length) throw new Error("Duplicate catalog identities.");
for (const p of seed.products) {
  const variants = seed.shades.filter(s => s.productId === p.id);
  if (p.rangeStatus === "enumerated" && variants.filter(s => s.status === "verified").length !== p.declaredShadeCount) throw new Error(`Incomplete selector cannot be marked enumerated: ${p.id}`);
  if (!/^https:\/\//.test(p.sourceUrl) || !/^\d{4}-\d{2}-\d{2}$/.test(p.checkedOn)) throw new Error("Invalid source identity/date.");
}
if (seed.shades.some(s => !ids.has(s.productId))) throw new Error("Orphan shade.");
// Content-addressed observations permit same-day corrections without reviving withdrawn claims.
// Unchanged imports are idempotent; earlier evidence stays attached to its own observation.
const sourceId = (p: Product) => `${p.id}--${p.checkedOn}--${createHash("sha256").update(JSON.stringify([p, seed.shades.filter(s => s.productId === p.id)])).digest("hex").slice(0, 16)}`;
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(724131)");
  const old = await client.query("SELECT p.id,s.observed_on::text AS observed_on FROM neu_product_lines p JOIN neu_sources s ON s.id=p.source_id");
  for (const p of seed.products) if (old.rows.some(r => r.id === p.id && r.observed_on > p.checkedOn)) throw new Error("Refusing to replace a newer observation with an older seed.");
  for (const b of seed.brands) await client.query(
    "INSERT INTO neu_selected_brands(brand_id,display_name,tier) VALUES($1,$2,$3) ON CONFLICT(brand_id) DO UPDATE SET display_name=EXCLUDED.display_name,tier=EXCLUDED.tier",
    [b.id, b.name, b.tier]);
  const evidence = async (p: Product, shadeId: string | null, claims: Claim[]) => {
    for (const c of claims) {
      if (c.basis !== "verified" || c.sourceUrl !== p.sourceUrl || c.checkedOn !== p.checkedOn || !c.rawText.trim()) throw new Error("Seed facts need reviewed matching provenance.");
      const id = createHash("sha256").update(JSON.stringify([p.id, shadeId, sourceId(p), c.field, c.value, c.basis])).digest("hex");
      await client.query("INSERT INTO neu_matching_evidence(id,product_id,shade_id,source_id,field,value,basis,raw_text) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO NOTHING",
        [id, p.id, shadeId, sourceId(p), c.field, c.value, c.basis, c.rawText]);
    }
  };
  for (const p of seed.products) {
    await client.query("INSERT INTO neu_sources(id,url,market,observed_on,kind) VALUES($1,$2,'US',$3,'manufacturer') ON CONFLICT(id) DO NOTHING", [sourceId(p), p.sourceUrl, p.checkedOn]);
    await client.query("INSERT INTO neu_product_lines(id,brand_id,name,category,source_id,range_status,declared_shade_count,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,source_id=EXCLUDED.source_id,range_status=EXCLUDED.range_status,declared_shade_count=EXCLUDED.declared_shade_count,notes=EXCLUDED.notes",
      [p.id, p.brandId, p.name, p.category, sourceId(p), p.rangeStatus, p.declaredShadeCount, p.notes]);
    await evidence(p, null, p.claims);
    for (const s of seed.shades.filter(s => s.productId === p.id)) {
      await client.query("INSERT INTO neu_shades(id,product_id,source_id,name,description,status) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET source_id=EXCLUDED.source_id,name=EXCLUDED.name,description=EXCLUDED.description,status=EXCLUDED.status",
        [s.id, p.id, sourceId(p), s.name, s.description, s.status]);
      await evidence(p, s.id, s.claims);
    }
  }
  await client.query("COMMIT");
  console.info(`Imported ${seed.brands.length} selected brands, ${seed.products.length} lines, ${seed.shades.filter(s => s.status === "verified").length} verified identities and ${seed.shades.filter(s => s.status !== "verified").length} identity under review.`);
} catch (error) { await client.query("ROLLBACK"); throw error; }
finally { client.release(); await pool.end(); }
