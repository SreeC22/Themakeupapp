import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { budgetInput, collectionOptions, editRequest, editSpend, effectiveEdit, initializeEdit, missingCore, replaceCollectionItem } from "../src/features/wardrobe/helpers.ts";
import { isLegacyLookCategory } from "../src/features/looks/helpers.ts";
import { assessStep } from "../src/features/wardrobe/model.ts";
import { createWardrobeDraftCache, initialEditDraft, initialRoutineDraft, routineRoute } from "../src/features/wardrobe/working-draft.ts";
import { neuProfileInput } from "../src/features/mvp/neu-profile.ts";
import { INITIAL_QUIZ_DRAFT } from "../src/features/quiz/_shared/quizDraft.ts";
import { validateQuizDraft } from "../src/features/mvp/storage.ts";

// Synthetic fixtures only. They are never part of the catalog or served to visitors.
const date = "2026-11-13";
const claim = (field, value, extra = {}) => ({ field, value, basis: "verified", checkedOn: date, sourceUrl: "https://example.test/manufacturer", rawText: "unit fixture", ...extra });
function fixture() {
  const categories = ["Foundation", "Concealer", "Blush", "Lips"];
  const catalog = {
    brands: [{ id: "unit-brand", name: "Unit Brand", tier: "Drugstore", candidate: false }],
    products: categories.map((category, i) => ({ id: `unit-p${i}`, brandId: "unit-brand", name: `Unit ${category}`, category, checkedOn: date, sourceUrl: "https://example.test/product", claims: [claim("price_usd", "10"), ...(category === "Lips" ? [claim("formula", "Lipstick")] : [])], notes: [] })),
    shades: categories.map((category, i) => ({ id: `unit-s${i}`, productId: `unit-p${i}`, name: `Unit shade ${i}`, description: "Synthetic only", status: "verified", claims: [claim("color_family", category === "Lips" ? "Rose" : "Pink")] })),
    coverage: {},
  };
  return {
    catalog, owned: [], asOf: date,
    recommendations: { version: "unit", notes: [], excludedCount: 0, candidates: categories.map((category, i) => ({ shadeId: `unit-s${i}`, productId: `unit-p${i}`, category, checkedOn: date, label: category === "Foundation" || category === "Concealer" ? "Descriptor-aligned candidate" : "Color exploration", reasons: [], limitations: [] })) },
  };
}
const profile = { depth: "Medium", undertone: null };
const generated = (context, budget = { tier: "Any" }) => {
  let id = 0;
  return initializeEdit(context, profile, budget, "unit-edit", "Unit Edit", () => `unit-item-${++id}`);
};

test("Edit request preserves user unknowns and preferences, removes exact-tier filtering, and adds no occasion palette", () => {
  const quiz = structuredClone(INITIAL_QUIZ_DRAFT);
  quiz.budget = "Luxury";
  quiz.categoryPreferences = { Lips: { colorFamilies: ["Mauve", "MLBB"], pigmentation: "Two-toned", opacity: "Flexible" } };
  const input = neuProfileInput(quiz);
  const request = editRequest(input);
  assert.equal(request.depth, null);
  assert.equal(request.undertone, null);
  assert.equal(request.budget, undefined);
  assert.deepEqual(request.preferences.Lips, input.preferences.Lips);
  assert.equal(request.preferences.Blush.colorFamilies, undefined);
  assert.equal(input.budget, "Luxury");
  assert.equal(validateQuizDraft(quiz), true);
});

test("explicit initialization is focused, source guarded and uses the actual response-bound preferences", () => {
  const context = fixture();
  assert.equal(generated(context).items.length, 4);
  const requestProfile = { ...profile, preferences: { Foundation: { finish: "Matte" } } };
  const edit = initializeEdit(context, requestProfile, { tier: "Any" }, "unit-edit", "Unit", () => crypto.randomUUID());
  assert.equal(edit.items.some(item => item.role === "Foundation"), false, "unproven requested finish must stay a gap");
  context.recommendations.candidates[1].checkedOn = "2025-01-01";
  assert.equal(generated(context).items.some(item => item.role === "Concealer"), false);
});

