import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  choiceLabel, collectSelections, currentEvidence, emptySelections, exportLooks,
  generatedSelections, looksUsingOwned, replaceSlot,
} from "../src/features/looks/helpers.ts";
import { localExport } from "../src/features/looks/local-export.ts";
import { LOOKS_KEY } from "../src/features/looks/storage.ts";
import {
  createInitialPreviewState, deletePreviewState, LEGACY_PROFILE_KEY, PREVIEW_STORAGE_KEY,
} from "../src/features/mvp/storage.ts";

const memory = (values = {}) => {
  const data = new Map(Object.entries(values));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
};
// Synthetic slot identities exercise UI behavior, never served as catalog data.
const catalogChoice = id => ({ kind: "catalog", shadeId: id });
const ownedChoice = id => ({ kind: "owned", ownedId: id });
const slot = (category, selected, options = []) => ({ category, selected, retainedChoice: selected?.choice ?? null, options, unresolved: [] });

test("saving captures all four current choices, including explicit nulls", () => {
  const plan = { slots: [
    slot("Foundation", { choice: catalogChoice("unit-new") }),
    slot("Concealer", { choice: ownedChoice("unit-owned") }),
    slot("Blush", null), slot("Lips", null),
  ] };
  assert.deepEqual(collectSelections(plan), {
    Foundation: catalogChoice("unit-new"), Concealer: ownedChoice("unit-owned"), Blush: null, Lips: null,
  });
  assert.deepEqual(emptySelections(), { Foundation: null, Concealer: null, Blush: null, Lips: null });
});

test("an unavailable saved choice is not dropped on a subsequent save", () => {
  const previous = { ...emptySelections(), Foundation: catalogChoice("unit-retired"), Lips: ownedChoice("unit-removed") };
  const plan = { slots: Object.keys(previous).map(category => slot(category, null)) };
  assert.deepEqual(collectSelections(plan, previous), previous);
});

test("unresolved retained choices survive saving, but an explicit clear cannot resurrect them", () => {
  const plan = { slots: [
    { ...slot("Foundation", null), retainedChoice: catalogChoice("unit-retained-catalog") },
    { ...slot("Concealer", null), retainedChoice: ownedChoice("unit-retained-owned") },
    slot("Blush", null), slot("Lips", null),
  ] };
  assert.deepEqual(collectSelections(plan), {
    Foundation: catalogChoice("unit-retained-catalog"),
    Concealer: ownedChoice("unit-retained-owned"), Blush: null, Lips: null,
  });
  assert.deepEqual(collectSelections(plan, { Foundation: null, Concealer: null }), emptySelections());
});

test("replacing or clearing one slot cannot regenerate the other three", () => {
  const original = { Foundation: catalogChoice("unit-f"), Concealer: ownedChoice("unit-c"), Blush: null, Lips: catalogChoice("unit-l") };
  const edited = replaceSlot(original, "Blush", catalogChoice("unit-b"));
  assert.deepEqual(edited, { ...original, Blush: catalogChoice("unit-b") });
  assert.equal(original.Blush, null);
  const cleared = replaceSlot(edited, "Foundation", null);
  assert.equal(cleared.Foundation, null);
  assert.deepEqual(cleared.Lips, original.Lips);
  assert.deepEqual(cleared.Concealer, original.Concealer);
});

test("generation does not treat an inventory entry as permission to reuse it", () => {
  const plan = { slots: [
    slot("Foundation", null, [
      { supported: true, owned: true, choice: ownedChoice("unit-owned") },
      { supported: false, owned: false, choice: catalogChoice("unit-limited") },
      { supported: true, owned: false, choice: catalogChoice("unit-supported") },
    ]),
    slot("Concealer", null, [{ supported: true, owned: true, choice: ownedChoice("unit-only-owned") }]),
    slot("Blush", null), slot("Lips", null),
  ] };
  assert.deepEqual(generatedSelections(plan), {
    Foundation: catalogChoice("unit-supported"), Concealer: null, Blush: null, Lips: null,
  });
});

test("profile, occasion and catalog freshness keys reject late results and obsolete request IDs", () => {
  assert.equal(currentEvidence("profile-a/everyday/evidence-a", "profile-b/everyday/evidence-a", 3, 3), false);
  assert.equal(currentEvidence("profile-a/everyday/evidence-a", "profile-a/party/evidence-a", 3, 3), false);
  assert.equal(currentEvidence("profile-a/everyday/evidence-a", "profile-a/everyday/evidence-b", 3, 3), false);
  assert.equal(currentEvidence("same", "same", 2, 3), false);
  assert.equal(currentEvidence("same", "same", 3, 3), true);
});

