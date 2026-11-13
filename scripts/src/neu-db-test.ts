import { test, after } from "node:test";
import assert from "node:assert/strict";
import { pool } from "@workspace/db";
import { loadNeuCatalog } from "@workspace/db/neu";
after(async () => { await pool.end(); });
test("development normalized catalog joins selected canonical brands, products, sources and variants", async () => {
  const data = await loadNeuCatalog();
  assert.equal(data.coverage.selectedBrands, 25);
  assert.ok(data.coverage.verifiedProducts >= 5);
  assert.ok(data.coverage.verifiedShades >= 197);
  assert.ok(data.coverage.enumeratedRanges >= 4);
  assert.equal(data.coverage.verifiedProducts, data.products.length);
  assert.equal(data.coverage.verifiedShades, data.shades.filter(s => s.status === "verified").length);
  assert.equal(data.coverage.enumeratedRanges, data.products.filter(p => p.rangeStatus === "enumerated" && p.verifiedShadeCount === p.declaredShadeCount).length);
  for (const p of data.products) {
    assert.ok(data.brands.some(b => b.id === p.brandId && !b.candidate));
    assert.equal(p.verifiedShadeCount, data.shades.filter(s => s.productId === p.id && s.status === "verified").length);
  }
});
test("database rejects evidence attached to a shade from another product", async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query("SELECT id,product_id,source_id FROM neu_shades ORDER BY id LIMIT 1");
    const other = await client.query("SELECT id FROM neu_product_lines WHERE id <> $1 LIMIT 1", [rows[0].product_id]);
    await assert.rejects(client.query("INSERT INTO neu_matching_evidence(id,product_id,shade_id,source_id,field,value,basis,raw_text) VALUES($1,$2,$3,$4,'undertone','TEST','estimate','UNIT ONLY rollback')",
      ["unit-only-cross-product", other.rows[0].id, rows[0].id, rows[0].source_id]), error => (error as { code?: string }).code === "23503");
  } finally { await client.query("ROLLBACK"); client.release(); }
});