test("both wardrobe screens assess with the actual response-bound profile, not newer quiz answers", () => {
  for (const page of ["NeuEditPage", "RoutinesPage"]) {
    const source = readFileSync(new URL(`../src/pages/${page}.tsx`, import.meta.url), "utf8");
    const contextDeclaration = source.match(/const context: WardrobeContext[^\n]+/)[0];
    assert.match(contextDeclaration, /recommendations: evidence\.data, profile: evidence\.profile/);
    assert.doesNotMatch(contextDeclaration, /neuProfileInput|state\.quiz/);
  }
  const quiz = structuredClone(INITIAL_QUIZ_DRAFT);
  quiz.categoryPreferences = { Lips: { pigmentation: "Two-toned", opacity: "Opaque / even" } };
  const responseBoundProfile = JSON.parse(JSON.stringify(editRequest(neuProfileInput(quiz))));
  const context = { ...fixture(), profile: responseBoundProfile };
  const edit = generated(context);
  const lip = edit.items.find(item => item.role === "Lip color");
  const step = { id: "unit-response-bound-step", role: "Lip color", enabled: true, itemId: lip.id };
  quiz.categoryPreferences.Lips.opacity = "No preference";
  assert.equal(context.profile.preferences.Lips.opacity, "Opaque / even");
  assert.equal(assessStep(step, edit, context).status, "unresolved");
  assert.equal(assessStep(step, edit, { ...context, profile: editRequest(neuProfileInput(quiz)) }).status, "supported");
  assert.equal(step.itemId, lip.id, "a different profile must not replace the collection reference");
});

test("opacity needs fresh verified evidence for Lip color while labeled liner/gloss layers stay cautious uses, never core lipstick", () => {
  const context = { ...fixture(), profile: { preferences: { Lips: { pigmentation: "Two-toned", opacity: "Opaque / even" } } } };
  const edit = generated(context);
  const lip = edit.items.find(item => item.role === "Lip color");
  const step = { id: "unit-opacity-step", role: "Lip color", enabled: true, itemId: lip.id };
  for (const evidence of [
    null,
    claim("opacity", "Opaque / even", { basis: "estimate" }),
    claim("opacity", "Opaque / even", { checkedOn: "2025-01-01" }),
    claim("opacity", "Sheer / natural"),
  ]) {
    context.catalog.products[3].claims = [claim("formula", "Lipstick"), ...(evidence ? [evidence] : [])];
    assert.equal(assessStep(step, edit, context).status, "unresolved");
  }
  context.catalog.products[3].claims = [claim("formula", "Lipstick"), claim("opacity", "Opaque / even")];
  const supported = assessStep(step, edit, context);
  assert.equal(supported.status, "supported");
  assert.match(supported.instructions, /labeled-use support, not an exact personal/);
  assert.ok(supported.missing.some(note => /two-toned/.test(note)));

  for (const [subtype, role] of [["Liner", "Lip liner"], ["Gloss", "Lip gloss"]]) {
    context.catalog.products[3].claims = [claim("application_area", "Lips"), claim("lip_subcategory", subtype)];
    const core = generated(context);
    assert.equal(core.items.some(item => item.role === "Lip color"), false);
    assert.ok(missingCore(core, context).includes("Lips"));
    const option = collectionOptions(role, context, { tier: "Any" })[0];
    assert.ok(option, "manufacturer-labeled optional layer is available");
    const item = { ...option.item, id: `unit-layer-${subtype}` };
    const layeredEdit = { ...core, items: [...core.items, item] };
    const layer = assessStep({ id: `unit-step-${subtype}`, role, enabled: true, itemId: item.id }, layeredEdit, context);
    assert.equal(layer.status, "supported");
    assert.ok(layer.missing.some(note => /layering.*two-toned/.test(note)));
  }
});

test("eligible owned identity is preferred only during explicit initialization", () => {
  const context = fixture();
  context.owned.push({ id: "unit-owned", category: "Foundation", brand: "Unit Brand", product: "Unit Foundation", shade: "Unit shade 0", shadeId: "unit-s0" });
  const edit = generated(context);
  assert.deepEqual(edit.items.find(i => i.role === "Foundation").choice, { kind: "owned", ownedId: "unit-owned" });
  assert.equal(editSpend(edit, context).known, 30);
  context.owned[0].product = "Edited self-reported label";
  assert.notEqual(generated(context).items.find(i => i.role === "Foundation")?.choice.kind, "owned");
});

test("budget input rejects invalid caps, initialization retains honest gaps and unknown prices are not free", () => {
  for (const value of ["0", "-1", "bad", "Infinity", "10000.01"]) assert.equal(budgetInput("Any", value), null);
  assert.deepEqual(budgetInput("Mid-range", ""), { tier: "Mid-range" });
  assert.deepEqual(budgetInput("Any", "20.50"), { tier: "Any", limitUSD: 20.5 });
  const context = fixture();
  const capped = generated(context, { tier: "Any", limitUSD: 15 });
  assert.equal(capped.items.length, 1);
  context.catalog.products[0].claims = [];
  const edit = generated(context);
  const spend = editSpend(edit, context);
  assert.equal(spend.known, 30);
  assert.equal(spend.unknown, 1);
  assert.equal(spend.total, null);
  context.catalog.products[0].claims = [claim("price_usd", "10", { basis: "estimate" })];
  assert.equal(editSpend(edit, context).total, null);
});

