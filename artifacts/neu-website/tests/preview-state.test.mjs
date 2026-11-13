import test from "node:test";
import assert from "node:assert/strict";
import {
  PREVIEW_STORAGE_KEY, LEGACY_PROFILE_KEY, MODERATION_STATES,
  createInitialPreviewState, validatePreviewState, validateQuizDraft,
  parsePreviewState, readPreviewState, persistPreviewState,
  deletePreviewState, serializePreviewState,
} from "../src/features/mvp/storage.ts";
import { QUIZ_SWATCHES } from "../src/features/quiz/_shared/quizDraft.ts";

function memoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => { data.set(key, value); },
    removeItem: (key) => { data.delete(key); },
  };
}

const journeys = [
  ["fair cool dry", 6, "Cool", "", "Not sure", "Dry"],
  ["fair warm oily", 8, "Warm", "", "Not sure", "Oily"],
  ["light cool muted olive", 11, "Olive", "Cool-olive", "Muted", "Dry"],
  ["light warm olive combination", 14, "Olive", "Warm-olive", "Balanced", "Combination"],
  ["medium neutral", 21, "Neutral", "", "Balanced", "Not sure"],
  ["medium muted olive", 24, "Olive", "Neutral-olive", "Muted", "Combination"],
  ["tan warm olive oily", 26, "Olive", "Warm-olive", "Balanced", "Oily"],
  ["tan cool olive dry", 29, "Olive", "Cool-olive", "Muted", "Dry"],
  ["deep neutral", 31, "Neutral", "", "Not sure", "Not sure"],
  ["deep cool dry", 33, "Cool", "", "Muted", "Dry"],
  ["deep warm combination", 35, "Warm", "", "Bright / saturated", "Combination"],
  ["two-toned lips with opaque lipstick goal", 17, "Neutral", "", "Not sure", "Not sure"],
  ["very fair uncertain undertone", 1, "Still exploring", "", "Not sure", "Not sure"],
  ["very deep uncertain undertone", 40, "Still exploring", "", "Not sure", "Not sure"],
  ["light-medium neutral olive", 20, "Olive", "Neutral-olive", "Balanced", "Combination"],
];

for (const [name, number, undertone, oliveSubtype, saturation, skinType] of journeys) {
  test(`profile journey round trip: ${name}`, () => {
    const state = createInitialPreviewState();
    Object.assign(state.quiz, {
      shadeId: QUIZ_SWATCHES[number - 1].id, depthUnsure: false,
      undertone, olive: undertone === "Olive" ? "yes" : "unsure",
      oliveSubtype, saturation, skinType,
      categories: name.includes("lips") ? ["Lips"] : ["Foundation", "Concealer"],
    });
    if (name.includes("two-toned")) Object.assign(state.quiz, { lipPigmentation: "Two-toned", lipOpacity: "Opaque / even" });
    assert.equal(validatePreviewState(state), true);
    const storage = memoryStorage();
    assert.equal(persistPreviewState(storage, state), true);
    const loaded = readPreviewState(storage);
    assert.equal(loaded.status, "saved");
    assert.deepEqual(loaded.state, state);
  });
}

test("fixtures cover all eight depth ranges and fifteen named journeys", () => {
  assert.equal(new Set(journeys.map((j) => QUIZ_SWATCHES[j[1] - 1].group)).size, 8);
  assert.ok(journeys.length >= 12);
});

test("initial state is depth-first, private and contains no manufactured complexion", () => {
  const state = createInitialPreviewState();
  assert.equal(state.quiz.step, "depth");
  assert.equal(state.quiz.shadeId, null);
  assert.equal(state.quiz.undertone, null);
  assert.equal(state.privacy, "private");
  assert.deepEqual(state.savedIds, []);
  assert.deepEqual(state.reviews, []);
});

test("fresh states do not share mutable answer arrays", () => {
  const first = createInitialPreviewState();
  const next = createInitialPreviewState();
  first.quiz.categories.push("Blush");
  assert.deepEqual(next.quiz.categories, []);
});

test("all forty shade identities remain distinct after serialization", () => {
  assert.equal(QUIZ_SWATCHES.length, 40);
  assert.equal(new Set(QUIZ_SWATCHES.map((s) => s.id)).size, 40);
  for (const swatch of QUIZ_SWATCHES) {
    const state = createInitialPreviewState();
    state.quiz.shadeId = swatch.id;
    const parsed = parsePreviewState(serializePreviewState(state));
    assert.equal(parsed.state.quiz.shadeId, swatch.id);
  }
});

