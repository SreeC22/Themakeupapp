import type { NeuProfileInput } from "@workspace/api-client-react";
import { buildLook, LOOK_CATEGORIES, sameChoice, type LookBudget, type LookChoice, type LookCategory } from "../looks/model.ts";
import { assessStep, facts, permittedRole, resolveEditItem, type EditItem, type NeuEdit, type RoutineRole, type WardrobeContext } from "./model.ts";
import type { EditDraft } from "./working-draft.ts";

export const CORE_ROLES: Record<LookCategory, RoutineRole> = { Foundation: "Foundation", Concealer: "Concealer", Blush: "Cheeks", Lips: "Lip color" };
/** No occasion palette: this request describes the person, not a particular routine. */
export function editRequest(profile: NeuProfileInput): NeuProfileInput {
  return { ...profile, budget: undefined };
}
export function budgetInput(tier: LookBudget["tier"], limit: string): LookBudget | null {
  if (!limit.trim()) return { tier };
  const amount = Number(limit);
  return Number.isFinite(amount) && amount > 0 && amount <= 10000 ? { tier, limitUSD: amount } : null;
}
export function effectiveEdit(draft: EditDraft | undefined, saved?: NeuEdit): NeuEdit | null {
  return draft?.edit ? { ...draft.edit, name: draft.name, budget: budgetInput(draft.tier, draft.limit) ?? draft.edit.budget } : saved ?? null;
}
export function initializeEdit(context: WardrobeContext, profile: NeuProfileInput, budget: LookBudget, id: string, name: string, newId: () => string): NeuEdit {
  const plan = buildLook({ catalog: context.catalog, recommendations: context.recommendations!, profile, owned: context.owned, budget, occasion: "Everyday" });
  const items = plan.slots.flatMap(slot => {
    if (!slot.selected?.supported) return [];
    const item: EditItem = { id: newId(), choice: slot.selected.choice, role: CORE_ROLES[slot.category], optional: false };
    return permittedRole(item, item.role, context) ? [item] : [];
  });
  return { id, name, budget, items, updatedAt: new Date().toISOString() };
}
export function itemPrice(item: EditItem, context: WardrobeContext): number | null {
  const product = resolveEditItem(item, context);
  if (!product) return null;
  const owned = product.owned || context.owned.some(o => o.shadeId === product.shadeId && o.brand === product.brand && o.product === product.title && o.shade === product.shade);
  if (owned) return 0; // New purchase cost only, not a claim about retail value.
  if (!product.productId) return null;
  const prices = facts(context, product.productId, product.shadeId, "price_usd");
  return prices.length === 1 && /^\d+(\.\d{1,2})?$/.test(prices[0]) && Number(prices[0]) > 0 ? Number(prices[0]) : null;
}
export function editSpend(edit: NeuEdit, context: WardrobeContext) {
  const unique = edit.items.filter((item, index, all) => all.findIndex(other => sameChoice(item.choice, other.choice)) === index);
  const prices = unique.map(item => itemPrice(item, context));
  const known = Math.round(prices.reduce<number>((total, price) => total + (price ?? 0), 0) * 100) / 100;
  const unknown = prices.filter(price => price === null).length;
  return { known, unknown, over: edit.budget.limitUSD !== undefined && known > edit.budget.limitUSD, total: unknown ? null : known };
}
export type CollectionOption = { item: EditItem; label: string };
export function collectionOptions(role: RoutineRole, context: WardrobeContext, budget: LookBudget): CollectionOption[] {
  if (role === "Moisturizer" || role === "SPF") return [];
  const choices: LookChoice[] = [
    ...context.owned.map(o => ({ kind: "owned" as const, ownedId: o.id })),
    ...context.catalog.shades.filter(s => s.status === "verified").map(s => ({ kind: "catalog" as const, shadeId: s.id })),
  ];
  const tiers = { Drugstore: 1, "Mid-range": 2, Luxury: 3 };
  return choices.flatMap(choice => {
    const item: EditItem = { id: "preview", choice, role, optional: true };
    const product = resolveEditItem(item, context);
    if (!product || !permittedRole(item, role, context)) return [];
    const line = context.catalog.products.find(p => p.id === product.productId);
    const brand = context.catalog.brands.find(b => b.id === line?.brandId);
    if (!product.owned && budget.tier !== "Any" && (!brand || tiers[brand.tier] > tiers[budget.tier])) return [];
    // Native complexion roles still need current profile-bound recommendation support.
    if (role === "Foundation" || role === "Concealer") {
      const check = assessStep({ id: "preview", role, enabled: true, itemId: item.id }, { id: "preview", name: "Preview", budget, items: [item], updatedAt: "" }, context);
      if (check.status !== "supported") return [];
    }
    return [{ item, label: `${product.brand} · ${product.title} · ${product.shade}${product.owned ? " · Already owned" : ""}` }];
  });
}
/** Replacing a choice is a new identity. Saved routine references are deliberately untouched. */
export function replaceCollectionItem(edit: NeuEdit, oldId: string | null, choice: LookChoice, role: RoutineRole, optional: boolean, newId: string): NeuEdit {
  const next: EditItem = { id: newId, choice, role, optional };
  return { ...edit, items: oldId ? edit.items.map(item => item.id === oldId ? next : item) : [...edit.items, next] };
}
export function missingCore(edit: NeuEdit, context: WardrobeContext): string[] {
  return LOOK_CATEGORIES.filter(category => !edit.items.some(item => assessStep({ id: "core-check", role: CORE_ROLES[category], enabled: true, itemId: item.id }, edit, context).status === "supported"));
}
/** Skipping suppresses an assessment's product; only collection membership can prove a missing reference. */
export function collectionItemMissing(step: { itemId: string | null }, edit: { items: { id: string }[] }): boolean {
  return step.itemId !== null && !edit.items.some(item => item.id === step.itemId);
}
