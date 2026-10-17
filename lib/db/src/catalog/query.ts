import { z } from "zod/v4";
import { pool } from "../index";
import { categories, taxonomy, normalizeName } from "./taxonomy";

export const querySchema = z.strictObject({
  q: z.string().trim().max(100).default(""),
  retailer: z.string().regex(/^[a-z0-9-]+$/).optional(),
  division: z.enum(taxonomy.map(d => d.id) as [string, ...string[]]).optional(),
  category: z.enum(categories.map(c => c.id) as [string, ...string[]]).optional(),
  scope: z.enum(["relevant", "discovered"]).default("relevant"),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
export type CatalogQuery = z.infer<typeof querySchema>;

// One latest observation per retailer/category. Older evidence remains available in detail history.
const current = `WITH current_evidence AS (
 SELECT DISTINCT ON (brand_id,retailer_id,category_id) * FROM catalog_evidence
 ORDER BY brand_id,retailer_id,category_id,checked_on DESC
)`;
function selection(q: CatalogQuery, forceDiscovered = false) {
  const params: unknown[] = [];
  const param = (v: unknown) => { params.push(v); return `$${params.length}`; };
  const clauses = ["TRUE"];
  if (q.q) clauses.push(`EXISTS (SELECT 1 FROM catalog_aliases a WHERE a.brand_id=b.id AND position(${param(normalizeName(q.q))} in a.normalized_name)>0)`);
  if (q.retailer) clauses.push(`EXISTS (SELECT 1 FROM catalog_listings l WHERE l.brand_id=b.id AND l.retailer_id=${param(q.retailer)})`);
  if (q.category || q.division || (!forceDiscovered && q.scope === "relevant")) {
    const evidence = ["e.brand_id=b.id", "e.status='verified'"];
    if (q.retailer) evidence.push(`e.retailer_id=${param(q.retailer)}`);
    if (q.category) evidence.push(`e.category_id=${param(q.category)}`);
    if (q.division) evidence.push(`c.division_id=${param(q.division)}`);
    clauses.push(`EXISTS (SELECT 1 FROM current_evidence e JOIN catalog_categories c ON c.id=e.category_id WHERE ${evidence.join(" AND ")})`);
  }
  return { params, sql: `${current}, selected AS (SELECT b.* FROM catalog_brands b WHERE ${clauses.join(" AND ")})` };
}
export async function assertRetailer(q: CatalogQuery) {
  if (q.retailer && !(await pool.query("SELECT 1 FROM catalog_retailers WHERE id=$1", [q.retailer])).rowCount) throw new Error("Unknown retailer");
  if (q.category && q.division && !categories.some(c => c.id === q.category && c.divisionId === q.division)) throw new Error("Category does not belong to division");
}
export async function coverage() {
  const records = (await pool.query(`SELECT c.*,r.name AS retailer_name FROM catalog_coverage c JOIN catalog_retailers r ON r.id=c.retailer_id ORDER BY checked_on DESC,retailer_id,batch_id`)).rows;
  return {
    sourceUniverse: "Observed US listings at Sephora US, Ulta Beauty and Target; not all US beauty brands. Additional imported US retailers are named in coverage records.",
    rules: "Relevant means at least one current verified Neu category product at the selected retailer, if filtered. Directory-only brands remain unreviewed candidates. Missing evidence is unknown, never unavailable. Retailer listing does not imply stock.",
    verificationStatus: "Partial product-evidence verification; directory candidates are not all relevant brands.",
    incomplete: true,
    asOfDates: [...new Set(records.map(r => r.checked_on))],
    divisionTotalsAdditive: false,
    records,
  };
}
export async function listBrands(q: CatalogQuery) {
  const s = selection(q);
  const total = Number((await pool.query(`${s.sql} SELECT count(*) FROM selected`, s.params)).rows[0].count);
  const data = (await pool.query(`${s.sql} SELECT b.*,
    ARRAY(SELECT name FROM catalog_aliases a WHERE a.brand_id=b.id ORDER BY name) AS aliases,
    ARRAY(SELECT retailer_id FROM catalog_listings l WHERE l.brand_id=b.id ORDER BY retailer_id) AS retailers,
    ARRAY(SELECT DISTINCT category_id FROM current_evidence e WHERE e.brand_id=b.id AND e.status='verified' ORDER BY category_id) AS verified_categories
    FROM selected b ORDER BY b.normalized_name,b.id LIMIT $${s.params.length + 1} OFFSET $${s.params.length + 2}`,
    [...s.params, q.limit, (q.page - 1) * q.limit])).rows;
  return { data, total, page: q.page, limit: q.limit, filters: q, coverage: await coverage() };
}
export async function counts(q: CatalogQuery) {
  const universe = selection(q, true);
  const verified = selection({ ...q, scope: "relevant" });
  const relevant = Number((await pool.query(`${verified.sql} SELECT count(*) FROM selected`, verified.params)).rows[0].count);
  const base = selection(q);
  const scopedEvidence = `SELECT e.* FROM current_evidence e JOIN selected b ON b.id=e.brand_id JOIN catalog_categories c ON c.id=e.category_id
    WHERE e.status='verified' AND ($${base.params.length+1}::text IS NULL OR e.retailer_id=$${base.params.length+1})
    AND ($${base.params.length+2}::text IS NULL OR c.division_id=$${base.params.length+2})
    AND ($${base.params.length+3}::text IS NULL OR e.category_id=$${base.params.length+3})`;
  const params = [...base.params,q.retailer??null,q.division??null,q.category??null];
  const aggregate = async (kind: "retailer" | "division" | "category") => {
    const config = {
      retailer: ["catalog_retailers", "e.retailer_id"],
      division: ["catalog_divisions", "c.division_id"],
      category: ["catalog_categories", "e.category_id"],
    }[kind];
    return (await pool.query(`${base.sql}, scoped AS (${scopedEvidence})
      SELECT d.id,d.name,count(DISTINCT e.brand_id)::int AS verified_brands FROM ${config[0]} d
      LEFT JOIN (scoped e JOIN catalog_categories c ON c.id=e.category_id) ON ${config[1]}=d.id
      GROUP BY d.id,d.name ORDER BY d.id`, params)).rows;
  };
  const byRetailer = await aggregate("retailer");
  const discoveredByRetailer = (await pool.query(`${universe.sql} SELECT r.id,count(DISTINCT l.brand_id)::int AS discovered_brands
    FROM catalog_retailers r LEFT JOIN (catalog_listings l JOIN selected b ON b.id=l.brand_id) ON l.retailer_id=r.id
    WHERE ($${universe.params.length+1}::text IS NULL OR r.id=$${universe.params.length+1}) GROUP BY r.id`, [...universe.params,q.retailer??null])).rows;
  return {
    filters: q,
    listedBrands: Number((await pool.query(`${base.sql} SELECT count(*) FROM selected`, base.params)).rows[0].count),
    discoveredDirectoryBrands: Number((await pool.query(`${universe.sql} SELECT count(*) FROM selected`, universe.params)).rows[0].count),
    verifiedRelevantBrands: relevant,
    byRetailer: byRetailer.map(r => ({ ...r, discovered_brands: discoveredByRetailer.find(d => d.id === r.id)?.discovered_brands ?? 0 })),
    byDivision: await aggregate("division"), byCategory: await aggregate("category"),
    coverage: await coverage(),
  };
}
export async function brandDetail(id: string) {
  const brand = (await pool.query<{id:string; name:string; normalized_name:string}>("SELECT * FROM catalog_brands WHERE id=$1", [id])).rows[0];
  if (!brand) return null;
  return {
    ...brand,
    aliases: (await pool.query("SELECT name FROM catalog_aliases WHERE brand_id=$1 ORDER BY name", [id])).rows.map(r => r.name),
    listings: (await pool.query<{brand_id:string;retailer_id:string;source_url:string;checked_on:string;batch_id:string}>("SELECT * FROM catalog_listings WHERE brand_id=$1 ORDER BY retailer_id", [id])).rows,
    offerings: (await pool.query<OfferingRow>(`${current} SELECT l.retailer_id,c.id AS category_id,c.division_id,
      COALESCE(e.status,'unknown') AS status,e.source_url,e.checked_on,e.product_name,e.product_url,e.note,e.batch_id
      FROM catalog_listings l CROSS JOIN catalog_categories c LEFT JOIN current_evidence e ON e.brand_id=l.brand_id AND e.retailer_id=l.retailer_id AND e.category_id=c.id
      WHERE l.brand_id=$1 ORDER BY l.retailer_id,c.id`, [id])).rows,
    evidenceHistory: (await pool.query<OfferingRow>("SELECT * FROM catalog_evidence WHERE brand_id=$1 ORDER BY checked_on DESC,id", [id])).rows,
    coverage: await coverage(),
  };
}
interface OfferingRow {
  retailer_id: string; category_id: string; division_id?: string;
  status: "unknown" | "verified" | "unavailable";
  source_url: string | null; checked_on: string | null;
  product_name: string | null; product_url: string | null; note: string | null;
  batch_id: string | null;
}
export function csvCell(value: unknown) {
  let s = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/^[\s]*[=+\-@\t\r\n]/.test(s)) s = "'" + s;
  return `"${s.replaceAll('"','""')}"`;
}
export async function exportCsv(q: CatalogQuery) {
  const summary = await counts(q);
  const s = selection(q);
  const result = await pool.query(`${s.sql} SELECT b.id AS brand_id,b.name AS brand_name,l.retailer_id,c.division_id,c.id AS category_id,
    COALESCE(e.status,'unknown') AS status,e.product_name,e.product_url,e.source_url,e.checked_on,e.note,
    l.source_url AS listing_source_url,l.checked_on AS listing_checked_on,e.batch_id
    FROM selected b JOIN catalog_listings l ON l.brand_id=b.id CROSS JOIN catalog_categories c
    LEFT JOIN current_evidence e ON e.brand_id=b.id AND e.retailer_id=l.retailer_id AND e.category_id=c.id
    WHERE ($${s.params.length+1}::text IS NULL OR l.retailer_id=$${s.params.length+1})
    AND ($${s.params.length+2}::text IS NULL OR c.division_id=$${s.params.length+2})
    AND ($${s.params.length+3}::text IS NULL OR c.id=$${s.params.length+3})
    ORDER BY b.normalized_name,b.id,l.retailer_id,c.id`, [...s.params,q.retailer??null,q.division??null,q.category??null]);
  const columns = ["record_type","brand_id","brand_name","retailer_id","division_id","category_id","status","product_name","product_url","source_url","checked_on","note","listing_source_url","listing_checked_on","batch_id","summary_json"];
  const lines = [columns.map(csvCell).join(","), columns.map(c => csvCell(c === "record_type" ? "summary" : c === "summary_json" ? summary : "")).join(",")];
  for (const row of result.rows) lines.push(columns.map(c => csvCell(c === "record_type" ? "offering" : row[c])).join(","));
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}
