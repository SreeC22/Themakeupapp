import { z } from "zod/v4";
import { categories, normalizeName } from "./taxonomy";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
const url = z.url().refine(s => new URL(s).protocol === "https:", "Only public HTTPS URLs");
const date = z.iso.date().refine(s => s <= new Date().toISOString().slice(0, 10), "Future check date");
const name = z.string().trim().min(1).max(300);
export const batchSchema = z.strictObject({
  version: z.literal(1),
  id,
  retailers: z.array(z.strictObject({ id, name, country: z.literal("US") })).min(1),
  coverage: z.array(z.strictObject({
    retailerId: id, sourceUrl: url, checkedOn: date,
    status: z.enum(["partial", "blocked", "reviewed"]),
    inclusionRules: name, gaps: z.array(z.string().min(1)).min(1),
  })).min(1),
  brands: z.array(z.strictObject({ id, name, aliases: z.array(name) })),
  listings: z.array(z.strictObject({ brandId: id, retailerId: id, sourceUrl: url, checkedOn: date })),
  evidence: z.array(z.strictObject({
    brandId: id, retailerId: id, categoryId: id,
    status: z.enum(["verified", "unavailable", "unknown"]),
    sourceUrl: url, checkedOn: date, productName: name.optional(), productUrl: url.optional(),
    note: z.string().trim().min(1).max(2000),
  })).superRefine((rows, ctx) => {
    rows.forEach((row, i) => {
      if (!categories.some(c => c.id === row.categoryId)) ctx.addIssue({ code: "custom", path: [i, "categoryId"], message: "Unknown Neu category" });
      if (row.status === "verified" && (!row.productName || !row.productUrl)) ctx.addIssue({ code: "custom", path: [i], message: "Verified offerings require representative product evidence" });
    });
  }),
});
export type ResearchBatch = z.infer<typeof batchSchema>;

/** Structural validation fails closed. Unresolved references never create inferred brands. */
export function validateBatch(input: unknown) {
  const batch = batchSchema.parse(input);
  const brandIds = new Set<string>(), retailers = new Set<string>(), aliases = new Map<string, string>();
  for (const b of batch.brands) {
    if (brandIds.has(b.id)) throw new Error(`Duplicate brand ID: ${b.id}`);
    brandIds.add(b.id);
    for (const n of [b.name, ...b.aliases]) {
      const key = normalizeName(n), previous = aliases.get(key);
      if (previous && previous !== b.id) throw new Error(`Alias collision: ${n}`);
      aliases.set(key, b.id);
    }
  }
  for (const r of batch.retailers) {
    if (retailers.has(r.id)) throw new Error(`Duplicate retailer: ${r.id}`);
    retailers.add(r.id);
  }
  if (new Set(batch.coverage.map(c => c.retailerId)).size !== batch.coverage.length ||
      batch.coverage.length !== retailers.size ||
      batch.coverage.some(c => !retailers.has(c.retailerId))) throw new Error("Exactly one coverage record is required per batch retailer");
  const listings = new Set<string>();
  const listingValues = new Map<string, string>();
  let duplicateRows = 0;
  for (const l of batch.listings) {
    if (!brandIds.has(l.brandId) || !retailers.has(l.retailerId)) throw new Error(`Unresolved listing: ${l.brandId}/${l.retailerId}`);
    const key = `${l.brandId}/${l.retailerId}`;
    if (listings.has(key)) {
      if (listingValues.get(key) !== JSON.stringify(l)) throw new Error(`Conflicting listing: ${key}`);
      duplicateRows++;
    }
    listings.add(key);
    listingValues.set(key, JSON.stringify(l));
  }
  const observations = new Map<string, string>();
  for (const e of batch.evidence) {
    if (!listings.has(`${e.brandId}/${e.retailerId}`)) throw new Error(`Unresolved offering listing: ${e.brandId}/${e.retailerId}`);
    const key = `${e.brandId}/${e.retailerId}/${e.categoryId}/${e.checkedOn}`;
    const value = JSON.stringify(e);
    if (observations.has(key)) {
      if (observations.get(key) !== value) throw new Error(`Conflicting same-date observations: ${key}`);
      duplicateRows++;
    }
    observations.set(key, value);
  }
  return { batch, duplicateRows };
}
