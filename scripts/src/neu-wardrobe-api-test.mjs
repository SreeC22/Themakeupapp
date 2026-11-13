import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}/api` : "http://localhost:8080/api";
test("live catalog exposes makeup-only routine metadata and preserves all original lines", async () => {
  const response = await fetch(`${base}/neu/catalog`); assert.equal(response.status, 200);
  const data = await response.json();
  assert.ok(data.coverage.selectedBrands >= 26); assert.ok(data.coverage.verifiedShades >= 399);
  const multi = data.products.find(p => p.id === "elf-monochromatic-multi");
  assert.deepEqual(new Set(multi.applicationAreas), new Set(["Eyes", "Lips", "Cheeks"]));
  assert.ok(data.products.some(p => p.category === "Eyes")); assert.ok(!data.products.some(p => p.category === "Skincare"));
  assert.ok(data.products.find(p => p.id === "mario-ultra-suede-liner").lipSubcategories.includes("Liner"));
  assert.ok(data.products.find(p => p.id === "mario-supershine-gloss").lipSubcategories.includes("Gloss"));
  for (const id of ["elf-soft-glam-satin", "elf-hydrating-camo", "fenty-fluid-flex", "rare-soft-pinch-liquid", "dior-rouge-dior"]) assert.ok(data.products.some(p => p.id === id));
});
test("live research is dated candidate-only source evidence with no false independence claims", async () => {
  const response = await fetch(`${base}/neu/research`); assert.equal(response.status, 200);
  const { entries, notes } = await response.json();
  assert.ok(entries.length >= 6); assert.ok(notes.some(n => /500/.test(n)));
  assert.ok(entries.every(e => e.status === "research_candidate" && e.independentGroup === null && e.sourceUrl && e.observedOn && e.disclosure));
  assert.equal(new Set(entries.map(e => JSON.stringify([e.sourceUrl, e.productName, e.shade]))).size, entries.length);
});
test("research remains read-only and no public review submission is introduced", async () => {
  const response = await fetch(`${base}/neu/research`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ positive: ["TEST MUST NOT BE WRITTEN"] }) });
  assert.equal(response.status, 404);
});
