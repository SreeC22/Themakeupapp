import type { NeuCatalog, NeuRecommendations, NeuProfileInput } from "@workspace/api-client-react";

export const LOOK_CATEGORIES = ["Foundation", "Concealer", "Blush", "Lips"] as const;
export type LookCategory = typeof LOOK_CATEGORIES[number];
export const OWNED_CATEGORIES = [...LOOK_CATEGORIES, "Eyes", "Multi-use", "Setting"] as const;
export type OwnedCategory = typeof OWNED_CATEGORIES[number];
export const OCCASIONS = ["Everyday", "Soft Glam", "Party Glam", "Work & College"] as const;
export type Occasion = typeof OCCASIONS[number];
export type LookBudget = { tier: "Any" | "Drugstore" | "Mid-range" | "Luxury"; limitUSD?: number };
export type OwnedProduct = { id: string; category: OwnedCategory; brand: string; product: string; shade: string; shadeId?: string };
export type LookChoice = { kind: "catalog"; shadeId: string } | { kind: "owned"; ownedId: string };
export type LookSelections = Partial<Record<LookCategory, LookChoice | null>>;
export type SavedLook = { id: string; name: string; occasion: Occasion; budget: LookBudget; selections: LookSelections; updatedAt: string };
export type LookOption = {
  choice: LookChoice; title: string; brand: string; shade: string; reasons: string[]; limitations: string[];
  supported: boolean; owned: boolean; priceUSD: number | null; sourceUrl?: string; detailPath?: string;
};
export type LookSlot = { category: LookCategory; selected: LookOption | null; retainedChoice: LookChoice | null; options: LookOption[]; unresolved: string[] };
export type LookPlan = {
  slots: LookSlot[]; selectedCount: number; supportedCount: number; knownSpendUSD: number;
  totalUSD: number | null; budgetStatus: "unverified" | "within" | "over"; notes: string[];
};
export const OCCASION_NOTES: Record<Occasion, string> = {
  Everyday: "An easy, softly colored set. Adjust coverage to what feels like you.",
  "Soft Glam": "Soft cheek color with a rose, nude or brown lip direction.",
  "Party Glam": "A more expressive red or berry lip direction with softer cheek color.",
  "Work & College": "A practical, softly colored set for your day—not a rule about how you should look.",
};
const palette: Record<Occasion, { Blush: string[]; Lips: string[] }> = {
  Everyday: { Blush: ["Pink", "Rose", "Peach", "Nude"], Lips: ["Rose", "Nude", "Brown"] },
  "Soft Glam": { Blush: ["Pink", "Rose", "Peach", "Nude"], Lips: ["Rose", "Nude", "Brown", "Mauve"] },
  "Party Glam": { Blush: ["Pink", "Rose", "Peach", "Nude"], Lips: ["Red", "Berry"] },
  "Work & College": { Blush: ["Pink", "Rose", "Peach", "Nude"], Lips: ["Rose", "Nude", "Brown"] },
};
export function lookRequest(profile: NeuProfileInput, occasion: Occasion): NeuProfileInput {
  const preferences = { ...profile.preferences };
  for (const category of ["Blush", "Lips"] as const) {
    const existing = preferences[category];
    const chosen = existing?.colorFamilies?.filter(f => f !== "Open to anything");
    preferences[category] = { ...existing, colorFamilies: chosen?.length ? [...chosen] : [...palette[occasion][category]] };
  }
  // A look's tier is a maximum, not an exact-brand-tier filter. Apply it after source matching.
  return { ...profile, budget: undefined, preferences };
}
function values(catalog: NeuCatalog, shadeId: string, field: string, asOf: string): string[] {
  const shade = catalog.shades.find(s => s.id === shadeId);
  const product = catalog.products.find(p => p.id === shade?.productId);
  return [...new Set([...(shade?.claims ?? []), ...(product?.claims ?? [])].filter(c => {
    const age = (Date.parse(asOf) - Date.parse(c.checkedOn)) / 86400000;
    return c.field === field && c.basis === "verified" && /^https:\/\//.test(c.sourceUrl) && age >= 0 && age <= 30;
  }).map(c => c.value))];
}
const tierRank = { Drugstore: 1, "Mid-range": 2, Luxury: 3 };
export function sameChoice(a: LookChoice | null | undefined, b: LookChoice | null | undefined): boolean {
  return !!a && !!b && a.kind === b.kind && (a.kind === "catalog" && b.kind === "catalog" ? a.shadeId === b.shadeId : a.kind === "owned" && b.kind === "owned" && a.ownedId === b.ownedId);
}
export function buildLook(input: {
  catalog: NeuCatalog; recommendations: NeuRecommendations; occasion: Occasion; budget: LookBudget;
  owned: OwnedProduct[]; selections?: LookSelections; profile?: NeuProfileInput; asOf?: string;
}): LookPlan {
  const { catalog, recommendations, occasion, budget, owned } = input;
  const asOf = input.asOf ?? new Date().toISOString().slice(0, 10);
  let remainingBudget = budget.limitUSD;
  const slots = LOOK_CATEGORIES.map((category): LookSlot => {
    const options: LookOption[] = recommendations.candidates.filter(c => c.category === category).flatMap(c => {
      const shade = catalog.shades.find(s => s.id === c.shadeId && s.productId === c.productId);
      const product = catalog.products.find(p => p.id === c.productId && p.category === category);
      const brand = catalog.brands.find(b => b.id === product?.brandId);
      if (!shade || !product || !brand || shade.status !== "verified") return [];
      if (budget.tier !== "Any" && tierRank[brand.tier] > tierRank[budget.tier]) return [];
      const age = (Date.parse(asOf) - Date.parse(c.checkedOn)) / 86400000;
      if (!Number.isFinite(age) || age < 0 || age > 30) return [];
      const prices = values(catalog, shade.id, "price_usd", asOf);
      const priceUSD = prices.length === 1 && /^\d+(\.\d{1,2})?$/.test(prices[0]) && Number(prices[0]) > 0 ? Number(prices[0]) : null;
      const complexion = category === "Foundation" || category === "Concealer";
      const families = values(catalog, shade.id, "color_family", asOf);
      const pref = input.profile?.preferences?.[category];
      const chosen = (v?: string) => !!v && !["No preference", "Flexible", "Not sure", "Open to anything"].includes(v);
      const missingPreference = (["coverage", "finish", "formula"] as const).some(field =>
        chosen(pref?.[field]) && !values(catalog, shade.id, field, asOf).some(v => v.toLowerCase() === pref![field]!.toLowerCase()));
      const desiredOpacity = pref?.opacity?.includes("Opaque") || pref?.opacity?.includes("even") ? "High coverage"
        : pref?.opacity?.includes("Sheer") ? "Sheer" : null;
      const opacityMissing = category === "Lips" && desiredOpacity !== null && !values(catalog, shade.id, "opacity", asOf).includes(desiredOpacity);
      const supported = (complexion ? c.label === "Descriptor-aligned candidate" : families.length > 0) && !missingPreference && !opacityMissing;
      return [{
        choice: { kind: "catalog", shadeId: shade.id } as LookChoice,
        title: product.name, brand: brand.name, shade: shade.name, supported, owned: false, priceUSD,
        reasons: [...c.reasons, ...(complexion ? [] : [`Source color family: ${families.join(", ") || "unverified"}. The occasion direction is editorial, not tested compatibility.`])],
        limitations: [...c.limitations, ...(missingPreference || opacityMissing ? ["A requested category preference lacks verified support; review this as an unresolved alternative."] : []),
          ...(priceUSD === null ? ["Price and budget fit are unverified."] : [])],
        sourceUrl: /^https:\/\//.test(product.sourceUrl) ? product.sourceUrl : undefined,
        detailPath: `/catalog/shades/${encodeURIComponent(shade.id)}`,
      }];
    });
    for (const item of owned.filter(o => o.category === category)) {
      const catalogOption = options.find(o => o.choice.kind === "catalog" && o.choice.shadeId === item.shadeId
        && o.title === item.product && o.brand === item.brand && o.shade === item.shade);
      options.unshift({
        choice: { kind: "owned", ownedId: item.id }, title: item.product, brand: item.brand, shade: item.shade,
        supported: catalogOption?.supported ?? false, owned: true, priceUSD: 0,
        reasons: ["You marked this product as already owned. Reusing it adds no new purchase to this plan.", ...(catalogOption?.reasons ?? [])],
        limitations: catalogOption?.limitations ?? ["Ownership is self-reported, not proof of complexion fit or compatibility. This item has no supported candidate under the current constraints."],
        sourceUrl: catalogOption?.sourceUrl, detailPath: catalogOption?.detailPath,
      });
    }
    const explicit = input.selections && Object.hasOwn(input.selections, category);
    const requested = input.selections?.[category];
    const automatic = options.filter(o => o.supported && (remainingBudget === undefined || o.priceUSD === null || o.priceUSD <= remainingBudget))
      .sort((a, b) => Number(b.owned) - Number(a.owned) || (remainingBudget === undefined ? 0 : Number(a.priceUSD === null) - Number(b.priceUSD === null)));
    const selected = explicit
      ? requested ? options.find(o => sameChoice(o.choice, requested)) ?? null : null
      : automatic[0] ?? null;
    if (selected?.priceUSD !== null && selected?.priceUSD !== undefined && remainingBudget !== undefined) remainingBudget -= selected.priceUSD;
    const unresolved: string[] = [];
    if (!selected) unresolved.push(requested
      ? "The saved choice is no longer supported under the current evidence, budget tier or profile. Your saved selection is preserved; choose an alternative."
      : "No supported selection yet. Review the available evidence or reuse an owned product explicitly.");
    else if (!selected.supported) unresolved.push("This is your explicit choice, not a verified personal match or coordinated color recommendation.");
    if (selected && budget.limitUSD !== undefined && selected.priceUSD === null) unresolved.push("A verified price is missing, so this slot's overall-budget fit cannot be confirmed.");
    return { category, selected, retainedChoice: explicit ? requested ?? null : selected?.choice ?? null, options, unresolved };
  });
  const selected = slots.flatMap(s => s.selected ? [s.selected] : []);
  const knownSpendUSD = Math.round(selected.reduce((sum, s) => sum + (s.priceUSD ?? 0), 0) * 100) / 100;
  const totalUSD = selected.length === 4 && selected.every(s => s.priceUSD !== null) ? knownSpendUSD : null;
  return {
    slots, selectedCount: selected.length, supportedCount: selected.filter(s => s.supported).length, knownSpendUSD, totalUSD,
    budgetStatus: budget.limitUSD !== undefined && knownSpendUSD > budget.limitUSD ? "over"
      : totalUSD !== null && budget.limitUSD !== undefined ? "within" : "unverified",
    notes: [OCCASION_NOTES[occasion], "Occasions are styling directions, not manufacturer wear-time, safety or formula-layering claims.",
      "A set is not a tested compatibility promise. Unresolved slots stay visible; no four-item match is invented.",
      "Budget tiers are editorial brand groupings, not verified prices. Unknown prices are never counted as free.",
      "Retailer links open product pages and may default to a different shade. Confirm the exact product, shade, price and stock before buying.",
      ...recommendations.notes],
  };
}
