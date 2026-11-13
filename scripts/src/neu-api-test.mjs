import { test } from "node:test";
import assert from "node:assert/strict";
const base = "http://localhost:80/api/neu";
const post = (body) => fetch(`${base}/recommendations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
test("proxy API returns normalized catalog and honest snapshot coverage", async () => {
  const response = await fetch(`${base}/catalog`, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.coverage.verifiedShades, 197);
  assert.equal(data.coverage.enumeratedRanges, 4);
  assert.equal(data.shades.filter(s => s.status === "needs_review").length, 1);
  assert.ok(data.products.every(p => p.sourceUrl.startsWith("https://") && !("price" in p)));
  assert.ok(data.products.find(p => p.id === "fenty-fluid-flex").claims.every(c => c.field !== "formula"));
});
test("real API explains four-category suggestions without match percentages", async () => {
  const response = await post({ depth: "Medium", undertone: "Olive", oliveSubtype: "Neutral-olive", skinType: "Dry", preferences: { Lips: { pigmentation: "Two-toned", opacity: "Opaque / even" } } });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(new Set(data.candidates.map(c => c.category)).size, 4);
  assert.ok(data.candidates.every(c => c.reasons.length && c.limitations.length && c.sourceUrl));
  assert.doesNotMatch(JSON.stringify(data), /"score"|"confidence"|matchPercent/);
});
test("API rejects invalid undertone and overly long reference arrays", async () => {
  assert.equal((await post({ undertone: "Invented" })).status, 400);
  assert.equal((await post({ references: Array.from({ length: 51 }, () => ({ shadeId: "TEST", fit: [] })) })).status, 400);
});
test("exact reference lookup works while a missing reference stays limited", async () => {
  const catalog = await (await fetch(`${base}/catalog`)).json();
  const ref = catalog.shades.find(s => s.productId === "elf-hydrating-camo" && s.name === "Medium Sand");
  const result = await (await post({ references: [{ shadeId: ref.id, fit: ["Blends in perfectly"] }] })).json();
  assert.match(result.notes.join(" "), /Reference-derived depth descriptor: medium/);
  const missing = await (await post({ references: [{ shadeId: "TEST-missing-reference", fit: ["Blends in perfectly"] }] })).json();
  assert.match(missing.notes.join(" "), /no verified catalog identity/);
});