test("collection choices expose all eligible line shades but not unsupported cross-use or guessed lip subtypes", () => {
  const context = fixture();
  context.catalog.shades.push({ ...context.catalog.shades[3], id: "unit-second-lip", name: "Unit second lip" });
  assert.equal(collectionOptions("Lip color", context, { tier: "Any" }).length, 2);
  assert.equal(collectionOptions("Eyes", context, { tier: "Any" }).length, 0);
  assert.equal(collectionOptions("Lip gloss", context, { tier: "Any" }).length, 0);
  context.catalog.products[3].claims.push(claim("application_area", "Lips"), claim("lip_subcategory", "Gloss"));
  assert.equal(collectionOptions("Lip gloss", context, { tier: "Any" }).length, 2);
  context.asOf = "2027-02-01";
  assert.equal(collectionOptions("Lip gloss", context, { tier: "Any" }).length, 0);
  assert.equal(collectionOptions("Moisturizer", context, { tier: "Any" }).length, 0);
});

test("collection replacement creates immutable new identity and never silently rewires a routine", () => {
  const context = fixture();
  const edit = generated(context);
  const old = edit.items[2];
  const step = { id: "unit-step", role: old.role, enabled: true, itemId: old.id, note: "Keep my note" };
  const replacement = replaceCollectionItem(edit, old.id, { kind: "catalog", shadeId: "unit-s2" }, old.role, true, "unit-new-id");
  assert.equal(edit.items[2].id, old.id);
  assert.equal(replacement.items[2].id, "unit-new-id");
  assert.equal(step.itemId, old.id);
  assert.equal(assessStep(step, replacement, context).status, "unresolved");
  assert.equal(step.note, "Keep my note");
  assert.deepEqual(missingCore({ ...edit, items: [] }, context), ["Foundation", "Concealer", "Blush", "Lips"]);
  context.recommendations.candidates = context.recommendations.candidates.filter(candidate => candidate.category !== "Foundation");
  assert.ok(missingCore(edit, context).includes("Foundation"), "a retained role without current complexion support stays an honest gap");
});

test("collection spend counts a repeated choice once and exact bag identity has zero new-purchase cost", () => {
  const context = fixture();
  const edit = generated(context);
  edit.items.push({ ...edit.items[3], id: "unit-extra-lip", optional: true });
  assert.equal(editSpend(edit, context).known, 40);
  context.owned.push({ id: "unit-bag", category: "Lips", brand: "Unit Brand", product: "Unit Lips", shade: "Unit shade 3", shadeId: "unit-s3" });
  assert.equal(editSpend(edit, context).known, 30);
});

test("typed transient cache preserves exact working collections and routine customization across internal navigation", () => {
  const cache = createWardrobeDraftCache();
  const edit = { ...initialEditDraft(generated(fixture())), name: "Still editing", limit: "unfinished input", dirty: true };
  cache.writeEdit(edit);
  const routine = initialRoutineDraft("Party Glam", "unit-routine");
  routine.initialized = true; routine.dirty = true;
  routine.routine.steps = [{ id: "exact-step-id", role: "Lip gloss", enabled: false, itemId: "removed-item-id", note: "My custom note" }];
  cache.writeRoutine("template:Party Glam", routine);
  for (const destination of ["/catalog/shades/unit-s3", "/learn", "/profile", "/edit", "/routines"]) {
    assert.ok(destination.startsWith("/"));
    assert.deepEqual(cache.readEdit(), edit);
    assert.deepEqual(cache.readRoutine("template:Party Glam"), routine);
  }
  edit.edit.items[0].choice.shadeId = "unit-mutated";
  assert.notDeepEqual(cache.readEdit(), edit);
  const returned = cache.readRoutine("template:Party Glam");
  returned.routine.steps[0].note = "mutated copy";
  assert.equal(cache.readRoutine("template:Party Glam").routine.steps[0].note, "My custom note");
  cache.clear();
  assert.equal(cache.readEdit(), undefined);
  assert.equal(cache.readRoutine("template:Party Glam"), undefined);
});

