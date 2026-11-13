import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ROUTINES, ROLES, assessStep, facts, permittedRole, resolveEditItem, routineSteps, reusableIn, mismatchObservations, validEdit, validRoutine } from "../src/features/wardrobe/model.ts";
import { validLooks, readLooks, writeLooks, LOOKS_KEY } from "../src/features/looks/storage.ts";
import { recommend } from "../../../lib/db/src/neu/matching.ts";
const seed = JSON.parse(readFileSync(new URL("../../../lib/db/src/neu/seed.json", import.meta.url)));
const now = "2026-11-13";
function context() { return { catalog: seed, owned: [], asOf: now, recommendations: recommend(seed, { depth: "Medium", undertone: "Neutral" }, now) }; }
function item(productId, role, ctx = context()) {
  const s = ctx.catalog.shades.find(s => s.productId === productId && s.status === "verified");
  return { id: "TEST-" + productId, role, choice: { kind: "catalog", shadeId: s.id }, optional: true };
}
const edit = (items = []) => ({ id: "TEST-edit", name: "TEST collection", budget: { tier: "Any" }, items, updatedAt: now });
const step = (role, itemId = null, enabled = true) => ({ id: "TEST-step", role, itemId, enabled });
test("six adaptive routines are distinct from the retained four fixed-look occasions", () => {
  assert.deepEqual(ROUTINES, ["Five-Minute Face", "Everyday", "Work & College", "Soft Glam", "Party Glam", "Special Occasion"]);
});
test("all routines use only collection IDs, never new shopping recommendations", () => {
  const c = context(), multi = item("elf-monochromatic-multi", "Cheeks"), e = edit([multi]);
  for (const name of ROUTINES) for (const variant of ["simple", "elaborate"]) {
    const steps = routineSteps(name, variant, e, c);
    assert.ok(steps.every(s => s.itemId === null || e.items.some(i => i.id === s.itemId)));
  }
});
test("everyday simple omits foundation and permits users to skip lip color", () => {
  const e = edit(), c = context(), steps = routineSteps("Everyday", "simple", e, c);
  assert.ok(!steps.some(s => s.role === "Foundation"));
  assert.equal(assessStep({ ...steps.find(s => s.role === "Lip color"), enabled: false }, e, c).status, "skipped");
});
test("simple and elaborate routines share one immutable collection", () => {
  const c = context(), e = edit([item("elf-monochromatic-multi", "Cheeks")]), before = JSON.stringify(e);
  assert.ok(routineSteps("Special Occasion", "elaborate", e, c).length > routineSteps("Special Occasion", "simple", e, c).length);
  assert.equal(JSON.stringify(e), before);
});
test("moisturizer and SPF are instructions only, not skincare purchases", () => {
  for (const role of ["Moisturizer", "SPF"]) {
    const assessed = assessStep(step(role), edit(), context());
    assert.equal(assessed.status, "preparation"); assert.equal(assessed.product, undefined);
    assert.match(assessed.instructions, /No skincare/i);
  }
  assert.ok(seed.products.every(p => p.category !== "Skincare"));
});
test("ordinary blush is never automatically recommended on eyes or lips", () => {
  const c = context(), blush = item("elf-camo-liquid-blush", "Cheeks");
  assert.equal(permittedRole(blush, "Cheeks", c), true);
  assert.equal(permittedRole(blush, "Eyes", c), false);
  assert.equal(permittedRole(blush, "Lip color", c), false);
});
test("manufacturer-labeled multi-use stick works across three approved roles", () => {
  const c = context(), multi = item("elf-monochromatic-multi", "Cheeks");
  for (const role of ["Cheeks", "Lip color", "Eyes"]) assert.equal(permittedRole(multi, role, c), true);
  assert.equal(reusableIn(multi, c).length, 6);
});
test("multi-use does not mean it is a liner, gloss, foundation or SPF", () => {
  const c = context(), multi = item("elf-monochromatic-multi", "Cheeks");
  for (const role of ["Lip liner", "Lip gloss", "Lip oil", "Lip tint / stain", "Foundation", "SPF"]) assert.equal(permittedRole(multi, role, c), false);
});
test("lip liner and gloss require specific labeled subcategories", () => {
  const c = context(), liner = item("mario-ultra-suede-liner", "Lip liner"), gloss = item("mario-supershine-gloss", "Lip gloss");
  assert.equal(permittedRole(liner, "Lip liner", c), true); assert.equal(permittedRole(liner, "Lip gloss", c), false);
  assert.equal(permittedRole(gloss, "Lip gloss", c), true); assert.equal(permittedRole(gloss, "Eyes", c), false);
});
test("liner plus gloss is multiple collection items, not an invented new product SKU", () => {
  const c = context(), liner = item("mario-ultra-suede-liner", "Lip liner"), gloss = item("mario-supershine-gloss", "Lip gloss"), e = edit([liner, gloss]);
  const steps = routineSteps("Five-Minute Face", "elaborate", e, c);
  assert.equal(steps.find(s => s.role === "Lip liner").itemId, liner.id);
  assert.equal(steps.find(s => s.role === "Lip gloss").itemId, gloss.id);
});
test("lip steps explicitly disclaim identical pigment and two-toned results", () => {
  const c = context(), gloss = item("mario-supershine-gloss", "Lip gloss"), e = edit([gloss]);
  assert.match(assessStep(step("Lip gloss", gloss.id), e, c).missing.join(" "), /two-toned/);
});
test("two-toned opaque coverage is not inferred from a manufacturer's multi-use or pigment claim", () => {
  const c = context(), multi = item("elf-monochromatic-multi", "Lip color"), e = edit([multi]);
  c.profile = { preferences: { Lips: { pigmentation: "Two-toned / pigmented", opacity: "Opaque / even" } } };
  const assessed = assessStep(step("Lip color", multi.id), e, c);
  assert.equal(assessed.status, "unresolved");
  assert.match(assessed.missing.join(" "), /does not automatically mean opaque/);
});
test("eye palette stays eye-only; its pans are not fake additional sellable shade records", () => {
  const c = context(), palette = item("mario-ethereal-nature", "Eyes");
  assert.equal(permittedRole(palette, "Eyes", c), true); assert.equal(permittedRole(palette, "Lip color", c), false);
  assert.equal(seed.shades.filter(s => s.productId === "mario-ethereal-nature").length, 1);
});
test("stale usage evidence cannot authorize lip or eye application", () => {
  const c = context(), multi = item("elf-monochromatic-multi", "Cheeks");
  c.asOf = "2027-01-01";
  assert.equal(permittedRole(multi, "Eyes", c), false); assert.equal(permittedRole(multi, "Lip color", c), false);
});
test("estimates and user reports cannot become manufacturer use approval", () => {
  const c = structuredClone(context()), multi = item("elf-monochromatic-multi", "Cheeks");
  c.catalog.products.find(p => p.id === "elf-monochromatic-multi").claims.forEach(c => c.basis = "user_report");
  assert.equal(permittedRole(multi, "Eyes", c), false);
  assert.deepEqual(facts(c, "elf-monochromatic-multi", undefined, "application_area"), []);
});
test("source-matched owned makeup can be reused without purchasing a new product", () => {
  const c = context(), catalogItem = item("elf-monochromatic-multi", "Cheeks"), resolved = resolveEditItem(catalogItem, c);
  c.owned = [{ id: "TEST-owned", category: "Multi-use", brand: resolved.brand, product: resolved.title, shade: resolved.shade, shadeId: resolved.shadeId }];
  const own = { ...catalogItem, choice: { kind: "owned", ownedId: "TEST-owned" } };
  assert.equal(resolveEditItem(own, c).owned, true); assert.equal(permittedRole(own, "Eyes", c), true);
});
test("edited owned labels cannot borrow a leftover catalog ID's safety evidence", () => {
  const c = context(), cat = item("elf-monochromatic-multi", "Cheeks"), r = resolveEditItem(cat, c);
  c.owned = [{ id: "TEST-owned", category: "Multi-use", brand: r.brand, product: "TEST different pigment", shade: r.shade, shadeId: r.shadeId }];
  const own = { ...cat, choice: { kind: "owned", ownedId: "TEST-owned" } };
  assert.equal(permittedRole(own, "Eyes", c), false);
});
test("missing or removed collection IDs stay unresolved, without automatic replacement", () => {
  const c = context(), multi = item("elf-monochromatic-multi", "Cheeks");
  assert.equal(assessStep(step("Cheeks", "removed-id"), edit([multi]), c).status, "unresolved");
  assert.equal(assessStep(step("Cheeks", "removed-id"), edit([multi]), c).product, undefined);
});
test("foundation ownership is not proof of complexion fit or a corrected shade", () => {
  const c = context(), base = item("mario-surreal-natural", "Foundation");
  const assessment = assessStep(step("Foundation", base.id), edit([base]), c);
  assert.equal(assessment.status, "unresolved"); assert.match(assessment.instructions, /No corrected shade/);
});
test("depth, color mismatch and oxidation stay separate without shade offsets", () => {
  assert.deepEqual(mismatchObservations(["Too dark", "Too yellow", "Too pink"], "Turns orange"), {
    depth: ["Too dark"], color: ["Too yellow", "Too pink"], other: [], oxidation: "Turns orange",
  });
});
test("new edit and routine fields round-trip in the original version-one store", () => {
  const multi = item("elf-monochromatic-multi", "Cheeks"), wardrobe = edit([multi]);
  const routine = { id: "TEST-routine", name: "TEST saved", template: "Everyday", variant: "simple", steps: [step("Cheeks", multi.id, false)], updatedAt: now };
  const value = { version: 1, revision: "new", looks: [], owned: [], wardrobe, routines: [routine] };
  assert.equal(validLooks(value), true);
  let raw = JSON.stringify({ version: 1, revision: "old", looks: [], owned: [] });
  const storage = { getItem: () => raw, setItem: (_, v) => raw = v, removeItem: () => raw = null };
  assert.equal(writeLooks(storage, value, "old"), "saved");
  assert.deepEqual(readLooks(storage).data, value);
  assert.equal(writeLooks(storage, { ...value, revision: "third" }, "old"), "conflict");
});
test("invalid edits/routines are protected rather than silently discarded from raw saves", () => {
  const base = { version: 1, revision: "TEST", looks: [], owned: [], wardrobe: { ...edit(), budget: { tier: "Any", limitUSD: -1 } } };
  const raw = JSON.stringify(base);
  assert.equal(validEdit(base.wardrobe), false);
  assert.equal(readLooks({ getItem: key => key === LOOKS_KEY ? raw : null }).status, "corrupt");
  assert.equal(readLooks({ getItem: () => raw }).raw, raw);
  assert.equal(validRoutine({ id: "x", name: "x", template: "Everyday", variant: "simple", steps: [step("Skincare shopping")], updatedAt: now }), false);
});
test("all original identities survive, brand 26 exists, and no new code-derived foundation tones are invented", () => {
  assert.equal(seed.brands.length, 26); assert.ok(seed.brands.some(b => b.id === "makeup-by-mario"));
  for (const id of ["elf-soft-glam-satin", "elf-hydrating-camo", "fenty-fluid-flex", "rare-soft-pinch-liquid", "dior-rouge-dior"]) assert.ok(seed.products.some(p => p.id === id));
  assert.ok(seed.shades.filter(s => s.productId === "mario-surreal-natural").every(s => !s.claims.some(c => ["depth", "undertone"].includes(c.field))));
  assert.equal(seed.products.length, 16); assert.equal(seed.shades.filter(s => s.status === "verified").length, 399);
});
test("research stays separate from match evidence, disclosures and negatives are not silently discarded", () => {
  const research = JSON.parse(readFileSync(new URL("../../../lib/db/src/neu/research-seed.json", import.meta.url)));
  assert.equal(research.length, 6); assert.equal(new Set(research.map(e => e.sourceUrl)).size, 4);
  assert.ok(research.every(e => e.status === "research_candidate" && e.independentGroup === null && /^https:/.test(e.sourceUrl) && e.observedOn));
  assert.ok(research.some(e => e.negative.length)); assert.ok(research.some(e => /affiliate/.test(e.disclosure)));
  assert.ok(research.some(e => /not reconciled/.test(e.shade)));
});