test("removing owned inventory leaves references identifiable for an unresolved saved slot", () => {
  const look = { id: "unit-look", selections: { Foundation: ownedChoice("unit-owned") } };
  const untouched = structuredClone(look);
  assert.deepEqual(looksUsingOwned([look], "unit-owned"), [look]);
  assert.deepEqual(looksUsingOwned([look], "another-owned"), []);
  assert.match(choiceLabel(look.selections.Foundation, undefined, []), /Removed owned item/);
  assert.deepEqual(look, untouched);
  assert.match(choiceLabel(catalogChoice("unit-missing"), undefined, []), /unit-missing/);
  assert.equal(choiceLabel(null, undefined, []), "Left empty");
});

test("profile export keeps old fields and losslessly includes all raw look/owned data", () => {
  const state = createInitialPreviewState();
  state.savedIds = ["historical-id"];
  const data = {
    version: 1, revision: "unit-revision",
    looks: [{ id: "unit-look", name: "Unit", occasion: "Everyday", budget: { tier: "Any" }, selections: { Foundation: ownedChoice("unit-owned"), Lips: null }, updatedAt: "2026-11-12T12:00:00Z" }],
    owned: [{ id: "unit-owned", category: "Foundation", brand: "Unit brand", product: "Unit product", shade: "Self-reported" }],
  };
  const raw = JSON.stringify(data, null, 3);
  const storage = memory({ [LOOKS_KEY]: raw, [PREVIEW_STORAGE_KEY]: "{protected-preview-original" });
  const exported = localExport(state, storage);
  assert.deepEqual(exported.savedIds, state.savedIds);
  assert.deepEqual(exported.quiz, state.quiz);
  assert.equal(exported.looksStore.raw, raw);
  assert.deepEqual(exported.looksStore.data, data);
  assert.equal(exported.previewOriginalRaw, "{protected-preview-original");
});

test("corrupt and future looks remain raw-exportable without changing a byte", () => {
  for (const raw of ["{broken", '{ "version": 700, "custom": [1,2,3] }']) {
    const storage = memory({ [LOOKS_KEY]: raw });
    const exported = exportLooks(storage);
    assert.equal(exported.raw, raw);
    assert.equal(exported.data, null);
    assert.equal(storage.getItem(LOOKS_KEY), raw);
  }
});

test("lossless profile export reports unavailable looks storage rather than exporting an empty store", () => {
  const storage = { ...memory(), getItem: () => { throw new Error("blocked"); } };
  assert.throws(() => localExport(createInitialPreviewState(), storage), /cannot be read/);
});

test("explicit preview reset clears only both preview stores, keeping legacy and unrelated state", () => {
  const storage = memory({ [PREVIEW_STORAGE_KEY]: "profile", [LOOKS_KEY]: "looks-and-owned", [LEGACY_PROFILE_KEY]: "legacy", another: "keep" });
  assert.equal(deletePreviewState(storage), true);
  assert.equal(storage.getItem(PREVIEW_STORAGE_KEY), null);
  assert.equal(storage.getItem(LOOKS_KEY), null);
  assert.equal(storage.getItem(LEGACY_PROFILE_KEY), "legacy");
  assert.equal(storage.getItem("another"), "keep");
});

test("partial reset failure cannot report a successful reset", () => {
  const storage = memory({ [PREVIEW_STORAGE_KEY]: "profile", [LOOKS_KEY]: "looks" });
  const remove = storage.removeItem;
  storage.removeItem = key => { if (key === LOOKS_KEY) throw new Error("blocked"); remove(key); };
  assert.equal(deletePreviewState(storage), false);
  assert.equal(storage.getItem(LOOKS_KEY), "looks");
});

test("look routes, generated-client wiring and existing discovery/private routes stay integrated", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  for (const path of ["/looks", "/looks/saved", "/quiz", "/profile", "/results", "/saved", "/learn", "/catalog/shades/:shadeId", "/review/new"]) {
    assert.ok(app.includes(`path="${path}"`), `missing route ${path}`);
  }
  assert.match(app, /onComplete=\{\(\) => navigate\("\/edit"\)\}/);
  const hook = readFileSync(new URL("../src/features/looks/use-look-evidence.ts", import.meta.url), "utf8");
  assert.match(hook, /useGetNeuCatalog/);
  assert.match(hook, /useRecommendNeuShades/);
  assert.match(hook, /lookRequest\(neuProfileInput\(profile\), occasion\)/);
  assert.match(hook, /data: requestProfile/);
  assert.match(hook, /profile: requestProfile/);
  const builder = readFileSync(new URL("../src/pages/LooksPage.tsx", import.meta.url), "utf8");
  assert.equal((builder.match(/profile: evidence\.profile/g) ?? []).length, 2);
  assert.match(hook, /credentials: "include"/);
  assert.match(hook, /refetchOnWindowFocus: true/);
  assert.doesNotMatch(hook, /\bfetch\(/);
  const storeHook = readFileSync(new URL("../src/features/looks/use-looks.tsx", import.meta.url), "utf8");
  assert.match(storeHook, /crypto.randomUUID\(\)/);
  assert.match(storeHook, /writeLooks\(storage\(\), next, current.data.revision\)/);
  assert.match(storeHook, /addEventListener\("storage"/);
});
