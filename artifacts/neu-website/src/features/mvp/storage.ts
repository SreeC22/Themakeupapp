import { INITIAL_QUIZ_DRAFT, QUIZ_SWATCHES, QUIZ_STEPS, type QuizDraft } from "../quiz/_shared/quizDraft.ts";

export const PREVIEW_STORAGE_KEY = "neu.local-preview.v1";
export const LEGACY_PROFILE_KEY = "neu.guest-profile.v1";
export const PREVIEW_VERSION = 1;
export const MODERATION_STATES = ["Draft", "Pending", "Changes requested", "Approved", "Rejected"] as const;
export type ModerationState = typeof MODERATION_STATES[number];
export type LocalReview = {
  id: string;
  productId: string;
  shade: string;
  repurchase: string;
  observations: Record<string, string>;
  text: string;
  disclosure: string;
  shareProfile: boolean;
  profileSnapshot: QuizDraft | null;
  simulation: ModerationState;
  updatedAt: string;
};
export type PreviewState = {
  version: 1;
  quiz: QuizDraft;
  savedIds: string[];
  reviews: LocalReview[];
  privacy: "private" | "share-selected";
};
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type StorageStatus = "ready" | "saved" | "unavailable" | "corrupt" | "unsupported";
export type StorageRead = { state: PreviewState; status: StorageStatus; writable: boolean };

export function createInitialPreviewState(): PreviewState {
  return {
    version: 1,
    quiz: { ...INITIAL_QUIZ_DRAFT, products: [], categories: [], clues: [] },
    savedIds: [], reviews: [], privacy: "private",
  };
}

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function strings(value: unknown, max = 200): value is string[] {
  return Array.isArray(value) && value.length <= max && value.every((item) => typeof item === "string" && item.length <= 2000);
}
function text(value: unknown): value is string {
  return typeof value === "string" && value.length <= 10000;
}
function optionalChoice(value: unknown, options: string[]): boolean {
  return value === undefined || (typeof value === "string" && options.includes(value));
}
const PRODUCT_MATCHES = ["Blends in perfectly", "A little too light", "A little too dark", "Too orange", "Too pink", "Too yellow", "Gray or ashy", "Changes color after application", "Not sure yet"];

function boundedOptional(value: unknown, max: number) {
  return value === undefined || (typeof value === "string" && value.length <= max);
}

function validateCategoryPreferences(value: unknown) {
  if (value === undefined) return true;
  if (!record(value) || Object.keys(value).some((key) => !["Foundation", "Concealer", "Blush", "Lips"].includes(key))) return false;
  const fields = ["coverage", "finish", "formula", "intent", "pigmentation", "opacity"];
  return Object.values(value).every((preference) => record(preference)
    && Object.keys(preference).every((key) => fields.includes(key) || key === "colorFamilies")
    && fields.every((key) => boundedOptional(preference[key], 100))
    && (preference.colorFamilies === undefined || (strings(preference.colorFamilies, 10) && preference.colorFamilies.every((item) => item.length <= 100))));
}

