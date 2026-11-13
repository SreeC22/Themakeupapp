-- Development-only additive expansion; never run at startup or against production.
BEGIN;
ALTER TABLE neu_product_lines DROP CONSTRAINT IF EXISTS neu_category;
ALTER TABLE neu_product_lines ADD CONSTRAINT neu_category CHECK(category IN ('Foundation','Concealer','Blush','Lips','Eyes','Multi-use','Setting'));
CREATE TABLE IF NOT EXISTS neu_research_observations (
  id text PRIMARY KEY,
  source_id text NOT NULL REFERENCES neu_sources(id),
  product_name text NOT NULL,
  shade text NOT NULL,
  platform text NOT NULL,
  reported_characteristics text[] NOT NULL DEFAULT '{}',
  positive text[] NOT NULL DEFAULT '{}',
  negative text[] NOT NULL DEFAULT '{}',
  routines text[] NOT NULL DEFAULT '{}',
  disclosure text NOT NULL,
  strength text NOT NULL,
  independent_group text,
  status text NOT NULL DEFAULT 'research_candidate',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT neu_research_status CHECK(status IN ('research_candidate','supported_favorite'))
);
COMMIT;
