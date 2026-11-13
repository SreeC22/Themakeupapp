import { pgTable, text, integer, date, uniqueIndex, index, foreignKey, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { catalogBrands } from "./catalog";

// Additive curation layer. Canonical brand identities remain in catalog_brands.
export const neuSelectedBrands = pgTable("neu_selected_brands", {
  brandId: text("brand_id").primaryKey().references(() => catalogBrands.id),
  displayName: text("display_name").notNull(),
  tier: text("tier").notNull(),
}, t => [check("neu_tier", sql`${t.tier} IN ('Drugstore','Mid-range','Luxury')`)]);

export const neuSources = pgTable("neu_sources", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  market: text("market").notNull().default("US"),
  observedOn: date("observed_on", { mode: "string" }).notNull(),
  kind: text("kind").notNull().default("manufacturer"),
}, t => [index("neu_source_observation").on(t.url, t.market, t.observedOn)]);

export const neuProductLines = pgTable("neu_product_lines", {
  id: text("id").primaryKey(),
  brandId: text("brand_id").notNull().references(() => neuSelectedBrands.brandId),
  name: text("name").notNull(),
  category: text("category").notNull(),
  sourceId: text("source_id").notNull().references(() => neuSources.id),
  rangeStatus: text("range_status").notNull(),
  declaredShadeCount: integer("declared_shade_count"),
  notes: text("notes").array().notNull().default([]),
}, t => [
  check("neu_category", sql`${t.category} IN ('Foundation','Concealer','Blush','Lips')`),
  check("neu_range_status", sql`${t.rangeStatus} IN ('enumerated','partial','needs_review')`),
  check("neu_range_count", sql`${t.declaredShadeCount} IS NULL OR ${t.declaredShadeCount} >= 0`),
]);

export const neuShades = pgTable("neu_shades", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => neuProductLines.id),
  sourceId: text("source_id").notNull().references(() => neuSources.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
}, t => [
  uniqueIndex("neu_shade_product_identity").on(t.id, t.productId),
  uniqueIndex("neu_shade_variant").on(t.productId, t.name),
  check("neu_shade_status", sql`${t.status} IN ('verified','needs_review')`),
]);

export const neuMatchingEvidence = pgTable("neu_matching_evidence", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => neuProductLines.id),
  shadeId: text("shade_id"),
  sourceId: text("source_id").notNull().references(() => neuSources.id),
  field: text("field").notNull(),
  value: text("value").notNull(),
  basis: text("basis").notNull(),
  rawText: text("raw_text").notNull(),
}, t => [
  foreignKey({ columns: [t.shadeId, t.productId], foreignColumns: [neuShades.id, neuShades.productId], name: "neu_evidence_same_product" }),
  check("neu_evidence_basis", sql`${t.basis} IN ('verified','estimate','user_report')`),
]);

export const insertNeuProductSchema = createInsertSchema(neuProductLines);
export const insertNeuShadeSchema = createInsertSchema(neuShades);
export const insertNeuEvidenceSchema = createInsertSchema(neuMatchingEvidence);
export type NeuProductRow = typeof neuProductLines.$inferSelect;
export type NeuShadeRow = typeof neuShades.$inferSelect;
