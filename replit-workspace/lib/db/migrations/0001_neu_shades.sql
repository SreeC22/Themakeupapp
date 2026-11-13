-- Additive DEVELOPMENT catalog migration. Never run automatically at server startup or publish.
CREATE TABLE IF NOT EXISTS neu_selected_brands (
  brand_id text PRIMARY KEY REFERENCES catalog_brands(id),
  display_name text NOT NULL,
  tier text NOT NULL CONSTRAINT neu_tier CHECK (tier IN ('Drugstore','Mid-range','Luxury'))
);
CREATE TABLE IF NOT EXISTS neu_sources (
  id text PRIMARY KEY, url text NOT NULL, market text NOT NULL DEFAULT 'US',
  observed_on date NOT NULL, kind text NOT NULL DEFAULT 'manufacturer'
);
CREATE INDEX IF NOT EXISTS neu_source_observation ON neu_sources(url,market,observed_on);
CREATE TABLE IF NOT EXISTS neu_product_lines (
  id text PRIMARY KEY, brand_id text NOT NULL REFERENCES neu_selected_brands(brand_id),
  name text NOT NULL,
  category text NOT NULL CONSTRAINT neu_category CHECK (category IN ('Foundation','Concealer','Blush','Lips')),
  source_id text NOT NULL REFERENCES neu_sources(id),
  range_status text NOT NULL CONSTRAINT neu_range_status CHECK (range_status IN ('enumerated','partial','needs_review')),
  declared_shade_count integer CONSTRAINT neu_range_count CHECK (declared_shade_count IS NULL OR declared_shade_count >= 0),
  notes text[] NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS neu_shades (
  id text PRIMARY KEY, product_id text NOT NULL REFERENCES neu_product_lines(id),
  source_id text NOT NULL REFERENCES neu_sources(id), name text NOT NULL, description text NOT NULL,
  status text NOT NULL CONSTRAINT neu_shade_status CHECK (status IN ('verified','needs_review'))
);
CREATE UNIQUE INDEX IF NOT EXISTS neu_shade_product_identity ON neu_shades(id,product_id);
CREATE UNIQUE INDEX IF NOT EXISTS neu_shade_variant ON neu_shades(product_id,name);
CREATE TABLE IF NOT EXISTS neu_matching_evidence (
  id text PRIMARY KEY, product_id text NOT NULL REFERENCES neu_product_lines(id), shade_id text,
  source_id text NOT NULL REFERENCES neu_sources(id), field text NOT NULL, value text NOT NULL,
  basis text NOT NULL CONSTRAINT neu_evidence_basis CHECK (basis IN ('verified','estimate','user_report')),
  raw_text text NOT NULL,
  CONSTRAINT neu_evidence_same_product FOREIGN KEY (shade_id,product_id) REFERENCES neu_shades(id,product_id)
);
