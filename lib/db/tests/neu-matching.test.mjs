import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { recommend, verifiedValues } from "../src/neu/matching.ts";

const date = "2026-11-13";
const fact = (field, value, basis = "verified", checkedOn = date) => ({ field, value, basis, checkedOn, sourceUrl: "https://example.test/source", rawText: `TEST FIXTURE: ${value}` });
// Synthetic values below are unit-only fixtures; they are never imported into the catalog.
function fixture(shadeClaims, category = "Foundation", productClaims = [], status = "verified") {
  return {
    brands: [{ id: "fixture-brand", name: "TEST fixture", tier: "Drugstore", candidate: false }],
    products: [{ id: "fixture-product", brandId: "fixture-brand", name: "TEST fixture", category, claims: productClaims, checkedOn: date, sourceUrl: "https://example.test/source" }],
    shades: [{ id: "fixture-shade", name: "TEST shade", productId: "fixture-product", status, claims: shadeClaims }],
    coverage: {},
  };
}
const run = (catalog, profile) => recommend(catalog, profile, date);
const base = [fact("depth", "medium"), fact("undertone", "Neutral")];
for (const [person, source] of [["Warm", "Cool"], ["Cool", "Warm"], ["Olive", "Neutral"], ["Neutral", "Olive"], ["Cool", "Neutral"], ["Warm", "Neutral"]]) {
  test(`hard gate: ${person} profile cannot become ${source} undertone recommendation`, () => {
    const result = run(fixture([fact("depth", "medium"), fact("undertone", source)], "Foundation", [fact("finish", "Satin"), fact("skin_types", "Dry")]), { depth: "Medium", undertone: person, skinType: "Dry", preferences: { Foundation: { finish: "Satin" } } });
    assert.equal(result.candidates.length, 0);
  });
}
for (const [person, source] of [["Cool", "Warm"], ["Warm", "Cool"], ["Neutral", "Warm"], ["Cool", "Neutral"]]) {
  test(`olive ${person} is not interchangeable with olive ${source}`, () => {
    assert.equal(run(fixture([fact("depth", "medium"), fact("undertone", "Olive"), fact("temperature", source)]), { depth: "Medium", undertone: "Olive", oliveSubtype: `${person}-olive` }).candidates.length, 0);
  });
}
test("same olive descriptors can align; no percentage or confidence score", () => {
  const result = run(fixture([fact("depth", "medium"), fact("undertone", "Olive"), fact("temperature", "Cool")]), { depth: "Medium", undertone: "Olive", oliveSubtype: "Cool-olive" });
  assert.equal(result.candidates[0].label, "Descriptor-aligned candidate");
  assert.doesNotMatch(JSON.stringify(result), /matchPercent|confidenceScore|"score"/);
});
test("unknown olive temperature is explicitly limited, never silently warm", () => {
  const result = run(fixture([fact("depth", "medium"), fact("undertone", "Olive")]), { depth: "Medium", undertone: "Olive", oliveSubtype: "Cool-olive" });
  assert.equal(result.candidates[0].label, "Limited-evidence suggestion");
  assert.match(result.candidates[0].limitations.join(" "), /olive temperature/);
});
test("neutral-warm source cannot pass cool even when neutral is primary", () => {
  assert.equal(run(fixture([...base, fact("temperature", "Warm")]), { depth: "Medium", undertone: "Cool" }).candidates.length, 0);
});
test("conflicting verified undertone facts are excluded rather than averaged", () => {
  assert.equal(run(fixture([...base, fact("undertone", "Warm")]), { depth: "Medium", undertone: "Neutral" }).candidates.length, 0);
});
test("depth conflict is not overcome by finish/skin-type preference", () => {
  assert.equal(run(fixture([fact("depth", "fair"), fact("undertone", "Neutral")], "Foundation", [fact("finish", "Satin"), fact("skin_types", "Dry")]), { depth: "Medium", undertone: "Neutral", skinType: "Dry", preferences: { Foundation: { finish: "Satin" } } }).candidates.length, 0);
});
test("very fair is not silently equated to fair", () => {
  assert.equal(run(fixture([fact("depth", "fair"), fact("undertone", "Neutral")]), { depth: "Very fair", undertone: "Neutral" }).candidates.length, 0);
});
for (const basis of ["estimate", "user_report"]) {
  test(`${basis} traits never become verified matching facts`, () => {
    const result = run(fixture([fact("depth", "medium"), fact("undertone", "Cool", basis)]), { depth: "Medium", undertone: "Cool" });
    assert.equal(result.candidates[0].label, "Limited-evidence suggestion");
    assert.deepEqual(verifiedValues([fact("undertone", "Cool", basis)], "undertone", date), []);
  });
}
test("unknown remains unknown; no default medium/neutral match", () => {
  assert.equal(run(fixture(base), {}).candidates[0].label, "Limited-evidence suggestion");
});
test("shade name is never parsed into matching traits", () => {
  const catalog = fixture([]);
  catalog.shades[0].name = "Medium Warm Golden Olive";
  assert.equal(run(catalog, { depth: "Medium", undertone: "Olive" }).candidates.length, 0);
  assert.equal(run(catalog, {}).candidates[0].label, "Limited-evidence suggestion");
});
test("under-review identities do not enter recommendations", () => assert.equal(run(fixture(base, "Foundation", [], "needs_review"), {}).candidates.length, 0));
test("missing catalog reference has an honest explanation", () => {
  assert.match(run(fixture(base), { references: [{ shadeId: "not-in-catalog", fit: ["Perfect match"] }] }).notes.join(" "), /no verified catalog identity/);
});
test("perfect verified reference supplies descriptors, not an equivalence", () => {
  const result = run(fixture(base), { references: [{ shadeId: "fixture-shade", fit: ["Blends in perfectly"] }] });
  assert.equal(result.candidates[0].label, "Descriptor-aligned candidate");
  assert.match(result.notes.join(" "), /Reference-derived depth descriptor: medium/);
  assert.match(result.notes.join(" "), /not an exact shade equivalence/);
});
for (const fit of ["A little too light", "A little too dark", "Too orange", "Too yellow", "Too pink", "Gray or ashy", "Changes color after application"]) {
  test(`reference correction '${fit}' avoids the bad shade without inventing an offset`, () => {
    const result = run(fixture(base), { references: [{ shadeId: "fixture-shade", fit: [fit] }] });
    assert.equal(result.candidates.length, 0);
    assert.match(result.notes.join(" "), /No measured lighter\/darker or undertone offset/);
    assert.doesNotMatch(result.notes.join(" "), /Reference-derived depth/);
  });
}
test("oxidizing reference is not treated as a stable perfect reference", () => {
  const result = run(fixture(base), { references: [{ shadeId: "fixture-shade", fit: ["Perfect match"], oxidation: "Gets darker" }] });
  assert.equal(result.candidates.length, 0);
});
test("the UI's No change noticed option preserves a perfect reference", () => {
  const result = run(fixture(base), { references: [{ shadeId: "fixture-shade", fit: ["Blends in perfectly"], oxidation: "No change noticed" }] });
  assert.equal(result.candidates[0].label, "Descriptor-aligned candidate");
});
test("conflicting perfect references do not silently resolve by order", () => {
  const catalog = fixture(base);
  catalog.shades.push({ ...catalog.shades[0], id: "different", claims: [fact("depth", "light"), fact("undertone", "Cool")] });
  const result = run(catalog, { references: ["fixture-shade", "different"].map(shadeId => ({ shadeId, fit: ["Perfect match"] })) });
  assert.match(result.notes.join(" "), /missing or conflicting/);
  assert.ok(result.candidates.every(c => c.label === "Limited-evidence suggestion"));
});
test("manual correction overrides conflicting source reference", () => {
  const result = run(fixture(base), { depth: "Light", undertone: "Cool", references: [{ shadeId: "fixture-shade", fit: ["Perfect match"] }] });
  assert.equal(result.candidates.length, 0);
  assert.match(result.notes.join(" "), /manually confirmed undertone overrides/);
});
test("saturation is not invented for a complexion shade", () => {
  assert.equal(run(fixture(base), { depth: "Medium", undertone: "Neutral", saturation: "Muted" }).candidates[0].label, "Limited-evidence suggestion");
});
test("stale and future claims do not enter verified evidence", () => {
  for (const stamp of ["2026-09-01", "2027-01-01"]) assert.deepEqual(verifiedValues([fact("undertone", "Cool", "verified", stamp)], "undertone", date), []);
});
test("unknown coverage preference is explained, not silently fulfilled", () => {
  assert.match(run(fixture(base), { preferences: { Foundation: { coverage: "Full" } } }).candidates[0].limitations.join(" "), /coverage preference cannot be verified/);
});
test("explicit finish conflict is not called compatible", () => {
  assert.equal(run(fixture(base, "Foundation", [fact("finish", "Matte")]), { preferences: { Foundation: { finish: "Dewy" } } }).candidates.length, 0);
});
test("brightening does not fabricate lighter shade equivalences", () => {
  assert.match(run(fixture(base, "Concealer"), { preferences: { Concealer: { intent: "Under-eye brightening" } } }).candidates[0].limitations.join(" "), /No automatic shade-step/);
});
test("two-toned opaque preference rejects sheer but does not promise an outcome", () => {
  assert.equal(run(fixture([fact("opacity", "Sheer")], "Lips"), { preferences: { Lips: { pigmentation: "Two-toned", opacity: "Opaque / even" } } }).candidates.length, 0);
  const result = run(fixture([fact("opacity", "High coverage")], "Lips"), { preferences: { Lips: { pigmentation: "Two-toned", opacity: "Opaque / even" } } });
  assert.match(result.candidates[0].limitations.join(" "), /not proof of even color on two-toned lips/);
});
test("unverified lip opacity stays unverified", () => {
  assert.match(run(fixture([], "Lips"), { preferences: { Lips: { opacity: "Opaque / even" } } }).candidates[0].limitations.join(" "), /Opacity is unverified/);
});
test("full lip coverage never treats a verified sheer variant as compatible", () => {
  assert.equal(run(fixture([fact("opacity", "Sheer")], "Lips"), { preferences: { Lips: { coverage: "Full" } } }).candidates.length, 0);
});
test("contradictory full and sheer lip goals are surfaced instead of averaged", () => {
  const result = run(fixture([], "Lips"), { preferences: { Lips: { coverage: "Full", opacity: "Sheer / natural" } } });
  assert.equal(result.candidates.length, 0);
  assert.match(result.notes.join(" "), /goals conflict/);
});
test("a lip shade name does not supply its aesthetic color family", () => {
  const catalog = fixture([], "Lips"); catalog.shades[0].name = "999 Red";
  assert.match(run(catalog, { preferences: { Lips: { colorFamilies: ["Red"] } } }).candidates[0].limitations.join(" "), /Color-family preference is unverified/);
});
test("brand tier is not a fabricated price", () => {
  const result = run(fixture(base), { budget: "Under $10" });
  assert.match(result.candidates[0].limitations.join(" "), /Budget compatibility is unknown/);
});
test("matching is deterministic with an explicit evidence date", () => assert.deepEqual(run(fixture(base), {}), run(fixture(base), {})));