test("unknown answers do not turn into neutral or medium on reload", () => {
  const state = createInitialPreviewState();
  Object.assign(state.quiz, { shadeId: null, depthUnsure: true, undertone: "Still exploring", olive: "unsure", saturation: "Not sure", categories: [] });
  const parsed = parsePreviewState(JSON.stringify(state));
  assert.equal(parsed.state.quiz.shadeId, null);
  assert.equal(parsed.state.quiz.undertone, "Still exploring");
  assert.equal(parsed.state.quiz.saturation, "Not sure");
  assert.deepEqual(parsed.state.quiz.categories, []);
});

test("corrupt local data is preserved instead of silently overwritten", () => {
  const storage = memoryStorage({ [PREVIEW_STORAGE_KEY]: "{broken", [LEGACY_PROFILE_KEY]: "preserve-me" });
  const loaded = readPreviewState(storage);
  assert.equal(loaded.status, "corrupt");
  assert.equal(loaded.writable, false);
  assert.equal(persistPreviewState(storage, loaded.state, loaded.writable), false);
  assert.equal(storage.getItem(PREVIEW_STORAGE_KEY), "{broken");
  assert.equal(storage.getItem(LEGACY_PROFILE_KEY), "preserve-me");
});

test("a future storage version is not destructively downgraded", () => {
  const raw = JSON.stringify({ version: 99, customData: "retain" });
  const storage = memoryStorage({ [PREVIEW_STORAGE_KEY]: raw });
  const loaded = readPreviewState(storage);
  assert.equal(loaded.status, "unsupported");
  assert.equal(persistPreviewState(storage, loaded.state, loaded.writable), false);
  assert.equal(storage.getItem(PREVIEW_STORAGE_KEY), raw);
});

test("blocked storage and quota failures return explicit failure states", () => {
  const blocked = { getItem() { throw Error("blocked"); }, setItem() { throw Error("quota"); }, removeItem() { throw Error("blocked"); } };
  assert.equal(readPreviewState(blocked).status, "unavailable");
  assert.equal(readPreviewState(null).writable, false);
  assert.equal(persistPreviewState(blocked, createInitialPreviewState()), false);
  assert.equal(deletePreviewState(blocked), false);
});

test("local deletion leaves pre-existing legacy profile data untouched", () => {
  const storage = memoryStorage({ [PREVIEW_STORAGE_KEY]: "preview-data", [LEGACY_PROFILE_KEY]: "legacy-data" });
  assert.equal(deletePreviewState(storage), true);
  assert.equal(storage.getItem(PREVIEW_STORAGE_KEY), null);
  assert.equal(storage.getItem(LEGACY_PROFILE_KEY), "legacy-data");
});

test("invalid identities, trait values, categories and duplicate saves fail validation", () => {
  const state = createInitialPreviewState();
  assert.equal(validateQuizDraft({ ...state.quiz, shadeId: "pantone-not-licensed" }), false);
  assert.equal(validateQuizDraft({ ...state.quiz, undertone: "auto-diagnosed" }), false);
  assert.equal(validateQuizDraft({ ...state.quiz, saturation: "made-up" }), false);
  assert.equal(validateQuizDraft({ ...state.quiz, categories: ["Fragrance"] }), false);
  assert.equal(validatePreviewState({ ...state, savedIds: ["same", "same"] }), false);
});

test("review simulations and user-entered text remain local state, not member publication", () => {
  for (const simulation of MODERATION_STATES) {
    const state = createInitialPreviewState();
    state.reviews = [{
      id: "unit-local-draft", productId: "fixture-reference", shade: "Self-reported test shade",
      repurchase: "Unsure", observations: { appearance: "Self-reported" },
      text: "<script>not executable React text</script>", disclosure: "Not sure",
      shareProfile: false, profileSnapshot: null, simulation, updatedAt: "2026-11-12T12:00:00Z",
    }];
    assert.equal(validatePreviewState(state), true);
    const exported = JSON.parse(serializePreviewState(state));
    assert.equal(exported.reviews[0].simulation, simulation);
    assert.equal(exported.reviews[0].shareProfile, false);
    assert.equal(Object.hasOwn(exported.reviews[0], "published"), false);
  }
});
