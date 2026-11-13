import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLook, lookRequest, sameChoice, OCCASIONS, LOOK_CATEGORIES } from "../src/features/looks/model.ts";
import { LOOKS_KEY, readLooks, writeLooks, validLooks, validBudget } from "../src/features/looks/storage.ts";
import { recommend } from "../../../lib/db/src/neu/matching.ts";

// Synthetic fixtures are test-only. They are never imported into the catalog.
const date = "2026-11-13";
const claim = (field, value, extra = {}) => ({ field, value, basis: "verified", sourceUrl: "https://example.test/product", checkedOn: date, rawText: "TEST FIXTURE ONLY", ...extra });
function fixture() {
  const brands = [{ id: "TEST-brand", name: "TEST Brand", tier: "Drugstore", candidate: false }];
  const products = LOOK_CATEGORIES.map((category, i) => ({
    id: `TEST-product-${i}`, brandId: brands[0].id, name: `TEST ${category}`, category, sourceUrl: "https://example.test/product",
    checkedOn: date, rangeStatus: "enumerated", declaredShadeCount: 1, verifiedShadeCount: 1, notes: [], claims: [],
  }));
  const shades = products.map((p, i) => ({ id: `TEST-shade-${i}`, productId: p.id, name: `TEST ${i}`, description: "TEST ONLY", status: "verified",
    claims: i >= 2 ? [claim("color_family", "Rose")] : [claim("depth", "medium"), claim("undertone", "Neutral")] }));
  const candidates = products.map((p, i) => ({
    shadeId: shades[i].id, productId: p.id, category: p.category,
    label: i < 2 ? "Descriptor-aligned candidate" : "Color exploration", reasons: ["TEST source"], limitations: ["TEST limit"], sourceUrl: p.sourceUrl, checkedOn: date,
  }));
  return { catalog: { brands, products, shades, coverage: {} }, recommendations: { version: "TEST", candidates, notes: [], excludedCount: 0 },
    occasion: "Soft Glam", budget: { tier: "Any" }, owned: [], asOf: date };
}
test("four occasions and four categories are explicit, not invented extra shopping scope", () => {
  assert.deepEqual(OCCASIONS, ["Everyday", "Soft Glam", "Party Glam", "Work & College"]);
  assert.deepEqual(LOOK_CATEGORIES, ["Foundation", "Concealer", "Blush", "Lips"]);
});
test("look request preserves profile, references and deliberate preferences without mutation", () => {
  const input = { depth: "Medium", undertone: "Olive", oliveSubtype: "Cool-olive", skinType: "Dry", budget: "Luxury",
    references: [{ shadeId: "TEST", fit: ["Too pink"] }], preferences: { Lips: { colorFamilies: ["Berry"], opacity: "Opaque / even" } } };
  const before = JSON.stringify(input); const output = lookRequest(input, "Everyday");
  assert.equal(JSON.stringify(input), before); assert.equal(output.budget, undefined);
  assert.deepEqual(output.references, input.references); assert.deepEqual(output.preferences.Lips.colorFamilies, ["Berry"]);
  assert.equal(output.oliveSubtype, "Cool-olive");
});
test("occasion fills only open color choices and never promises wear-time", () => {
  const output = lookRequest({ preferences: { Lips: { colorFamilies: ["Open to anything"] } } }, "Party Glam");
  assert.deepEqual(output.preferences.Lips.colorFamilies, ["Red", "Berry"]);
  assert.equal(output.preferences.Foundation, undefined);
});
test("unknown purchase prices never become free or a verified total", () => {
  const plan = buildLook(fixture());
  assert.equal(plan.selectedCount, 4); assert.equal(plan.totalUSD, null); assert.equal(plan.budgetStatus, "unverified");
  assert.ok(plan.slots.every(s => s.selected.priceUSD === null));
});
test("overall numeric budget exposes unresolved price evidence", () => {
  const f = fixture(); f.budget.limitUSD = 80;
  const plan = buildLook(f);
  assert.ok(plan.slots.every(s => s.unresolved.some(r => /price/.test(r))));
  assert.notEqual(plan.budgetStatus, "within");
});
test("only actual fresh verified positive USD values enter arithmetic", () => {
  const f = fixture(); f.budget.limitUSD = 50;
  f.catalog.shades.forEach(s => s.claims.push(claim("price_usd", "10")));
  const plan = buildLook(f);
  assert.equal(plan.totalUSD, 40); assert.equal(plan.budgetStatus, "within");
  f.catalog.shades[0].claims.push(claim("price_usd", "12"));
  assert.equal(buildLook(f).totalUSD, null);
});
test("estimated, stale, malformed and zero purchase prices stay unknown", () => {
  for (const c of [claim("price_usd", "10", { basis: "estimate" }), claim("price_usd", "10", { checkedOn: "2025-01-01" }),
    claim("price_usd", "$10"), claim("price_usd", "0"), claim("price_usd", "-1")]) {
    const f = fixture(); f.catalog.shades[0].claims.push(c);
    assert.equal(buildLook(f).slots[0].selected.priceUSD, null);
  }
});
test("automatic picks cannot knowingly exceed the remaining numeric budget", () => {
  const f = fixture(); f.budget.limitUSD = 20; f.catalog.shades[0].claims.push(claim("price_usd", "25"));
  assert.equal(buildLook(f).slots[0].selected, null);
});
test("an explicit over-budget choice stays visible with an over-budget status", () => {
  const f = fixture(); f.budget.limitUSD = 20; f.catalog.shades[0].claims.push(claim("price_usd", "25"));
  f.selections = { Foundation: { kind: "catalog", shadeId: "TEST-shade-0" } };
  assert.equal(buildLook(f).budgetStatus, "over");
});
test("limited complexion evidence does not auto-fill a matched foundation", () => {
  const f = fixture(); f.recommendations.candidates[0].label = "Limited-evidence suggestion";
  assert.equal(buildLook(f).slots[0].selected, null);
});
test("missing or estimated color family does not fabricate a coordinated lip", () => {
  const f = fixture(); f.catalog.shades[3].claims[0].basis = "user_report";
  assert.equal(buildLook(f).slots[3].selected, null);
});
test("unverified requested opacity and formula remain unresolved alternatives", () => {
  const f = fixture(); f.profile = { preferences: { Lips: { opacity: "Opaque / even" }, Blush: { formula: "Cream" } } };
  assert.equal(buildLook(f).slots[3].selected, null); assert.equal(buildLook(f).slots[2].selected, null);
});
test("source-backed preferences can support selection without guaranteeing a two-toned outcome", () => {
  const f = fixture(); f.profile = { preferences: { Lips: { finish: "Satin", opacity: "Opaque / even", pigmentation: "Two-toned" } } };
  f.catalog.shades[3].claims.push(claim("finish", "Satin"), claim("opacity", "High coverage"));
  const plan = buildLook(f);
  assert.ok(plan.slots[3].selected); assert.match(plan.notes.join(" "), /not a tested compatibility/);
});
test("needs-review identities, stale and future candidates are not options", () => {
  for (const checkedOn of ["2025-01-01", "2027-01-01"]) {
    const f = fixture(); f.recommendations.candidates[0].checkedOn = checkedOn;
    assert.equal(buildLook(f).slots[0].options.length, 0);
  }
  const f = fixture(); f.catalog.shades[0].status = "needs_review";
  assert.equal(buildLook(f).slots[0].options.length, 0);
});
test("maximum Mid-range tier allows Drugstore but excludes Luxury", () => {
  const f = fixture(); f.budget.tier = "Mid-range";
  assert.equal(buildLook(f).selectedCount, 4);
  f.catalog.brands[0].tier = "Luxury"; assert.equal(buildLook(f).selectedCount, 0);
});
test("swapping or clearing one slot preserves all other explicit selections", () => {
  const f = fixture(); const before = buildLook(f);
  f.selections = Object.fromEntries(before.slots.map(s => [s.category, s.retainedChoice]));
  f.selections.Lips = null; const after = buildLook(f);
  for (const cat of LOOK_CATEGORIES.slice(0, 3)) assert.deepEqual(after.slots.find(s => s.category === cat).selected.choice, before.slots.find(s => s.category === cat).selected.choice);
  assert.equal(after.slots[3].selected, null); assert.equal(after.slots[3].retainedChoice, null);
});
test("an unavailable saved ID remains retained instead of being silently replaced", () => {
  const f = fixture(); f.selections = { Foundation: { kind: "catalog", shadeId: "TEST-old-choice" } };
  const slot = buildLook(f).slots[0];
  assert.equal(slot.selected, null); assert.equal(slot.retainedChoice.shadeId, "TEST-old-choice");
  assert.match(slot.unresolved.join(" "), /preserved/);
});
test("explicit self-reported owned reuse is zero new spend, not a source-backed match", () => {
  const f = fixture(); f.owned = [{ id: "TEST-owned", category: "Lips", brand: "TEST", product: "TEST own lipstick", shade: "TEST" }];
  f.selections = { Lips: { kind: "owned", ownedId: "TEST-owned" } };
  const slot = buildLook(f).slots[3];
  assert.equal(slot.selected.priceUSD, 0); assert.equal(slot.selected.supported, false);
  assert.match(slot.unresolved.join(" "), /explicit choice/);
});
test("edited owned labels cannot borrow evidence from a leftover catalog shade ID", () => {
  const f = fixture();
  f.owned = [{ id: "TEST-owned", category: "Lips", brand: "TEST Brand", product: "TEST Lips", shade: "TEST 3", shadeId: "TEST-shade-3" }];
  f.selections = { Lips: { kind: "owned", ownedId: "TEST-owned" } };
  assert.equal(buildLook(f).slots[3].selected.supported, true);
  f.owned[0].shade = "TEST completely different shade";
  const option = buildLook(f).slots[3].selected;
  assert.equal(option.supported, false); assert.equal(option.sourceUrl, undefined);
});
test("a source-excluded undertone choice cannot re-enter through saved selections", () => {
  const f = fixture(); f.catalog.shades[0].claims = [claim("depth", "medium"), claim("undertone", "Warm")];
  f.recommendations = recommend(f.catalog, { depth: "Medium", undertone: "Cool" }, date);
  f.selections = { Foundation: { kind: "catalog", shadeId: "TEST-shade-0" } };
  assert.equal(buildLook(f).slots[0].selected, null);
});
test("choice identity distinguishes catalog and owned namespaces", () => {
  assert.equal(sameChoice({ kind: "catalog", shadeId: "TEST" }, { kind: "owned", ownedId: "TEST" }), false);
});
class Memory {
  values = new Map(); getItem(k) { return this.values.get(k) ?? null; } setItem(k, v) { this.values.set(k, v); } removeItem(k) { this.values.delete(k); }
}
const snapshot = () => ({ version: 1, revision: "TEST-next", looks: [{ id: "TEST-look", name: "TEST look", occasion: "Everyday",
  budget: { tier: "Any" }, selections: { Foundation: null, Lips: { kind: "catalog", shadeId: "TEST-lip" } }, updatedAt: date }], owned: [] });
