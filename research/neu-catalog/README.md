# Neu US retailer brand reference catalog

This is an additive backend reference catalog, not a replacement for Supabase community products,
posts or authentication, and not the shade library. No member records or website screens are changed.

## Initial research, checked October 17, 2026

Source universe: **Sephora US, Ulta Beauty and Target public US pages**. Brands can be internationally
owned. This is retailer availability research, **not a count of all US beauty brands**, brand ownership,
stock availability, safety, suitability, or shade compatibility.

| Measure | Distinct brands |
| --- | ---: |
| Directory/product-discovered candidates, before relevance review | 1,385 |
| Verified relevant brands, deduplicated across retailers | **37** |
| Sephora observed candidates / product-verified relevant brands | 373 / **19** |
| Ulta observed candidates / product-verified relevant brands | 1,158 / **20** |
| Target observed minimum / product-verified relevant brands | 1 / **1** |

There are **1,532 brand/retailer listings** and **324 positive retailer/category observations**.
Benefit and Clinique have verified evidence at both Sephora and Ulta; e.l.f. has verified evidence at
Ulta and Target. Other directory overlaps do not establish category coverage at both retailers.

| Division | Distinct verified brands |
| --- | ---: |
| Complexion | 29 |
| Cheeks | 22 |
| Eyes & brows | 23 |
| Lips | 24 |
| Prep & finish | 24 |

**Division totals overlap and must not be added.** The stable five divisions and 22 categories
are defined in `lib/db/src/catalog/taxonomy.ts`, matching Neu's existing preview.

### Research limits

- Sephora A-Z and Ulta's directory were accessible. Directory names are retained as **unreviewed
  candidates**, including potentially hair/fragrance/tool/wellness-only brands. They never enter
  relevant/category totals without product evidence. Missing research is not an exclusion finding.
- Ulta's directory required two extraction chunks. Selected brand pages, not every directory brand,
  were reviewed; several product-card extracts were truncated. Pagination and remaining products
  were not reviewed. This is intentionally not exhaustive.
- Target's beauty hub, makeup and e.l.f. brand pages exposed mostly navigation/sponsored shells.
  Two candidate beauty-brand directory routes returned unavailable pages; their validity could not
  be confirmed. Skin-care content was partial. Only two directly fetched e.l.f. product pages gave
  usable product evidence. **One Target brand is a verified minimum, not its brand count.**
- A Target product URL with an incorrect text slug returned the product belonging to its numeric
  item ID. The final evidence uses fetched headings and checked correct product URLs, never slug
  inference. No access controls were bypassed.
- Category assignments use named official product cards or product headings, not brand reputation,
  presumed assortment, undertone, skin type, prices or stock. Ambiguous products, sets, tools, body-only
  products and eye/lip primers as complexion primers were excluded. Multi-purpose products can support
  more than one explicitly named category.
- `fetch-log.json` records selected brand fetches; `research-log.json` records review outcomes and gaps.
  The canonical, checked names, links and observations are in **`initial.json`**. These files persist
  in Git; raw fetched pages are scratch inputs and excluded from Git/deployment. `prepare.py` documents
  the initial extraction rules and can rebuild that batch only if those raw scratch inputs are available.
  It is not required for importing, querying or extending the versioned JSON research.

## Development setup and import

Use the existing development `DATABASE_URL` through workspace configuration. Do not point these commands
at the owner's Supabase database or production. No credentials belong in research JSON or commands.

From the workspace root:

```sh
pnpm install
pnpm --filter @workspace/scripts run catalog:setup
pnpm --filter @workspace/scripts run catalog:import ../research/neu-catalog/initial.json --dry-run
pnpm --filter @workspace/scripts run catalog:import ../research/neu-catalog/initial.json
pnpm --filter @workspace/scripts run catalog:test
pnpm run typecheck
```

The setup script applies only `lib/db/migrations/0000_neu_catalog.sql` inside a transaction. All new
tables are prefixed `catalog_`. It never runs schema synchronization, drops tables, or alters
community tables. Existing catalog tables are left untouched. Re-run import on a fresh development
database after restoring code; PostgreSQL records otherwise persist across server restarts.

Imports are atomic, serialized with an advisory lock, and require local/server-side DB access.
There are **no HTTP write endpoints**. Do not expose the development DB credential to browser clients.

CLI summaries report accepted/duplicate brand, listing and offering records, rejected records in an
aborted batch, errors, unresolved references encountered, and whether a dry run was rolled back.
Taxonomy, aliases and coverage metadata are supporting writes, not additional record counts.
A dry run performs the same DB constraints/collision checks then rolls back. An identical batch rerun
does nothing. A reused batch ID with different content fails explicitly. A failed import changes
nothing. Omitting existing records from a partial batch never deletes them.

## Query and export

Start the existing `artifacts/api-server: API Server` workflow. The API is mounted at `/api`.
Examples use the workspace proxy (not a private service port):

