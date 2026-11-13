import test from "node:test";
import assert from "node:assert/strict";
import {
  categoryPreference, editReference, FIT_OPTIONS, neuProfileInput,
  newReference, oldProductMatch, onboardingScreen, onboardingJourney, resolveReference,
} from "../src/features/mvp/neu-profile.ts";
import {
  createInitialPreviewState, validateQuizDraft, parsePreviewState,
  serializePreviewState, PREVIEW_STORAGE_KEY, persistPreviewState, readPreviewState,
} from "../src/features/mvp/storage.ts";
import { DEPTH_GROUPS, QUIZ_SWATCHES } from "../src/features/quiz/_shared/quizDraft.ts";

// Deliberately synthetic identities, used only to exercise exact selection and isolation.
const catalog = {
  brands: [{ id: "unit-brand", name: "Unit Test Brand", tier: "Drugstore", candidate: false }],
  products: [
    { id: "unit-foundation", brandId: "unit-brand", name: "Unit Foundation", category: "Foundation" },
    { id: "unit-concealer", brandId: "unit-brand", name: "Unit Concealer", category: "Concealer" },
  ],
  shades: [
    { id: "unit-foundation-cool", productId: "unit-foundation", name: "10 Cool", description: "Test only" },
    { id: "unit-foundation-warm", productId: "unit-foundation", name: "10 Warm", description: "Test only" },
    { id: "unit-concealer-cool", productId: "unit-concealer", name: "10 Cool", description: "Test only" },
  ],
};
const draft = () => createInitialPreviewState().quiz;
function selectedReference() {
  let reference = newReference();
  reference = editReference(reference, { brand: "Unit Test Brand" }, catalog);
  reference = editReference(reference, { product: "Unit Foundation" }, catalog);
  return editReference(reference, { shade: "10 Cool" }, catalog);
}

test("fresh onboarding begins with two-path choice without changing the legacy depth step", () => {
  const quiz = draft();
  assert.equal(quiz.step, "depth");
  assert.equal(onboardingScreen(quiz), "start");
  assert.equal(onboardingScreen({ ...quiz, onboardingPath: "known", onboardingScreen: "reference" }), "reference");
  assert.equal(onboardingScreen({ ...quiz, onboardingPath: "manual", onboardingScreen: "depth" }), "depth");
});

test("legacy quiz places remain resumable and new screen state survives Learn-return serialization", () => {
  assert.equal(onboardingScreen({ ...draft(), step: "undertone" }), "coloring");
  assert.equal(onboardingScreen({ ...draft(), step: "products" }), "reference");
  assert.equal(onboardingScreen({ ...draft(), step: "categories" }), "skin");
  for (const screen of ["start", "reference", "depth", "coloring", "skin"]) {
    const state = createInitialPreviewState();
    state.quiz.onboardingScreen = screen;
    assert.equal(onboardingScreen(parsePreviewState(serializePreviewState(state)).state.quiz), screen);
  }
});

test("both journeys backtrack consistently, including a resumed legacy coloring step", () => {
  for (const path of ["known", "manual"]) {
    const journey = onboardingJourney({ ...draft(), onboardingPath: path, onboardingScreen: "skin" });
    assert.equal(journey.screens[journey.index - 1], path === "known" ? "reference" : "coloring");
    assert.equal(journey.index + 1, journey.screens.length);
  }
  const legacy = onboardingJourney({ ...draft(), step: "undertone" });
  const advanced = onboardingJourney({ ...draft(), onboardingPath: legacy.path, onboardingScreen: "skin" });
  assert.equal(advanced.screens[advanced.index - 1], "coloring");
  assert.equal(advanced.screens.length, legacy.screens.length);
});

test("brand, product and shade resolve exactly within product type, never by a nearby code", () => {
  const reference = selectedReference();
  assert.equal(reference.catalogProductId, "unit-foundation");
  assert.equal(reference.catalogShadeId, "unit-foundation-cool");
  assert.equal(resolveReference(catalog, { ...reference, shade: "10" }).shade, undefined);
  assert.equal(editReference(reference, { product: "Unit Concealer" }, catalog).catalogProductId, undefined);
  const concealer = editReference(editReference(editReference(reference, { type: "Concealer" }, catalog), { product: "Unit Concealer" }, catalog), { shade: "10 Cool" }, catalog);
  assert.equal(concealer.catalogShadeId, "unit-concealer-cool");
});

test("changing brand or product clears dependent catalog IDs and shade text", () => {
  const reference = selectedReference();
  const changedBrand = editReference(reference, { brand: "Unreviewed test brand" }, catalog);
  assert.equal(changedBrand.catalogProductId, undefined);
  assert.equal(changedBrand.catalogShadeId, undefined);
  assert.equal(changedBrand.product, "");
  assert.equal(changedBrand.shade, "");
  const changedProduct = editReference(reference, { product: "Other test line" }, catalog);
  assert.equal(changedProduct.catalogShadeId, undefined);
  assert.equal(changedProduct.shade, "");
});

