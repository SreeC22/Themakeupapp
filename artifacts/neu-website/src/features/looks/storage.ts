import { OCCASIONS, LOOK_CATEGORIES, OWNED_CATEGORIES } from "./model.ts";
import type { SavedLook, OwnedProduct, LookSelections, LookBudget } from "./model.ts";
import { validEdit, validRoutine } from "../wardrobe/model.ts";
import type { NeuEdit, SavedRoutine } from "../wardrobe/model.ts";

export const LOOKS_KEY = "neu.looks.v1";
export type LooksData = { version: 1; revision: string; looks: SavedLook[]; owned: OwnedProduct[]; wardrobe?: NeuEdit; routines?: SavedRoutine[] };
export type LooksRead = { status: "ready" | "corrupt" | "future" | "unavailable"; data: LooksData; raw: string | null };
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const empty = (): LooksData => ({ version: 1, revision: "", looks: [], owned: [] });
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.length <= 200;
export function validBudget(v: unknown): v is LookBudget {
  return obj(v) && ["Any", "Drugstore", "Mid-range", "Luxury"].includes(String(v.tier))
    && (v.limitUSD === undefined || typeof v.limitUSD === "number" && Number.isFinite(v.limitUSD) && v.limitUSD > 0 && v.limitUSD <= 10000);
}
function validSelections(v: unknown): v is LookSelections {
  return obj(v) && Object.entries(v).every(([category, choice]) => LOOK_CATEGORIES.includes(category as typeof LOOK_CATEGORIES[number])
    && (choice === null || obj(choice) && (choice.kind === "catalog" && text(choice.shadeId) && !!choice.shadeId || choice.kind === "owned" && text(choice.ownedId) && !!choice.ownedId)));
}
export function validLooks(v: unknown): v is LooksData {
  return obj(v) && v.version === 1 && text(v.revision) && Array.isArray(v.looks) && v.looks.length <= 100 && Array.isArray(v.owned) && v.owned.length <= 200
    && (v.wardrobe === undefined || validEdit(v.wardrobe))
    && (v.routines === undefined || Array.isArray(v.routines) && v.routines.length <= 100 && v.routines.every(validRoutine) && new Set(v.routines.map(r => r.id)).size === v.routines.length)
    && new Set(v.looks.map(l => obj(l) ? l.id : null)).size === v.looks.length
    && new Set(v.owned.map(l => obj(l) ? l.id : null)).size === v.owned.length
    && v.looks.every(l => obj(l) && text(l.id) && !!l.id && text(l.name) && !!l.name.trim()
      && OCCASIONS.includes(l.occasion as typeof OCCASIONS[number]) && validBudget(l.budget) && validSelections(l.selections)
      && typeof l.updatedAt === "string" && Number.isFinite(Date.parse(l.updatedAt)))
    && v.owned.every(o => obj(o) && text(o.id) && !!o.id && OWNED_CATEGORIES.includes(o.category as typeof OWNED_CATEGORIES[number])
      && text(o.brand) && text(o.product) && !!o.product.trim() && text(o.shade) && (o.shadeId === undefined || text(o.shadeId)));
}
export function readLooks(storage: StorageLike): LooksRead {
  try {
    const raw = storage.getItem(LOOKS_KEY);
    if (raw === null) return { status: "ready", data: empty(), raw };
    let value: unknown;
    try { value = JSON.parse(raw); } catch { return { status: "corrupt", data: empty(), raw }; }
    if (obj(value) && typeof value.version === "number" && value.version > 1) return { status: "future", data: empty(), raw };
    return validLooks(value) ? { status: "ready", data: value, raw } : { status: "corrupt", data: empty(), raw };
  } catch { return { status: "unavailable", data: empty(), raw: null }; }
}
/** Compare the whole persisted revision before replacing it; never silently overwrite protected/newer data. */
export function writeLooks(storage: StorageLike, next: LooksData, expectedRevision: string): "saved" | "conflict" | "protected" | "unavailable" {
  const current = readLooks(storage);
  if (current.status === "unavailable") return "unavailable";
  if (current.status !== "ready" || !validLooks(next) || !next.revision || next.revision === expectedRevision) return "protected";
  if (current.data.revision !== expectedRevision) return "conflict";
  try { storage.setItem(LOOKS_KEY, JSON.stringify(next)); return "saved"; } catch { return "unavailable"; }
}
