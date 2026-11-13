import type { NeuCatalog, NeuProfileInput } from "@workspace/api-client-react";
import { QUIZ_SWATCHES, type CategoryPreference, type ProductMatch, type QuizDraft, type QuizProduct, type OnboardingScreen } from "../quiz/_shared/quizDraft.ts";

export const FIT_OPTIONS = [
  { label: "Perfect match", value: "Blends in perfectly" },
  { label: "Too light", value: "A little too light" },
  { label: "Too dark", value: "A little too dark" },
  { label: "Too yellow", value: "Too yellow" },
  { label: "Too orange", value: "Too orange" },
  { label: "Too pink", value: "Too pink" },
  { label: "Too gray", value: "Gray or ashy" },
  { label: "Not sure", value: "Not sure yet" },
] as const;
export const OXIDATION_OPTIONS = ["No change noticed", "Gets darker", "Gets more orange", "Other color change", "Not sure"];

/** Preserve canonical Stage 1 oldProductMatch values in storage and API requests. */
export function oldProductMatch(current: ProductMatch[], value: ProductMatch): ProductMatch[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (value === "Blends in perfectly" || value === "Not sure yet") return [value];
  const opposite = value === "A little too light" ? "A little too dark" : value === "A little too dark" ? "A little too light" : null;
  return [...current.filter((item) => item !== "Blends in perfectly" && item !== "Not sure yet" && item !== opposite), value];
}

export function newReference(): QuizProduct {
  return { id: `prior-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type: "Foundation", brand: "", brandUnknown: false, product: "", formula: "", shade: "", shadeUnknown: false, match: [] };
}

function exact<T extends { name: string }>(items: T[], value: string): T | undefined {
  const matches = items.filter((item) => item.name.toLowerCase() === value.trim().toLowerCase());
  return matches.length === 1 ? matches[0] : undefined;
}

export function resolveReference(catalog: NeuCatalog | undefined, reference: QuizProduct) {
  const brand = exact(catalog?.brands ?? [], reference.brand);
  const products = (catalog?.products ?? []).filter((item) => item.brandId === brand?.id && item.category === reference.type);
  const product = exact(products, reference.product);
  const shades = (catalog?.shades ?? []).filter((item) => item.productId === product?.id);
  const shade = exact(shades, reference.shade);
  return { brand, products, product, shades, shade };
}

/** Changing a parent selection clears dependent identities, never a palette swatch. */
export function editReference(reference: QuizProduct, patch: Partial<QuizProduct>, catalog?: NeuCatalog): QuizProduct {
  const parentChanged = (patch.brand !== undefined && patch.brand !== reference.brand)
    || (patch.type !== undefined && patch.type !== reference.type);
  const productChanged = patch.product !== undefined && patch.product !== reference.product;
  const identityEdited = parentChanged || productChanged || patch.shade !== undefined;
  const next = {
    ...reference,
    ...(parentChanged ? { product: "", shade: "", catalogProductId: undefined, catalogShadeId: undefined } : {}),
    ...(productChanged ? { shade: "", catalogShadeId: undefined } : {}),
    ...patch,
  };
  if (!identityEdited) return next;
  if (!catalog) {
    // Fit-only edits while offline must retain the exact selection, not demote it.
    if (parentChanged || productChanged || patch.shade !== undefined) {
      next.catalogProductId = undefined;
      next.catalogShadeId = undefined;
    }
    return next;
  }
  const resolved = resolveReference(catalog, next);
  return { ...next, catalogProductId: resolved.product?.id, catalogShadeId: resolved.shade?.id };
}

export function onboardingScreen(draft: QuizDraft): OnboardingScreen {
  if (draft.onboardingScreen) return draft.onboardingScreen;
  if (draft.step === "products") return "reference";
  if (draft.step === "undertone") return "coloring";
  if (draft.step === "categories" || draft.step === "review") return "skin";
  return draft.shadeId || draft.depthUnsure ? "depth" : "start";
}

export function onboardingJourney(draft: QuizDraft) {
  const screen = onboardingScreen(draft);
  const path = draft.onboardingPath ?? (screen === "reference" ? "known" : "manual");
  const screens: OnboardingScreen[] = path === "manual" ? ["start", "depth", "coloring", "skin"] : ["start", "reference", "skin"];
  const index = Math.max(0, screens.indexOf(screen));
  return { screen, path, screens, index };
}

/** Legacy preferences remain readable without overwriting the original fields. */
export function categoryPreference(draft: QuizDraft, category: "Foundation" | "Concealer" | "Blush" | "Lips"): CategoryPreference {
  const legacy: CategoryPreference = category === "Foundation" ? { coverage: draft.coverage, finish: draft.finish }
    : category === "Concealer" ? { intent: draft.concealerIntent?.join(", ") }
    : category === "Blush" ? { colorFamilies: draft.colorFamilies }
    : { pigmentation: draft.lipPigmentation, opacity: draft.lipOpacity, colorFamilies: draft.colorFamilies };
  return { ...legacy, ...draft.categoryPreferences?.[category] };
}

function allowed<T extends string>(value: string | undefined, options: readonly T[]): T | undefined {
  return options.includes(value as T) ? value as T : undefined;
}

export function neuProfileInput(draft: QuizDraft): NeuProfileInput {
  // An explicitly selected olive cast is a user trait, not an inference from a product.
  const isOlive = draft.undertone === "Olive" || draft.olive === "yes";
  const oliveSubtype = draft.oliveSubtype || (draft.olive === "yes" && ["Warm", "Cool", "Neutral"].includes(draft.undertone ?? "") ? `${draft.undertone}-olive` : "");
  return {
    depth: QUIZ_SWATCHES.find((item) => item.id === draft.shadeId)?.group ?? null,
    undertone: isOlive ? "Olive" : draft.undertone,
    oliveSubtype: allowed(oliveSubtype, ["", "Warm-olive", "Cool-olive", "Neutral-olive", "Not sure"]),
    saturation: allowed(draft.saturation, ["", "Muted", "Balanced", "Bright / saturated", "Not sure"]),
    skinType: allowed(draft.skinType, ["", "Oily", "Dry", "Combination", "Normal", "Sensitive"]),
    budget: draft.budget.slice(0, 100),
    references: draft.products.filter((item) => item.catalogShadeId).map((item) => ({
      shadeId: item.catalogShadeId!, fit: item.match, ...(item.oxidation ? { oxidation: item.oxidation } : {}),
    })),
    preferences: {
      Foundation: categoryPreference(draft, "Foundation"), Concealer: categoryPreference(draft, "Concealer"),
      Blush: categoryPreference(draft, "Blush"), Lips: categoryPreference(draft, "Lips"),
    },
  };
}