test("routine routes distinguish saved IDs from explicit templates and new saves keep one immutable ID", () => {
  assert.equal(routineRoute("id=unit-saved").key, "routine:unit-saved");
  assert.equal(routineRoute("saved=unit-saved").savedId, "unit-saved");
  assert.equal(routineRoute("template=Five-Minute%20Face").template, "Five-Minute Face");
  assert.equal(routineRoute("template=Invented").template, null);
  const cache = createWardrobeDraftCache(2);
  const draft = initialRoutineDraft("Everyday", "unit-same-id");
  const record = { ...draft.routine, steps: [{ id: "unit-stable-step", role: "SPF", enabled: false, itemId: null, note: "Custom prep" }] };
  const saved = initialRoutineDraft(record.template, record.id, record);
  cache.writeRoutine("template:Everyday", saved);
  cache.writeRoutine(`routine:${record.id}`, saved);
  assert.equal(cache.readRoutine("template:Everyday").routine.id, record.id);
  assert.deepEqual(cache.readRoutine(`routine:${record.id}`).routine.steps, record.steps);
  cache.writeRoutine("third", saved);
  assert.equal(cache.readRoutine("template:Everyday"), undefined);
  cache.removeRoutineRecord(record.id);
  assert.equal(cache.readRoutine(`routine:${record.id}`), undefined);
  assert.equal(cache.readRoutine("third"), undefined);
});

test("all seven bag categories retain identity while only four are usable in the legacy slots", () => {
  for (const category of ["Foundation", "Concealer", "Blush", "Lips"]) assert.equal(isLegacyLookCategory(category), true);
  for (const category of ["Eyes", "Multi-use", "Setting", "Moisturizer"]) assert.equal(isLegacyLookCategory(category), false);
  const context = fixture();
  context.catalog.products.push({ id: "unit-eye", brandId: "unit-brand", name: "Unit Eye Palette", category: "Eyes", checkedOn: date, sourceUrl: "https://example.test/eyes", claims: [claim("application_area", "Eyes")] });
  context.catalog.shades.push({ id: "unit-eye-shade", productId: "unit-eye", name: "Unit Quad", status: "verified", description: "", claims: [] });
  context.owned.push({ id: "unit-owned-eye", category: "Eyes", brand: "Unit Brand", product: "Unit Eye Palette", shade: "Unit Quad", shadeId: "unit-eye-shade" });
  const options = collectionOptions("Eyes", context, { tier: "Any" });
  assert.equal(options[0].item.choice.ownedId, "unit-owned-eye");
  assert.equal(context.owned[0].category, "Eyes");
  context.catalog.products.at(-1).claims = [];
  assert.equal(collectionOptions("Eyes", context, { tier: "Any" }).length, 0);
});

test("routine preview receives the working Edit name and budget without changing its persisted collection", () => {
  const original = generated(fixture());
  const working = { ...initialEditDraft(original), name: "Working name", tier: "Mid-range", limit: "25", dirty: true };
  const preview = effectiveEdit(working, original);
  assert.equal(preview.name, "Working name");
  assert.deepEqual(preview.budget, { tier: "Mid-range", limitUSD: 25 });
  assert.equal(original.name, "Unit Edit");
  assert.deepEqual(original.budget, { tier: "Any" });
  assert.deepEqual(preview.items.map(item => item.id), original.items.map(item => item.id));
});

test("new journeys coexist with compatibility routes and use guarded existing APIs/storage", () => {
  const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
  const app = read("App.tsx");
  for (const path of ["/edit", "/routines", "/research", "/looks", "/looks/saved", "/results", "/saved", "/quiz", "/profile", "/learn"]) assert.ok(app.includes(`path="${path}"`));
  assert.match(app, /onComplete=\{\(\) => navigate\("\/edit"\)\}/);
  const evidence = read("features/wardrobe/use-edit-evidence.ts");
  assert.match(evidence, /editRequest\(neuProfileInput\(profile\)\)/);
  assert.match(evidence, /data: requestProfile/);
  assert.match(evidence, /profile: requestProfile/);
  assert.match(evidence, /currentEvidence/);
  assert.doesNotMatch(evidence, /lookRequest|\bfetch\(/);
  const edit = read("pages/NeuEditPage.tsx");
  assert.match(edit, /initializeEdit\(context, evidence.profile/);
  assert.match(edit, /commit\(data => \(\{ \.\.\.data, wardrobe: record \}\)\)/);
  assert.doesNotMatch(edit, /localStorage|sessionStorage/);
  const routines = read("pages/RoutinesPage.tsx");
  assert.match(routines, /filter\(r => r.id !== record.id\), record/);
  assert.match(routines, /draft.initialized \|\| savedId/);
  assert.match(routines, /Confirm replace starting steps/);
  assert.doesNotMatch(routines, /initializeEdit|buildLook|\bfetch\(|localStorage|sessionStorage/);
  const research = read("pages/ResearchPage.tsx");
  assert.match(research, /useGetNeuResearch/);
  assert.match(research, /supported_favorite/);
  assert.match(research, /research_candidate/);
  assert.doesNotMatch(research, /useMutation|<img|\bfetch\(/);
  const reset = read("pages/LocalProfilePage.tsx");
  assert.match(reset, /Your Neu Edit, adaptive routines/);
});
