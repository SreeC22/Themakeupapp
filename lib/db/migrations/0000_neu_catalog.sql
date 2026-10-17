CREATE TABLE "catalog_aliases" (
	"normalized_name" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_brands" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	CONSTRAINT "catalog_brands_normalized_name_unique" UNIQUE("normalized_name")
);
--> statement-breakpoint
CREATE TABLE "catalog_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"division_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_coverage" (
	"batch_id" text NOT NULL,
	"retailer_id" text NOT NULL,
	"source_url" text NOT NULL,
	"checked_on" date NOT NULL,
	"status" text NOT NULL,
	"inclusion_rules" text NOT NULL,
	"gaps" text[] NOT NULL,
	CONSTRAINT "catalog_coverage_batch_id_retailer_id_pk" PRIMARY KEY("batch_id","retailer_id"),
	CONSTRAINT "catalog_coverage_status" CHECK ("catalog_coverage"."status" in ('partial','blocked','reviewed'))
);
--> statement-breakpoint
CREATE TABLE "catalog_divisions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"retailer_id" text NOT NULL,
	"category_id" text NOT NULL,
	"status" text NOT NULL,
	"source_url" text NOT NULL,
	"checked_on" date NOT NULL,
	"product_name" text,
	"product_url" text,
	"note" text NOT NULL,
	"batch_id" text NOT NULL,
	CONSTRAINT "catalog_evidence_status" CHECK ("catalog_evidence"."status" in ('verified','unavailable','unknown')),
	CONSTRAINT "catalog_evidence_positive_product" CHECK ("catalog_evidence"."status" <> 'verified' or ("catalog_evidence"."product_name" is not null and "catalog_evidence"."product_url" is not null))
);
--> statement-breakpoint
CREATE TABLE "catalog_imports" (
	"id" text PRIMARY KEY NOT NULL,
	"sha256" text NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catalog_imports_sha256_unique" UNIQUE("sha256")
);
--> statement-breakpoint
CREATE TABLE "catalog_listings" (
	"brand_id" text NOT NULL,
	"retailer_id" text NOT NULL,
	"source_url" text NOT NULL,
	"checked_on" date NOT NULL,
	"batch_id" text NOT NULL,
	CONSTRAINT "catalog_listings_brand_id_retailer_id_pk" PRIMARY KEY("brand_id","retailer_id")
);
--> statement-breakpoint
CREATE TABLE "catalog_retailers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_aliases" ADD CONSTRAINT "catalog_aliases_brand_id_catalog_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."catalog_brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_categories" ADD CONSTRAINT "catalog_categories_division_id_catalog_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."catalog_divisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_coverage" ADD CONSTRAINT "catalog_coverage_batch_id_catalog_imports_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."catalog_imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_coverage" ADD CONSTRAINT "catalog_coverage_retailer_id_catalog_retailers_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."catalog_retailers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_evidence" ADD CONSTRAINT "catalog_evidence_brand_id_catalog_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."catalog_brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_evidence" ADD CONSTRAINT "catalog_evidence_retailer_id_catalog_retailers_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."catalog_retailers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_evidence" ADD CONSTRAINT "catalog_evidence_category_id_catalog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."catalog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_evidence" ADD CONSTRAINT "catalog_evidence_batch_id_catalog_imports_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."catalog_imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_listings" ADD CONSTRAINT "catalog_listings_brand_id_catalog_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."catalog_brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_listings" ADD CONSTRAINT "catalog_listings_retailer_id_catalog_retailers_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."catalog_retailers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_listings" ADD CONSTRAINT "catalog_listings_batch_id_catalog_imports_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."catalog_imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_evidence_observation" ON "catalog_evidence" USING btree ("brand_id","retailer_id","category_id","checked_on");