test("local look save/reopen preserves selections and does not write other storage keys", () => {
  const s = new Memory(); s.setItem("neu.local-preview.v1", "TEST profile"); s.setItem("neu.guest-profile.v1", "TEST legacy");
  assert.equal(writeLooks(s, snapshot(), ""), "saved");
  assert.deepEqual(readLooks(s).data, snapshot()); assert.equal(s.getItem("neu.local-preview.v1"), "TEST profile"); assert.equal(s.getItem("neu.guest-profile.v1"), "TEST legacy");
});
test("corrupt and future local records remain losslessly protected", () => {
  for (const raw of ["{TEST broken", JSON.stringify({ version: 99, secretTestValue: "TEST" })]) {
    const s = new Memory(); s.setItem(LOOKS_KEY, raw);
    assert.equal(writeLooks(s, snapshot(), ""), "protected"); assert.equal(s.getItem(LOOKS_KEY), raw); assert.equal(readLooks(s).raw, raw);
  }
});
test("newer revisions reject stale writes instead of losing someone else's edit", () => {
  const s = new Memory(); writeLooks(s, snapshot(), "");
  assert.equal(writeLooks(s, { ...snapshot(), revision: "TEST-other" }, ""), "conflict");
  assert.equal(readLooks(s).data.revision, "TEST-next");
});
test("unchanged or missing revisions cannot mask writes", () => {
  const s = new Memory(); assert.equal(writeLooks(s, { ...snapshot(), revision: "" }, ""), "protected");
  writeLooks(s, snapshot(), ""); assert.equal(writeLooks(s, snapshot(), "TEST-next"), "protected");
});
test("unavailable storage and quota failures are explicit, not false save success", () => {
  const s = new Memory(); s.setItem = () => { throw new Error("TEST quota"); };
  assert.equal(writeLooks(s, snapshot(), ""), "unavailable");
  assert.equal(readLooks({ getItem() { throw new Error("TEST denied"); } }).status, "unavailable");
});
test("invalid budgets, duplicate IDs and empty choice IDs are rejected", () => {
  for (const limitUSD of [0, -1, NaN, Infinity, 10001]) assert.equal(validBudget({ tier: "Any", limitUSD }), false);
  const d = snapshot(); d.looks.push(d.looks[0]); assert.equal(validLooks(d), false);
  const e = snapshot(); e.looks[0].selections.Lips.shadeId = ""; assert.equal(validLooks(e), false);
});
test("curated expansion preserves the accepted baseline and reconciles every declared complete range", () => {
  const seed = JSON.parse(readFileSync(new URL("../../../lib/db/src/neu/seed.json", import.meta.url)));
  for (const id of ["elf-soft-glam-satin", "elf-hydrating-camo", "fenty-fluid-flex", "rare-soft-pinch-liquid", "dior-rouge-dior"]) assert.ok(seed.products.some(p => p.id === id), id);
  assert.ok(seed.shades.filter(s => s.status === "verified").length >= 197);
  for (const p of seed.products.filter(p => p.rangeStatus === "enumerated")) assert.equal(seed.shades.filter(s => s.productId === p.id && s.status === "verified").length, p.declaredShadeCount);
});
test("actual curated evidence supports four-slot drafts across four profiles and all occasions, without price promises", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../../lib/db/src/neu/seed.json", import.meta.url)));
  for (const [depth, undertone] of [["Fair", "Neutral"], ["Light", "Warm"], ["Light", "Neutral"], ["Medium", "Neutral"]]) {
    for (const occasion of OCCASIONS) for (const tier of ["Mid-range", "Luxury"]) {
      const profile = lookRequest({ depth, undertone, skinType: "Dry" }, occasion);
      const recommendations = recommend(catalog, profile, date);
      const plan = buildLook({ catalog, recommendations, profile, occasion, budget: { tier }, owned: [], asOf: date });
      assert.equal(plan.supportedCount, 4, `${depth}/${undertone}/${occasion}/${tier}`);
      assert.equal(plan.totalUSD, null);
    }
  }
});
test("actual cool-olive and low-tier foundation gaps stay unresolved instead of fabricating a four-item set", () => {
  const catalog = JSON.parse(readFileSync(new URL("../../../lib/db/src/neu/seed.json", import.meta.url)));
  for (const [profileInput, tier] of [[{ depth: "Medium", undertone: "Olive", oliveSubtype: "Cool-olive", saturation: "Muted" }, "Any"], [{ depth: "Medium", undertone: "Neutral" }, "Drugstore"]]) {
    const profile = lookRequest(profileInput, "Everyday");
    const recommendations = recommend(catalog, profile, date);
    const plan = buildLook({ catalog, recommendations, profile, occasion: "Everyday", budget: { tier }, owned: [], asOf: date });
    assert.equal(plan.slots[0].selected, null); assert.ok(plan.slots[0].unresolved.length);
  }
});
