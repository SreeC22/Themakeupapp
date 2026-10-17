import { pgTable, text, date, timestamp, primaryKey, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const catalogBrands = pgTable("catalog_brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  normalizedName: text("normalized_name").notNull().unique(),
});
export const catalogAliases = pgTable("catalog_aliases", {
  normalizedName: text("normalized_name").primaryKey(),
  name: text("name").notNull(),
  brandId: text("brand_id").notNull().references(() => catalogBrands.id),
});
export const catalogRetailers = pgTable("catalog_retailers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull().default("US"),
});
export const catalogDivisions = pgTable("catalog_divisions", {
  id: text("id").primaryKey(), name: text("name").notNull(),
});
export const catalogCategories = pgTable("catalog_categories", {
  id: text("id").primaryKey(), name: text("name").notNull(),
  divisionId: text("division_id").notNull().references(() => catalogDivisions.id),
});
export const catalogImports = pgTable("catalog_imports", {
  id: text("id").primaryKey(),
  sha256: text("sha256").notNull().unique(),
  importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
});
export const catalogCoverage = pgTable("catalog_coverage", {
  batchId: text("batch_id").notNull().references(() => catalogImports.id),
  retailerId: text("retailer_id").notNull().references(() => catalogRetailers.id),
  sourceUrl: text("source_url").notNull(),
  checkedOn: date("checked_on", { mode: "string" }).notNull(),
  status: text("status").notNull(),
  inclusionRules: text("inclusion_rules").notNull(),
  gaps: text("gaps").array().notNull(),
}, t => [primaryKey({ columns: [t.batchId, t.retailerId] }),
  check("catalog_coverage_status", sql`${t.status} in ('partial','blocked','reviewed')`)]);
export const catalogListings = pgTable("catalog_listings", {
  brandId: text("brand_id").notNull().references(() => catalogBrands.id),
  retailerId: text("retailer_id").notNull().references(() => catalogRetailers.id),
  sourceUrl: text("source_url").notNull(),
  checkedOn: date("checked_on", { mode: "string" }).notNull(),
  batchId: text("batch_id").notNull().references(() => catalogImports.id),
}, t => [primaryKey({ columns: [t.brandId, t.retailerId] })]);
export const catalogEvidence = pgTable("catalog_evidence", {
  id: text("id").primaryKey(),
  brandId: text("brand_id").notNull().references(() => catalogBrands.id),
  retailerId: text("retailer_id").notNull().references(() => catalogRetailers.id),
  categoryId: text("category_id").notNull().references(() => catalogCategories.id),
  status: text("status").notNull(),
  sourceUrl: text("source_url").notNull(),
  checkedOn: date("checked_on", { mode: "string" }).notNull(),
  productName: text("product_name"),
  productUrl: text("product_url"),
  note: text("note").notNull(),
  batchId: text("batch_id").notNull().references(() => catalogImports.id),
}, t => [
  uniqueIndex("catalog_evidence_observation").on(t.brandId, t.retailerId, t.categoryId, t.checkedOn),
  check("catalog_evidence_status", sql`${t.status} in ('verified','unavailable','unknown')`),
  check("catalog_evidence_positive_product", sql`${t.status} <> 'verified' or (${t.productName} is not null and ${t.productUrl} is not null)`),
]);

export const insertCatalogBrandSchema = createInsertSchema(catalogBrands);
export const insertCatalogEvidenceSchema = createInsertSchema(catalogEvidence);
export type CatalogBrand = typeof catalogBrands.$inferSelect;
export type CatalogEvidence = typeof catalogEvidence.$inferSelect;