const seed = JSON.parse(readFileSync(new URL("../src/neu/seed.json", import.meta.url), "utf8"));
test("curated snapshot preserves the 25-brand baseline, all tiers/categories and reviewed identity safeguards", () => {
  assert.equal(seed.brands.length, 25);
  assert.equal(new Set(seed.brands.map(b => b.tier)).size, 3);
  assert.equal(new Set(seed.products.map(p => p.category)).size, 4);
  assert.ok(seed.shades.filter(s => s.status === "verified").length >= 197);
  assert.equal(seed.shades.filter(s => s.status === "needs_review").length, 1);
  for (const p of seed.products.filter(p => p.rangeStatus === "enumerated")) assert.equal(p.verifiedShadeCount, p.declaredShadeCount);
});
test("real Camo Medium Neutral uses explicit warm description, not its neutral name", () => {
  const shade = seed.shades.find(s => s.productId === "elf-hydrating-camo" && s.name === "Medium Neutral");
  assert.equal(shade.claims.find(c => c.field === "undertone").value, "Warm");
});
test("name-only Soft Glam identities have no invented depth/undertone", () => {
  assert.ok(seed.shades.filter(s => s.productId === "elf-soft-glam-satin").every(s => s.claims.length === 0));
});
for (const undertone of ["Warm", "Cool", "Neutral", "Olive"]) {
  test(`real medium ${undertone} suggestions never include a conflicting verified primary undertone`, () => {
    const result = run(seed, { depth: "Medium", undertone });
    for (const c of result.candidates.filter(c => ["Foundation", "Concealer"].includes(c.category))) {
      const shade = seed.shades.find(s => s.id === c.shadeId);
      const value = shade.claims.find(f => f.field === "undertone")?.value;
      const temperature = shade.claims.find(f => f.field === "temperature")?.value;
      if (value) assert.ok(value === undertone || (value === "Neutral" && temperature === undertone));
    }
  });
}