test("missing catalog input is preserved distinctly as self-reported with no invented identity", () => {
  const reference = editReference(newReference(), { brand: "My absent brand", product: "My absent product", shade: "My own shade" }, catalog);
  assert.equal(reference.brand, "My absent brand");
  assert.equal(reference.product, "My absent product");
  assert.equal(reference.shade, "My own shade");
  assert.equal(reference.catalogProductId, undefined);
  assert.equal(reference.catalogShadeId, undefined);
  const quiz = { ...draft(), products: [reference] };
  assert.deepEqual(neuProfileInput(quiz).references, []);
  assert.equal(validateQuizDraft(quiz), true);
});

test("catalog unavailable produces no fabricated selections and fit edits retain saved catalog IDs", () => {
  const reference = selectedReference();
  const offlineFitEdit = editReference(reference, { match: ["Too pink"] });
  assert.equal(offlineFitEdit.catalogShadeId, reference.catalogShadeId);
  assert.equal(offlineFitEdit.catalogProductId, reference.catalogProductId);
  const unavailable = editReference(newReference(), { brand: "Unit Test Brand", product: "Unit Foundation", shade: "10 Cool" });
  assert.equal(unavailable.catalogShadeId, undefined);
});

test("duplicate catalog names are ambiguous, not silently resolved to the first record", () => {
  const duplicate = { ...catalog, shades: [...catalog.shades, { ...catalog.shades[0], id: "another-unit-id" }] };
  assert.equal(resolveReference(duplicate, selectedReference()).shade, undefined);
});

test("perfect-match UI maps to the original canonical value, not a new match string", () => {
  const option = FIT_OPTIONS.find((item) => item.label === "Perfect match");
  assert.equal(option.value, "Blends in perfectly");
  assert.deepEqual(oldProductMatch(["Too pink"], option.value), ["Blends in perfectly"]);
  assert.deepEqual(oldProductMatch(["Blends in perfectly"], "Too yellow"), ["Too yellow"]);
  assert.deepEqual(oldProductMatch(["A little too light"], "A little too dark"), ["A little too dark"]);
  assert.deepEqual(oldProductMatch(["Too pink"], "Not sure yet"), ["Not sure yet"]);
  assert.deepEqual(oldProductMatch(["Gray or ashy"], "Gray or ashy"), []);
});

test("fit corrections and oxidation are sent unchanged, never used to guess depth or undertone", () => {
  const reference = editReference(selectedReference(), { match: ["A little too dark", "Too pink"], oxidation: "Gets darker" }, catalog);
  const request = neuProfileInput({ ...draft(), products: [reference] });
  assert.deepEqual(request.references, [{ shadeId: "unit-foundation-cool", fit: ["A little too dark", "Too pink"], oxidation: "Gets darker" }]);
  assert.equal(request.depth, null);
  assert.equal(request.undertone, null);
});

test("even a perfect catalog reference never derives a palette swatch ID", () => {
  const quiz = { ...draft(), products: [{ ...selectedReference(), match: ["Blends in perfectly"] }] };
  const request = neuProfileInput(quiz);
  assert.equal(quiz.shadeId, null);
  assert.equal(request.depth, null);
  assert.equal(request.undertone, null);
  assert.equal(validateQuizDraft({ ...quiz, shadeId: "unit-foundation-cool" }), false);
});

test("all stable manual palette IDs map only to their existing eight depth labels", () => {
  for (const shade of QUIZ_SWATCHES) {
    const request = neuProfileInput({ ...draft(), shadeId: shade.id });
    assert.equal(request.depth, shade.group);
    assert.ok(DEPTH_GROUPS.includes(request.depth));
  }
  assert.equal(neuProfileInput({ ...draft(), depthUnsure: true }).depth, null);
});

test("cool, warm and neutral olive subtypes remain distinct; unsure never becomes warm", () => {
  for (const oliveSubtype of ["Cool-olive", "Warm-olive", "Neutral-olive", "Not sure"]) {
    const request = neuProfileInput({ ...draft(), undertone: "Olive", oliveSubtype });
    assert.equal(request.undertone, "Olive");
    assert.equal(request.oliveSubtype, oliveSubtype);
  }
  const uncertain = neuProfileInput({ ...draft(), undertone: "Still exploring", olive: "maybe" });
  assert.equal(uncertain.undertone, "Still exploring");
  assert.equal(uncertain.oliveSubtype, "");
  assert.equal(neuProfileInput({ ...draft(), undertone: "Cool", olive: "yes" }).oliveSubtype, "Cool-olive");
});

