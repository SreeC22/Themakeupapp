import type { NeuCatalog, NeuRecommendations, NeuProfileInput } from "@workspace/api-client-react";
import type { LookBudget, LookChoice, OwnedProduct } from "../looks/model.ts";

export const ROUTINES = ["Five-Minute Face", "Everyday", "Work & College", "Soft Glam", "Party Glam", "Special Occasion"] as const;
export type RoutineName = typeof ROUTINES[number];
export const ROLES = ["Moisturizer", "SPF", "Foundation", "Concealer", "Cheeks", "Lip color", "Lip liner", "Lip gloss", "Lip oil", "Lip tint / stain", "Eyes", "Setting"] as const;
export type RoutineRole = typeof ROLES[number];
export type EditItem = { id: string; choice: LookChoice; role: RoutineRole; optional: boolean };
export type NeuEdit = { id: string; name: string; budget: LookBudget; items: EditItem[]; updatedAt: string };
export type RoutineStep = { id: string; role: RoutineRole; enabled: boolean; itemId: string | null; note?: string };
export type SavedRoutine = { id: string; name: string; template: RoutineName; variant: "simple" | "elaborate"; steps: RoutineStep[]; updatedAt: string };
export type WardrobeContext = { catalog: NeuCatalog; owned: OwnedProduct[]; recommendations?: NeuRecommendations; profile?: NeuProfileInput; asOf?: string };
export type EditProduct = { title: string; brand: string; shade: string; productId?: string; shadeId?: string; sourceUrl?: string; detailPath?: string; owned: boolean; claims: string[] };
export type StepAssessment = { status: "skipped" | "preparation" | "supported" | "unresolved"; product?: EditProduct; instructions: string; missing: string[] };
const roles: Record<RoutineName, { simple: RoutineRole[]; elaborate: RoutineRole[] }> = {
  "Five-Minute Face": { simple: ["SPF", "Concealer", "Lip gloss"], elaborate: ["Moisturizer", "SPF", "Concealer", "Cheeks", "Lip liner", "Lip gloss"] },
  Everyday: { simple: ["SPF", "Concealer", "Lip color"], elaborate: ["Moisturizer", "SPF", "Foundation", "Concealer", "Cheeks", "Eyes", "Lip color"] },
  "Work & College": { simple: ["SPF", "Concealer", "Lip color"], elaborate: ["Moisturizer", "SPF", "Concealer", "Cheeks", "Eyes", "Lip liner", "Lip color"] },
  "Soft Glam": { simple: ["Concealer", "Cheeks", "Lip color"], elaborate: ["Moisturizer", "SPF", "Foundation", "Concealer", "Cheeks", "Eyes", "Lip liner", "Lip color", "Setting"] },
  "Party Glam": { simple: ["Concealer", "Eyes", "Lip color"], elaborate: ["Moisturizer", "Foundation", "Concealer", "Cheeks", "Eyes", "Lip liner", "Lip color", "Lip gloss", "Setting"] },
  "Special Occasion": { simple: ["Concealer", "Cheeks", "Lip color"], elaborate: ["Moisturizer", "SPF", "Foundation", "Concealer", "Cheeks", "Eyes", "Lip liner", "Lip color", "Lip gloss", "Setting"] },
};
export function facts(context: WardrobeContext, productId: string, shadeId: string | undefined, field: string): string[] {
  const p = context.catalog.products.find(p => p.id === productId);
  const s = context.catalog.shades.find(s => s.id === shadeId && s.productId === productId);
  const asOf = context.asOf ?? new Date().toISOString().slice(0, 10);
  return [...new Set([...(p?.claims ?? []), ...(s?.claims ?? [])].filter(c => {
    const age = (Date.parse(asOf) - Date.parse(c.checkedOn)) / 86400000;
    return c.field === field && c.basis === "verified" && /^https:\/\//.test(c.sourceUrl) && age >= 0 && age <= 30;
  }).map(c => c.value))];
}
export function resolveEditItem(item: EditItem, context: WardrobeContext): EditProduct | null {
  const choice = item.choice;
  const own = choice.kind === "owned" ? context.owned.find(o => o.id === choice.ownedId) : undefined;
  if (choice.kind === "owned" && !own) return null;
  const shadeId = choice.kind === "catalog" ? choice.shadeId : own?.shadeId;
  const shade = context.catalog.shades.find(s => s.id === shadeId && s.status === "verified");
  const product = context.catalog.products.find(p => p.id === shade?.productId);
  const brand = context.catalog.brands.find(b => b.id === product?.brandId);
  // A leftover ID must not lend manufacturer's evidence to edited self-reported labels.
  const sameIdentity = !own || own.product === product?.name && own.brand === brand?.name && own.shade === shade?.name && own.category === product?.category;
  if (!product || !shade || !brand || !sameIdentity) return own ? { title: own.product, brand: own.brand, shade: own.shade, owned: true, claims: [] } : null;
  const age = (Date.parse(context.asOf ?? new Date().toISOString().slice(0, 10)) - Date.parse(product.checkedOn)) / 86400000;
  return {
    title: product.name, brand: brand.name, shade: shade.name, owned: !!own,
    ...(age >= 0 && age <= 30 ? { productId: product.id, shadeId: shade.id, sourceUrl: product.sourceUrl, detailPath: `/catalog/shades/${encodeURIComponent(shade.id)}` } : {}),
    claims: facts(context, product.id, shade.id, "benefit"),
  };
}
function has(context: WardrobeContext, product: EditProduct, field: string, value: string): boolean {
  return !!product.productId && facts(context, product.productId, product.shadeId, field).some(v => v.toLowerCase() === value.toLowerCase());
}
export function permittedRole(item: EditItem, role: RoutineRole, context: WardrobeContext): boolean {
  if (role === "SPF" || role === "Moisturizer") return false;
  const resolved = resolveEditItem(item, context);
  if (!resolved?.productId) return false;
  const p = context.catalog.products.find(p => p.id === resolved.productId)!;
  const area = role === "Eyes" ? "Eyes" : role.startsWith("Lip") ? "Lips" : role === "Cheeks" ? "Cheeks" : "Face";
  const explicit = has(context, resolved, "application_area", area);
  // Legacy native categories retain only their labeled use. No ordinary blush becomes lip/eye safe.
  const native = role === "Foundation" && p.category === "Foundation" || role === "Concealer" && p.category === "Concealer"
    || role === "Cheeks" && p.category === "Blush";
  const nativeLip = p.category === "Lips" && role === "Lip color" && has(context, resolved, "formula", "Lipstick");
  if (!explicit && !native && !nativeLip) return false;
  if (role === "Eyes" || role === "Cheeks") return true;
  if (role === "Foundation" || role === "Concealer") return p.category === role || has(context, resolved, "routine_role", role);
  if (role === "Setting") return has(context, resolved, "routine_role", "Setting");
  if (role === "Lip color") return nativeLip || has(context, resolved, "routine_role", "Lip color");
  const subtype = { "Lip liner": "Liner", "Lip gloss": "Gloss", "Lip oil": "Oil", "Lip tint / stain": "Tint / stain" }[role];
  return !!subtype && has(context, resolved, "lip_subcategory", subtype);
}
export function assessStep(step: RoutineStep, edit: NeuEdit, context: WardrobeContext): StepAssessment {
  if (!step.enabled) return { status: "skipped", instructions: "Skipped by you. No purchase needed for this step.", missing: [] };
  if (step.role === "Moisturizer" || step.role === "SPF") return {
    status: "preparation", instructions: step.role === "SPF" ? "Follow your usual sun-protection routine and the sunscreen label. No skincare product is recommended or sold here."
      : "If you use moisturizer, apply your usual product following its label. No skincare shopping recommendation.", missing: [],
  };
  const item = edit.items.find(i => i.id === step.itemId);
  const product = item ? resolveEditItem(item, context) : null;
  if (!item || !product) return { status: "unresolved", instructions: "Choose an item from your Neu Edit, skip this step or add an evidenced option to your collection.", missing: ["No available collection item selected."] };
  if (!permittedRole(item, step.role, context)) return {
    status: "unresolved", product, instructions: "Application is not recommended without the manufacturer's labeling for this area and role.",
    missing: ["Labeled application/subcategory evidence is missing or stale. Ordinary blush is not automatically lip- or eye-safe."],
  };
  if ((step.role === "Foundation" || step.role === "Concealer") && !context.recommendations?.candidates.some(c => c.shadeId === product.shadeId && c.category === step.role && c.label === "Descriptor-aligned candidate")) return {
    status: "unresolved", product, instructions: "Your selection is retained, but current profile-to-shade support is incomplete. No corrected shade is inferred.",
    missing: ["Current descriptor-aligned complexion evidence is missing; ownership alone is not proof of fit."],
  };
  const opacity = context.profile?.preferences?.Lips?.opacity;
  if (step.role === "Lip color" && opacity && !["Open", "Open to anything", "No preference"].includes(opacity)
    && (!product.productId || !facts(context, product.productId, product.shadeId, "opacity").includes(opacity))) return {
    status: "unresolved", product, instructions: "Labeled lip use is supported, but your requested coverage is not established. The product is retained as an exploration choice.",
    missing: ["Coverage evidence for your opacity preference is missing. Pigment-rich does not automatically mean opaque on two-toned lips."],
  };
  return { status: "supported", product, instructions: `Use ${product.title} only as labeled for ${step.role.toLowerCase()}; adjust intensity to your preference. This is labeled-use support, not an exact personal color or wear guarantee.`,
    missing: step.role.startsWith("Lip") ? ["Natural lip pigmentation and layering can change the result; identical coverage on two-toned lips is not established."] : [] };
}
export function routineSteps(template: RoutineName, variant: "simple" | "elaborate", edit: NeuEdit, context: WardrobeContext): RoutineStep[] {
  return roles[template][variant].map((role, i) => ({
    id: `${template}:${variant}:${i}`, role, enabled: true,
    itemId: edit.items.find(item => permittedRole(item, role, context))?.id ?? null,
  }));
}
export function reusableIn(item: EditItem, context: WardrobeContext): RoutineName[] {
  return ROUTINES.filter(name => roles[name].elaborate.some(role => permittedRole(item, role, context)));
}
export function mismatchObservations(fit: string[], oxidation?: string) {
  return { depth: fit.filter(v => ["Too light", "Too dark"].includes(v)), color: fit.filter(v => ["Too yellow", "Too orange", "Too pink", "Gray or ashy"].includes(v)),
    other: fit.filter(v => !["Too light", "Too dark", "Too yellow", "Too orange", "Too pink", "Gray or ashy"].includes(v)), oxidation: oxidation ?? "" };
}
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length <= 200;
const choice = (v: unknown) => obj(v) && (v.kind === "catalog" && text(v.shadeId) || v.kind === "owned" && text(v.ownedId));
export function validEdit(v: unknown): v is NeuEdit {
  return obj(v) && text(v.id) && text(v.name) && typeof v.updatedAt === "string" && Number.isFinite(Date.parse(v.updatedAt)) && obj(v.budget)
    && ["Any", "Drugstore", "Mid-range", "Luxury"].includes(String(v.budget.tier))
    && (v.budget.limitUSD === undefined || typeof v.budget.limitUSD === "number" && Number.isFinite(v.budget.limitUSD) && v.budget.limitUSD > 0 && v.budget.limitUSD <= 10000)
    && Array.isArray(v.items) && v.items.length <= 60 && new Set(v.items.map(i => obj(i) ? i.id : null)).size === v.items.length
    && v.items.every(i => obj(i) && text(i.id) && choice(i.choice) && ROLES.includes(i.role as RoutineRole) && typeof i.optional === "boolean");
}
export function validRoutine(v: unknown): v is SavedRoutine {
  return obj(v) && text(v.id) && text(v.name) && ROUTINES.includes(v.template as RoutineName) && ["simple", "elaborate"].includes(String(v.variant))
    && typeof v.updatedAt === "string" && Number.isFinite(Date.parse(v.updatedAt))
    && Array.isArray(v.steps) && v.steps.length <= 30 && new Set(v.steps.map(s => obj(s) ? s.id : null)).size === v.steps.length
    && v.steps.every(s => obj(s) && text(s.id) && ROLES.includes(s.role as RoutineRole) && typeof s.enabled === "boolean"
      && (s.itemId === null || text(s.itemId)) && (s.note === undefined || typeof s.note === "string" && s.note.length <= 500));
}