/** Strict validation: unreadable records are never silently replaced with defaults. */
export function validateQuizDraft(value: unknown): value is QuizDraft {
  if (!record(value)) return false;
  if (!QUIZ_STEPS.includes(value.step as QuizDraft["step"])) return false;
  if (value.shadeId !== null && !QUIZ_SWATCHES.some((swatch) => swatch.id === value.shadeId)) return false;
  if (![null, "Warm", "Cool", "Neutral", "Olive", "Still exploring"].includes(value.undertone as null)) return false;
  if (![null, "yes", "maybe", "no", "unsure"].includes(value.olive as null)) return false;
  if (!["depthUnsure", "noCurrentMakeup", "newToMakeup", "currentMakeupSkipped"].every((key) => typeof value[key] === "boolean")) return false;
  if (!Number.isInteger(value.productMatchIndex) || Number(value.productMatchIndex) < 0) return false;
  if (value.referenceProductId !== null && !text(value.referenceProductId)) return false;
  if (value.veinClue !== null && !text(value.veinClue)) return false;
  if (!strings(value.clues) || !strings(value.categories) || !value.categories.every((category) => ["Foundation", "Concealer", "Blush", "Lips"].includes(category))) return false;
  if (!["budget", "finish", "skinType"].every((key) => text(value[key]))) return false;
  if (!Array.isArray(value.products) || value.products.length > 50 || !value.products.every((product) =>
    record(product) && ["id", "brand", "product", "formula", "shade"].every((key) => text(product[key]))
    && ["Foundation", "Concealer", "Skin tint", "BB or CC cream"].includes(String(product.type))
    && typeof product.brandUnknown === "boolean" && typeof product.shadeUnknown === "boolean"
    && strings(product.match) && product.match.every((item) => PRODUCT_MATCHES.includes(item))
    && boundedOptional(product.catalogProductId, 200) && boundedOptional(product.catalogShadeId, 200)
    && boundedOptional(product.oxidation, 200))) return false;
  if (!optionalChoice(value.oliveSubtype, ["", "Warm-olive", "Cool-olive", "Neutral-olive", "Not sure"])) return false;
  if (!optionalChoice(value.saturation, ["", "Muted", "Balanced", "Bright / saturated", "Not sure"])) return false;
  if (!optionalChoice(value.coverage, ["", "Sheer", "Medium", "Full", "No preference"])) return false;
  if (!optionalChoice(value.lipPigmentation, ["", "Even", "Upper lip darker", "Lower lip darker", "Darker outline", "Overall pigmented", "Two-toned", "Not sure"])) return false;
  if (!optionalChoice(value.lipOpacity, ["", "Sheer / natural", "Opaque / even", "Flexible", "Not sure"])) return false;
  if (value.concealerIntent !== undefined && (!strings(value.concealerIntent) || !value.concealerIntent.every((item) => ["Spot concealing", "Under-eye brightening", "Color correcting", "Not sure"].includes(item)))) return false;
  if (value.colorFamilies !== undefined && (!strings(value.colorFamilies) || !value.colorFamilies.every((item) => ["Rose", "Berry", "Peach", "Nude", "Coral", "Red", "Brown", "Open to anything"].includes(item)))) return false;
  if (!optionalChoice(value.fragrancePreference, ["", "Prefer fragrance-free", "No preference", "Not sure"])) return false;
  if (!optionalChoice(value.sensitivityPreference, ["", "I consider my skin sensitive", "No preference", "Not sure"])) return false;
  if (!optionalChoice(value.applicationStyle, ["", "Fingers", "Brush", "Sponge", "Flexible", "Not sure"])) return false;
  if (!optionalChoice(value.surfaceRedness, ["", "I notice surface redness", "I do not notice it", "Not sure"])) return false;
  if (!optionalChoice(value.onboardingPath, ["known", "manual"])) return false;
  if (!optionalChoice(value.onboardingScreen, ["start", "reference", "depth", "coloring", "skin"])) return false;
  if (!validateCategoryPreferences(value.categoryPreferences)) return false;
  return true;
}

export function validateLocalReview(value: unknown): value is LocalReview {
  if (!record(value)) return false;
  return ["id", "productId", "shade", "repurchase", "text", "disclosure", "updatedAt"].every((key) => text(value[key]))
    && ["", "Yes", "No", "Unsure"].includes(String(value.repurchase))
    && record(value.observations) && Object.entries(value.observations).length <= 30
    && Object.values(value.observations).every(text)
    && typeof value.shareProfile === "boolean"
    && (value.profileSnapshot === null || validateQuizDraft(value.profileSnapshot))
    && MODERATION_STATES.includes(value.simulation as ModerationState);
}

export function validatePreviewState(value: unknown): value is PreviewState {
  return record(value) && value.version === PREVIEW_VERSION && validateQuizDraft(value.quiz)
    && strings(value.savedIds, 500) && new Set(value.savedIds).size === value.savedIds.length
    && Array.isArray(value.reviews) && value.reviews.length <= 100 && value.reviews.every(validateLocalReview)
    && ["private", "share-selected"].includes(String(value.privacy));
}

/** Pure parser, safe to import in Node with --experimental-strip-types. */
export function parsePreviewState(raw: string | null): StorageRead {
  if (raw === null) return { state: createInitialPreviewState(), status: "ready", writable: true };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (record(parsed) && typeof parsed.version === "number" && parsed.version !== PREVIEW_VERSION) {
      return { state: createInitialPreviewState(), status: "unsupported", writable: false };
    }
    if (validatePreviewState(parsed)) return { state: parsed, status: "saved", writable: true };
  } catch { /* Preserve the original unreadable value. */ }
  return { state: createInitialPreviewState(), status: "corrupt", writable: false };
}

export function readPreviewState(storage: StorageLike | null): StorageRead {
  try {
    if (!storage) throw new Error("Storage unavailable");
    return parsePreviewState(storage.getItem(PREVIEW_STORAGE_KEY));
  } catch {
    return { state: createInitialPreviewState(), status: "unavailable", writable: false };
  }
}

export function persistPreviewState(storage: StorageLike | null, state: PreviewState, writable = true): boolean {
  if (!storage || !writable || !validatePreviewState(state)) return false;
  try {
    // A second tab or extension may have changed the stored value since this session loaded.
    if (!parsePreviewState(storage.getItem(PREVIEW_STORAGE_KEY)).writable) return false;
    storage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(state));
    return true;
  }
  catch { return false; }
}

export function serializePreviewState(state: PreviewState): string {
  return JSON.stringify(state, null, 2);
}

/** Explicitly user-confirmed deletion of this preview only. Legacy state is preserved. */
export function deletePreviewState(storage: StorageLike | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(PREVIEW_STORAGE_KEY);
    return true;
  } catch { return false; }
}
