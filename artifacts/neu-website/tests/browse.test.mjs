import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterResearchProducts, validBudget } from "../src/features/mvp/browse.ts";

const products = JSON.parse(readFileSync(new URL("../src/features/mvp/research-products.json", import.meta.url), "utf8"));
const defaults = { category: "", search: "", brand: "", budget: "", finish: "", coverage: "", includeUnknown: true, sort: "alphabetical" };

test("category browsing restricts to each of the four launch categories", () => {
  for (const category of ["Foundation", "Concealer", "Blush", "Lips"]) {
    const result = filterResearchProducts(products, { ...defaults, category });
    assert.ok(result.length > 0);
    assert.ok(result.every((p) => p.category === category));
  }
});
test("product and brand search is case-insensitive and trims spaces", () => {
  const result = filterResearchProducts(products, { ...defaults, search: "  CLINIQUE " });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => `${p.brandName} ${p.name}`.toLowerCase().includes("clinique")));
});
test("combined filters do not invent results when no source matches", () => {
  assert.deepEqual(filterResearchProducts(products, { ...defaults, category: "Lips", brand: "no-such-test-brand" }), []);
});
test("unknown prices cannot satisfy a strict budget filter", () => {
  assert.deepEqual(filterResearchProducts(products, { ...defaults, budget: "20", includeUnknown: false }), []);
});
test("explicit unknown inclusion permits exploration without claiming budget suitability", () => {
  const result = filterResearchProducts(products, { ...defaults, budget: "20", includeUnknown: true });
  assert.equal(result.length, products.length);
  assert.ok(result.every((p) => p.price === null));
});
test("finish and coverage unknowns cannot become documented matches", () => {
  for (const filter of [{ finish: "Matte" }, { coverage: "Full" }]) {
    assert.deepEqual(filterResearchProducts(products, { ...defaults, ...filter, includeUnknown: false }), []);
  }
});
test("sorting is deterministic and never mutates the catalog", () => {
  const before = JSON.stringify(products);
  const alphabetic = filterResearchProducts(products, defaults);
  for (const sort of ["source-newest", "source-oldest"]) {
    assert.deepEqual(filterResearchProducts(products, { ...defaults, sort }), alphabetic, "Equal research dates use alphabetic tie-breaking");
  }
  assert.equal(JSON.stringify(products), before);
});
test("invalid and absent budgets are not silently treated as valid numeric limits", () => {
  for (const value of ["", " ", "not-a-price", "-10", "Infinity"]) assert.equal(validBudget(value), false);
  for (const value of ["0", "25", "100.50"]) assert.equal(validBudget(value), true);
});
test("retailer filtering uses the actual recorded source host", () => {
  for (const retailer of ["www.ulta.com", "www.sephora.com", "www.target.com"]) {
    const result = filterResearchProducts(products, { ...defaults, retailer });
    assert.ok(result.every((p) => new URL(p.sourceUrl).hostname === retailer));
    assert.equal(result.length, products.filter((p) => new URL(p.sourceUrl).hostname === retailer).length);
  }
});
test("historical research cannot satisfy a verified-shade evidence filter", () => {
  assert.deepEqual(filterResearchProducts(products, { ...defaults, evidence: "verified-shade" }), []);
  assert.equal(filterResearchProducts(products, { ...defaults, evidence: "historical-listing" }).length, products.length);
});
test("skin-type suitability stays unknown instead of becoming an inferred match", () => {
  assert.deepEqual(filterResearchProducts(products, { ...defaults, skinType: "Dry", includeUnknown: false }), []);
  assert.equal(filterResearchProducts(products, { ...defaults, skinType: "Dry", includeUnknown: true }).length, products.length);
});
