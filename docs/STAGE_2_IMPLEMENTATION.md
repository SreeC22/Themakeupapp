# Stage 2: catalog evidence and two-path discovery

## Scope and infrastructure

This extends the existing Neu website. No replacement app or design system was created. The accepted Stage 1 remains the baseline, including historical research IDs, Learn, comparison, local saves/drafts, export/reset, route compatibility and the stable forty-swatch selector.

The normalized development catalog extends the **existing workspace PostgreSQL catalog**, reusing canonical `catalog_brands` identities. It does not replace or migrate the owner's existing Supabase project. Supabase member data, production databases, the public legacy website, waitlist wiring and native app were not changed.

Public community is not part of this MVP. Existing private draft data remains available through compatibility paths; it is not published or counted as member evidence. A public community phase requires 500+ registered users **and** owner approval. Optional real accounts/private syncing require separate implementation and review.

## Progressive targets versus observed coverage

Targets: 25 selected US-market brands, 100–150 lines and approximately 2,000–4,000 individual shade/color variants. Each selected line should eventually include its complete current US range where reliably verified. These are progressive goals, not claims of current coverage or Stage 2 exit requirements.

The Stage 2 development snapshot was retrieved from official US product selectors on **2026-11-13 UTC**:

| Brand / editorial tier | Product line | Category | Source-declared variants | Verified identities | Range status |
|---|---|---|---:|---:|---|
| e.l.f. / Drugstore | Soft Glam Satin Foundation | Foundation | 36 | 36 | Selector enumerated |
| e.l.f. / Drugstore | Hydrating Camo Concealer | Concealer | 25 | 25 | Selector enumerated |
| Fenty Beauty / Mid-range | Pro Filt'r Fluid Flex Natural Matte Longwear Foundation | Foundation | 50 | 49 | Partial; one identity conflict |
| Rare Beauty / Mid-range | Soft Pinch Liquid Blush | Blush | 16 | 16 | Selector enumerated |
| Dior / Luxury | Rouge Dior | Lips | 71 | 71 | Selector enumerated; finish variants distinct |

**Total: 25 selected candidate brands, 4 brands with reviewed lines, 5 lines, 197 verified shade identities, 1 identity under review, 4 reconciled selector ranges.**

“Verified identity” means a name/variant was observed on the cited official source. It does not mean independently measured color, guaranteed complexion fit, current stock or a verified result on a particular person. “Selector enumerated” is limited to the observation date, not a guarantee that the market range never changes. Editorial brand tiers are not verified product prices.

### Specific gaps

- The other 21 selected brands have no reviewed lines in this matching subset.
- Fenty uses both `466` and `466W` within its Fluid Flex selector. That observation is retained under review and excluded from recommendations.
- The e.l.f. foundation selector reconciles all 36 identities, but the matching engine does not infer depth or undertone from those names alone.
- Explicit pink, yellow or golden words are retained as raw evidence; they are not automatically reclassified as cool or warm without support.
- Rich, rich-deep and medium-deep brand terms are not silently equated with Neu's manual palette categories.
- No calibrated complexion measurements, foundation saturation, cool-olive complexion descriptors, current prices or live inventory were verified.
- Lip color-family classifications and individual outcomes on two-toned lips remain unverified. A high-coverage formula claim does not guarantee even pigmentation on both lips.
- Product imagery, proprietary color libraries and copied customer reviews are not imported.

## Official sources and bounded curation

- https://www.elfcosmetics.com/soft-glam-satin-foundation/300303.html
- https://www.elfcosmetics.com/hydrating-camo-concealer/300166.html
- https://fentybeauty.com/products/pro-filtr-fluid-flex-natural-matte-longwear-foundation-386w
- https://www.rarebeauty.com/products/soft-pinch-liquid-blush
- https://www.dior.com/en_us/beauty/products/rouge-dior-Y0356009.html

These were a small, manually reviewed public-page subset, not a bulk retailer crawler or an asserted feed license. The older Fenty Soft Matte page explicitly described its line as retiring; it was not substituted for the newer Fluid Flex line. A guessed Soft'Lit URL returned a navigation/error page, which was not accepted as product evidence. Reassess permissions and source stability before automated expansion.

The reviewed factual snapshot is `lib/db/src/neu/seed.json`. It contains names, concise descriptors and source pointers, not copied page media or reviews. The explicit development import is `pnpm --filter @workspace/scripts run neu:seed`. It is not invoked by startup or deploy. Unchanged imports are idempotent; source-content revisions have distinct observation IDs, and prior evidence is retained without being merged into the active observation.

