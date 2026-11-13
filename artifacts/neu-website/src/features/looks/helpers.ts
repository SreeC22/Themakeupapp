import type { NeuCatalog } from "@workspace/api-client-react";
import { LOOK_CATEGORIES } from "./model.ts";
import type { LookChoice, LookPlan, LookSelections, OwnedProduct, SavedLook } from "./model.ts";
import { LOOKS_KEY, readLooks } from "./storage.ts";

export const emptySelections = (): LookSelections => Object.fromEntries(LOOK_CATEGORIES.map(category => [category, null]));

/** Capture every slot, including a deliberately empty slot and an unavailable saved identity. */
export function collectSelections(plan: LookPlan, previous: LookSelections = {}): LookSelections {
  return Object.fromEntries(plan.slots.map(slot => [
    slot.category,
    Object.hasOwn(previous, slot.category) && previous[slot.category] === null
      ? null
      : slot.selected?.choice ?? slot.retainedChoice ?? previous[slot.category] ?? null,
  ]));
}

/** Owning an item is not consent to use it. Generation suggests purchases; reuse stays explicit. */
export function generatedSelections(plan: LookPlan): LookSelections {
  return Object.fromEntries(plan.slots.map(slot => [
    slot.category, slot.options.find(option => option.supported && !option.owned)?.choice ?? null,
  ]));
}

export function replaceSlot(selections: LookSelections, category: typeof LOOK_CATEGORIES[number], choice: LookChoice | null): LookSelections {
  return { ...selections, [category]: choice };
}

export function choiceLabel(choice: LookChoice | null | undefined, catalog: NeuCatalog | undefined, owned: OwnedProduct[]): string {
  if (!choice) return "Left empty";
  if (choice.kind === "owned") {
    const item = owned.find(o => o.id === choice.ownedId);
    return item ? [item.brand, item.product, item.shade].filter(Boolean).join(" · ") : `Removed owned item (${choice.ownedId})`;
  }
  const shade = catalog?.shades.find(s => s.id === choice.shadeId);
  const product = catalog?.products.find(p => p.id === shade?.productId);
  const brand = catalog?.brands.find(b => b.id === product?.brandId);
  return shade ? [brand?.name, product?.name, shade.name].filter(Boolean).join(" · ") : `Catalog shade (${choice.shadeId})`;
}

export function looksUsingOwned(looks: SavedLook[], ownedId: string): SavedLook[] {
  return looks.filter(look => Object.values(look.selections).some(choice => choice?.kind === "owned" && choice.ownedId === ownedId));
}

/** Preserve the raw new store, even if a later version or damaged JSON cannot be decoded here. */
export function exportLooks(storage: Pick<Storage, "getItem" | "setItem" | "removeItem">) {
  const result = readLooks(storage);
  return { key: LOOKS_KEY, status: result.status, raw: result.raw, data: result.status === "ready" ? result.data : null };
}

/** A late request is never current merely because it was the last one to finish. */
export function currentEvidence(resultKey: string, activeKey: string, requestId: number, activeId: number) {
  return resultKey === activeKey && requestId === activeId;
}

export function downloadJson(value: unknown, filename: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