test("both onboarding paths produce the same optional request shape and shared skin type", () => {
  const base = { ...draft(), skinType: "Combination", undertone: "Neutral" };
  assert.deepEqual(neuProfileInput({ ...base, onboardingPath: "manual" }), neuProfileInput({ ...base, onboardingPath: "known" }));
  assert.equal(neuProfileInput({ ...draft(), skinType: "Not sure" }).skinType, undefined);
});

test("category preferences are independent and two-toned lips stay explicit", () => {
  const quiz = { ...draft(), categoryPreferences: {
    Foundation: { coverage: "Full", finish: "Matte" },
    Concealer: { intent: "Spot concealing" },
    Blush: { formula: "Liquid", finish: "Dewy" },
    Lips: { pigmentation: "Two-toned", coverage: "Sheer", opacity: "Flexible", finish: "Satin", colorFamilies: ["Brown"] },
  } };
  assert.equal(validateQuizDraft(quiz), true);
  const request = neuProfileInput(quiz);
  assert.equal(request.preferences.Foundation.finish, "Matte");
  assert.equal(request.preferences.Blush.finish, "Dewy");
  assert.equal(request.preferences.Lips.pigmentation, "Two-toned");
  assert.equal(request.preferences.Concealer.finish, undefined);
  assert.equal(request.preferences.Foundation.pigmentation, undefined);
});

test("legacy preference fallbacks remain readable without rewriting old storage fields", () => {
  const quiz = { ...draft(), finish: "Matte", coverage: "Full", lipPigmentation: "Two-toned", concealerIntent: ["Spot concealing", "Under-eye brightening"] };
  assert.equal(categoryPreference(quiz, "Foundation").finish, "Matte");
  assert.equal(categoryPreference(quiz, "Lips").pigmentation, "Two-toned");
  const overridden = { ...quiz, categoryPreferences: { Foundation: { finish: "" } } };
  assert.equal(categoryPreference(overridden, "Foundation").finish, "");
  assert.equal(overridden.finish, "Matte");
});

test("multiple references, corrections and category preferences round-trip under the unchanged storage key", () => {
  const state = createInitialPreviewState();
  state.quiz.products = [selectedReference(), { ...newReference(), brand: "Self-reported", match: ["Not sure yet"] }];
  state.quiz.onboardingPath = "known";
  state.quiz.onboardingScreen = "skin";
  state.quiz.categoryPreferences = { Lips: { pigmentation: "Two-toned", colorFamilies: ["Berry"] } };
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  assert.equal(PREVIEW_STORAGE_KEY, "neu.local-preview.v1");
  assert.equal(persistPreviewState(storage, state), true);
  assert.deepEqual(readPreviewState(storage).state, state);
  state.quiz.products = state.quiz.products.filter((item) => item.id !== state.quiz.products[0].id);
  assert.equal(persistPreviewState(storage, state), true);
  assert.equal(readPreviewState(storage).state.quiz.products.length, 1);
});

test("all new fields are optional for old records and bounded when present", () => {
  const quiz = draft();
  assert.equal(validateQuizDraft(quiz), true);
  const reference = selectedReference();
  for (const key of ["catalogProductId", "catalogShadeId", "oxidation"]) {
    assert.equal(validateQuizDraft({ ...quiz, products: [{ ...reference, [key]: "x".repeat(200) }] }), true);
    assert.equal(validateQuizDraft({ ...quiz, products: [{ ...reference, [key]: "x".repeat(201) }] }), false);
    assert.equal(validateQuizDraft({ ...quiz, products: [{ ...reference, [key]: 42 }] }), false);
  }
  assert.equal(validateQuizDraft({ ...quiz, categoryPreferences: { Lips: { finish: "x".repeat(101) } } }), false);
  assert.equal(validateQuizDraft({ ...quiz, categoryPreferences: { Blush: { colorFamilies: Array(11).fill("Rose") } } }), false);
  assert.equal(validateQuizDraft({ ...quiz, categoryPreferences: { Foundation: { confidence: 99 } } }), false);
  assert.equal(validateQuizDraft({ ...quiz, categoryPreferences: { Eyes: { finish: "Matte" } } }), false);
  assert.equal(validateQuizDraft({ ...quiz, onboardingPath: "guessed" }), false);
  assert.equal(validateQuizDraft({ ...quiz, onboardingScreen: "purchase-gate" }), false);
});

test("a corrupt new-field record remains locked rather than silently dropping its data", () => {
  const state = createInitialPreviewState();
  state.quiz.products = [{ ...selectedReference(), catalogShadeId: "x".repeat(201) }];
  const parsed = parsePreviewState(JSON.stringify(state));
  assert.equal(parsed.status, "corrupt");
  assert.equal(parsed.writable, false);
});