## Normalized schema and API

- `catalog_brands`: existing canonical identities, preserved.
- `neu_selected_brands`: editorial selection/tier linked to canonical brands.
- `neu_product_lines`: category, current reviewed observation and completeness metadata.
- `neu_shades`: exact product-specific variant identity/status; finish duplicates are distinct names.
- `neu_sources`: US source observations, dates and content-version identity.
- `neu_matching_evidence`: source-linked field assertions with explicit `verified`, `estimate` or `user_report` basis. Cross-product shade evidence is prevented by a composite foreign key.

`lib/db/migrations/0001_neu_shades.sql` is additive development schema work, not an automatic production migration. No account data is added to these tables.

- `GET /api/neu/catalog`: actual database-backed brands, lines, variants, evidence and coverage.
- `POST /api/neu/recommendations`: validated traits/references/preferences, returning candidates, reasons, limitations and source/date.
- Generated React Query hooks and Zod schemas come from the existing OpenAPI workflow.
- Catalog failures are explicit `503` responses. Bad inputs return `400`. There are no fabricated fallbacks or public catalog-write endpoints.

## One profile from two onboarding paths

The opening choice is equally weighted:

- **I already know my shade:** typed brand, exact foundation/concealer line, exact shade, fit and optional oxidation. Missing entries remain self-reported. A catalog identity is distinct from the user's fit observation.
- **Help me find my shade:** the existing manual depth palette, optional undertone including olive temperature/saturation, and unsure paths.

Shared onboarding only adds optional skin type; category questions are saved in discovery. Both paths write the same backward-compatible local profile. Multiple references can be added, edited and removed in Profile. Reference fit corrections do not rewrite manufacturer assertions or create a guessed shade-step equivalence.

Foundation coverage/finish, concealer intent, blush formula/finish and lip pigmentation/opacity/finish are saved separately by category. Existing fields remain readable; old local profiles and drafts are not destructively migrated.

## Matching behavior

Rules are versioned in `lib/db/src/neu/matching.ts`. Their ordering is deterministic, but internal ordering values are not presented as fit or confidence percentages.

- Only explicit verified assertions dated within 30 days participate in descriptor matching. Estimates, reports, stale/future assertions and under-review identities do not upgrade into verified facts.
- Known depth or undertone conflicts are hard exclusions before preference ordering. Neutral is not assumed to suit every undertone.
- Olive temperature is separate. Warm, neutral and cool olive do not silently substitute for each other.
- Name-only complexion variants are not offered against known user traits; the line remains browsable rather than producing arbitrary “matched” shades.
- A perfect, stable reference can supply consistent explicit manufacturer descriptors. Missing/conflicting references remain unresolved. Manual confirmation overrides conflicting reference descriptors.
- Incorrect fit, uncertain/changing stability or oxidation do not generate fabricated lighter/darker/undertone offsets. The disliked exact shade is not recommended back as a fix.
- Unknown complexion saturation is explained, not fabricated.
- Foundation and concealer use complexion gates; brightening does not imply a universal lighter-shade rule.
- Blush and lips are color exploration, not foundation equivalences. Source-supported preferences affect ordering; unknown aesthetic facts stay unknown.
- Full/even lip goals reject verified sheer variants. Contradictory full/sheer goals are surfaced. Two-toned pigmentation always carries an outcome limitation.

UI labels distinguish descriptor-aligned candidates, limited-evidence suggestions and color exploration. None is a guarantee or laboratory-confirmed exact match.

## Privacy and retained functionality

Profiles, saves and private drafts remain browser-local. Selected traits, catalog reference IDs, fit/oxidation feedback and category preferences are sent to the recommendation API for transient processing, not stored as server profiles. Request bodies are not logged. Private draft prose is not sent to the matching API. The UI now discloses this distinction rather than claiming that nothing leaves the browser.

Known storage keys and legacy protections remain. Optional additions preserve Stage 1 records; corrupt/future values remain protected from silent overwrite. New namespaced catalog saves resolve alongside historical saves, with working source/evidence detail pages.

## Stage boundary

Implementation is for the development preview. Test results belong in `docs/STAGE_2_QA.md`. No production deployment, remote push, owner Supabase change, real account creation, public reviews or next-phase work is authorized by this delivery. Stop for owner review with coverage and gaps reported separately.
