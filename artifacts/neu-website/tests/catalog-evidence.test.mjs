import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const products = JSON.parse(readFileSync(new URL("../src/features/mvp/research-products.json", import.meta.url), "utf8"));
const research = JSON.parse(readFileSync(new URL("../../../research/neu-catalog/initial.json", import.meta.url), "utf8"));
const categories = ["Foundation", "Concealer", "Blush", "Lips"];
const sourceCategories = { Foundation: ["foundation"], Concealer: ["concealer"], Blush: ["blush"], Lips: ["lipstick", "lip-gloss", "lip-liner"] };

test("preview contains only the four launch categories", () => {
  assert.deepEqual([...new Set(products.map((p) => p.category))].sort(), [...categories].sort());
});

test("research records have unique stable URL-safe identities", () => {
  assert.equal(new Set(products.map((p) => p.id)).size, products.length);
  for (const p of products) assert.match(p.id, /^[a-z0-9-]+$/);
});

test("missing shade, price and formula evidence is not invented", () => {
  for (const p of products) {
    assert.equal(p.shadeDetails, "unverified");
    for (const field of ["price", "finish", "coverage"]) assert.equal(p[field], null);
    for (const field of ["shadeHex", "shadeName", "stock", "rating", "reviewCount", "matchScore", "image"]) {
      assert.equal(Object.hasOwn(p, field), false);
    }
  }
});

for (const p of products) {
  test(`${p.category}: ${p.brandName} retains an existing evidence record`, () => {
    const evidence = research.evidence.find((e) => e.productName === p.name && e.productUrl === p.productUrl
      && e.sourceUrl === p.sourceUrl && e.checkedOn === p.checkedOn
      && sourceCategories[p.category].includes(e.categoryId));
    assert.ok(evidence, "No new product fact may be inserted without an existing source");
    assert.equal(evidence.status, "verified");
    const brand = research.brands.find((b) => b.id === evidence.brandId);
    assert.equal(brand?.name, p.brandName);
    assert.equal(p.evidenceNote, evidence.note);
    for (const url of [p.productUrl, p.sourceUrl]) {
      const parsed = new URL(url);
      assert.equal(parsed.protocol, "https:");
      assert.ok(["www.ulta.com", "www.sephora.com", "www.target.com"].includes(parsed.hostname));
    }
    assert.match(p.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
  });
}