```sh
curl 'http://localhost:80/api/catalog/taxonomy'
curl 'http://localhost:80/api/catalog/brands?q=NYX&page=1&limit=25'
curl 'http://localhost:80/api/catalog/brands?retailer=ulta&division=complexion'
curl 'http://localhost:80/api/catalog/brands?category=foundation'
curl 'http://localhost:80/api/catalog/brands?scope=discovered&q=beauty'
curl 'http://localhost:80/api/catalog/brands/elf-cosmetics'
curl 'http://localhost:80/api/catalog/counts'
curl 'http://localhost:80/api/catalog/counts?retailer=sephora&category=blush'
curl 'http://localhost:80/api/catalog/coverage'
curl 'http://localhost:80/api/catalog/export.csv?retailer=ulta' -o /tmp/neu-brand-coverage.csv
```

- Default `scope=relevant` returns brands with a current verified offering. `scope=discovered` includes
  all observed candidates, not a claim that each is relevant. Category/division filters always require
  verified offering evidence, including when using discovered scope.
- Search is literal case-insensitive substring matching across canonical names and reviewed aliases;
  `%` and `_` are not wildcards. Stable ID and alias collisions fail, rather than fuzzy-merging brands.
- `retailer`, `division` and `category` combine with AND. Retailer/category combinations require evidence
  **at that retailer**, not a generic brand offering elsewhere. Unknown retailer IDs, unknown categories,
  incompatible category/division pairs, repeated or unexpected parameters, invalid page/limit values
  return 400. No-result searches return empty data and zero counts. Missing brand IDs return 404.
- Pagination is deterministic: canonical normalized name then ID; page starts at 1, limit is 1–100.
  Total and counts are independent of page. List context arrays show all known retailer IDs and all-retailer
  verified category IDs; the filtered evidence matrix is available in brand detail.
- Counts distinguish `listedBrands` (matches the listing query), `discoveredDirectoryBrands` (all candidates
  within search/retailer constraints; category filters still need evidence), and `verifiedRelevantBrands`.
  Category/division group counts count canonical IDs once and use the same current evidence rules.
  The same brand can appear in several group totals; sums are not overall counts.
- Detail includes all 22 categories per known retailer listing. No evidence produces `unknown` with
  null provenance. Explicit unknown research and explicit `unavailable` observations keep their source,
  date and note. Unavailable is retailer/category-scoped, not a claim the brand never makes that product.
  No unavailability findings were invented in the initial batch.
- Current status is the latest check date per canonical brand/retailer/category. Full observation history
  remains available. Same-day contradictory evidence is rejected for human review, never arbitrarily chosen.
- JSON responses include source-universe and partial-coverage metadata, verification rules and check dates.
  `/catalog/coverage` retains all research batch records and their gaps. Database errors return 503,
  never synthetic zero counts.
- CSV exports all matching brands without pagination, with one retailer/category row per match, including
  unknowns and explicit unavailable states. The first data record is `record_type=summary`, with counts,
  filters, source universe, dates and gaps in `summary_json`. Subsequent records are `offering`.
  CSV includes source/product/listing links, dates, notes and batch IDs; UTF-8 BOM, proper quoting and
  neutralized spreadsheet-formula prefixes support safe spreadsheet use.
- The OpenAPI contract is `lib/api-spec/openapi.yaml`; generated clients and response validators
  are refreshed with `pnpm --filter @workspace/api-spec run codegen`.

## Add a retailer or research batch

1. Copy `initial.json` into a **new small JSON file**, preserving `version: 1` but choosing a new unique
   hyphenated batch ID. Never edit an already imported batch. Use ISO calendar check dates, not future dates.
2. Include each referenced retailer (`id`, `name`, `country: "US"`) and one coverage record per retailer:
   `sourceUrl`, `checkedOn`, `status` (`partial`, `blocked`, or `reviewed`), `inclusionRules`, `gaps`.
   `reviewed` describes that research pass, never an all-US census. State remaining limits even after review.
3. Reuse canonical brand IDs from `/catalog/brands?scope=discovered`. Declare referenced brands with `id`,
   `name`, and `aliases`. Normalize variants explicitly; do not merge parent companies, sub-brands or similar
   names without evidence and review. Retain previous canonical names. Identity corrections need a separately
   reviewed migration, not an automatic partial import.
4. Add `listings` records with `brandId`, `retailerId`, a public official `sourceUrl`, and `checkedOn`.
   A directory listing is discovery, not category evidence. A new retailer only needs its own batch, not code edits.
5. Add `evidence` records with `brandId`, `retailerId`, `categoryId` (from taxonomy), `status`, `sourceUrl`,
   `checkedOn`, `note`, and for verified offerings `productName` and `productUrl`. Evidence must establish
   the actual category and selected retailer relationship. A generic official brand product page alone
   cannot establish that category at a specific retailer without retailer evidence. Review the actual
   returned page content, not a search snippet or inferred URL.
6. Leave unknown categories absent or record an explicit sourced `unknown`. Use `unavailable` only for an
   explicit sourced finding with its limited meaning explained in the note; an empty search is not proof.
7. Run the same `catalog:import <file> --dry-run` command, review the report, then import without `--dry-run`.
   New later-dated observations retain history; older observations never replace newer status.
   Inspect `/catalog/counts`, `/catalog/coverage` and a CSV afterward.

The strict Zod format and reference/collision checks live in `lib/db/src/catalog/batch.ts`.
Trusted researchers must still review semantic evidence: schema validation cannot prove that a remote
page supports the category claimed. Future expansion is a new bounded research pass, not continuous
scraping or paid/restricted access.
