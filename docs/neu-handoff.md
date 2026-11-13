# Neu website handoff

## Current Neu Edit and adaptive routines

The reusable collection is central: Onboarding → Complexion Profile → Your Neu Edit → Explore Looks → Customize → Save or Shop. `/edit`, `/routines` and `/research` extend the existing website and protected local store. Current specifications: `STAGE_3_WARDROBE.md`; actual checks and limits: `STAGE_3_WARDROBE_QA.md`.

### Current status

- Stage 3 is committed on local `main`. This is not a GitHub push or deployment.
- 231 automated tests passed; workspace typecheck, post-fix website typecheck and production website build passed.
- The browser check verified onboarding, Edit save, owned multi-use makeup, Cheeks/Eyes reuse and simple/elaborate collection reuse. It found a false “item unavailable” warning on skipped steps; this was fixed and regression-tested.
- **Still unverified in the browser:** save/edit/reload a routine; its same-ID and note/step persistence; UI protection of future-version data; `/research` presentation; and the remaining mobile/tablet viewports. Do not mark the Stage 3 browser journey fully verified.
- The browser run used isolated `TEST` data. It did not touch owner-browser data or member accounts.
- Current development catalog: 26 selected brands, 16 lines, 399 shade/palette identities (one is a palette SKU, not 12 separately sold pans), and one unresolved shade identity. Fifteen selector ranges are reconciled; one is partial. Only four individual variants have verified prices. Six research observations are candidate-only; no independently supported favorites are established.
- Existing profiles, feedback, four-slot looks and saved products remain available. Local edits and routines are not cloud-synced.
- No production/Supabase or native-app changes, remote push, deployment or public community activation. Public community remains gated on 500+ registered users **and** separate owner approval.

Use the two Stage 3 documents above as the current source of truth. Sections explicitly marked historical below are context, not the active product roadmap.

## Historical Your Neu Look handoff

The owner accepted Stage 2 based on its report and confirmed the look-first core product. Stage 3 extends it without replacing the existing website, design system or catalog. The primary journey and review gate are documented in `STAGE_3_REQUIREMENTS.md`; implementation/coverage and actual checks are in `STAGE_3_IMPLEMENTATION.md` / `STAGE_3_QA.md`. `/looks` and `/looks/saved` add local planning/editing/owned reuse; `/results` remains individual discovery. Community stays out. Stop for review; no push or deploy.

## Historical Stage 2 handoff

The owner approved Stage 1 based on its report. The newer requirements add two short onboarding paths, contextual category preferences, a normalized development catalog and initial explainable matching. Use `STAGE_2_REQUIREMENTS.md`, `STAGE_2_IMPLEMENTATION.md` and `STAGE_2_QA.md` as the current stage handoff; the sections below retain prior-phase context. The existing design system, historical IDs, forty swatches, browser storage keys and private draft data remain preserved. Public community is deferred until 500+ registered users and owner approval. No push/deploy is authorized.

## Approved direction

This build carries the approved makeup-texture homepage into a standalone website package. The visual reference remains on the canvas. The website also contains a browsable design guide at `/design-guide`.

Keep:

- Makeup as self-expression, not a set of rules.
- Warm cream surfaces, dusty rose and mauve accents, deep plum actions.
- Large expressive headings with clear, dark reading text.
- Makeup imagery blended into the page, not boxed or covered with profile panels.
- Minimal navigation, public education, and guest exploration.
- Responsive layouts, visible keyboard focus, and reduced-motion support.

Do not bring back:

- The bright peach and yellow product collage.
- Animated product illustrations or dome-shaped image containers.
- The rejected "beauty in your own tone" tagline.
- Tiny low-contrast text, repeated notices, or decorative dashes.

## Source of truth

- `artifacts/neu-website/`: runnable website source.
- `artifacts/neu-design-system/`: shared tokens and the five-family Neu component pilot. The website consumes this workspace package directly.
- `artifacts/mockup-sandbox/`: retained visual references and alternative explorations, not the production frontend.
- `artifacts/api-server/`: existing API service, not a replacement for Supabase.

Changes to the actual website should be made in `artifacts/neu-website/`, not only in the canvas mockup.

## Current release boundary

This is a frontend handoff, not a completed shared-community beta.

The homepage, public education, guest exploration and local profile interactions do not require a community account. Example product content must remain explicitly labeled as examples. Local profile storage is not cloud sync.

Do not invite people to create real shared posts or claim that accounts, cloud saves, moderation or database permissions are verified. These remain part of the unfinished Supabase work.

## Historical Stage 1 website journey and storage

The updated web MVP brief preserves a compact consultation and changes its first question to depth:

1. Forty approximate depth swatches, or an unsure answer.
2. Undertone, including first-class olive and optional subtype, saturation and skin-type refinements.
3. Optional current makeup, typed brand/product notes and personal fit observations.
4. Four launch shopping categories and progressive optional formula, concealer and lip preferences.
5. One combined editable profile and evidence-aware research browsing page.

The final action goes to `/results`. `/discover` is a compatibility alias. `/profile` uses the same shared state for editing, privacy, export and confirmed preview-only deletion, not a competing profile store.

Versioned browser storage preserves the anonymous quiz, local saves and explicitly private review drafts across reload when storage is available. Corrupt/future-version storage is preserved rather than silently overwritten; blocked storage uses a clearly labeled in-memory session. The older guest-profile key is separate and is not erased by this preview's reset. This is not an account or cloud sync. Unknown depth and undertone remain unknown; comparing research listings never implies an exact shade match.

Stage 1 adds product detail, comparison, genuine empty community evidence, local review drafting with a moderation simulation, and protected/unavailable admin state. Sixteen source-backed historical product observations replace the earlier illustrative catalog in the active journey. Exact shades, formulas, current price/stock and personalized ranking are not established. See `EXISTING_SYSTEM_AUDIT.md`, `MVP_ARCHITECTURE.md`, `DECISIONS.md` and `QA_TEST_PLAN.md` for the current stage boundary and verification.

The mobile hero uses the existing makeup textures at full width in normal document flow, blending its edges into the page background. It has no card, frame, profile overlay or fixed-height empty image container.

## Shared design system

`artifacts/neu-design-system/tokens.json` is the color, font, spacing and radius source. Run the package's `tokens` script to regenerate CSS and portable tokens. Do not edit generated outputs directly.

The initial Neu component pilot exports Button, Typeahead, Choice, ToneSwatch and Navigation from `@workspace/neu-design-system/components/neu/*`. The actual quiz uses these primitives rather than maintaining another copy. `/design-guide` uses the same package's live overview and foundations.

The full design-system preview is its own artifact. Its dark palette is derived reference material, not an approved dark website release. Source evidence and the owner-provided compact reference are retained in that artifact's docs.

## Supabase connection work

The owner chose to administer the existing Supabase project without sharing admin access. A previous read-only connection check accepted the URL and publishable key, but the community tables were not available through the API. This may reflect missing tables or the exposed schema/cache configuration.

Before enabling community features:

1. Confirm the intended Supabase project and existing schema.
2. Apply or reconcile the base schema and web migration through the owner's SQL Editor. Do not blindly rerun non-idempotent policies over an existing database.
3. Review row-level security and grants for anonymous readers and signed-in owners.
4. Prevent a product's creator from deleting other people's posts through cascading product deletion.
5. Review any database views so they do not bypass row-level security.
6. Configure the actual website's email callback URL in Supabase. Do not invent a published URL.
7. Wire real sessions, profiles, sharing, saves, deletion and reports into the website.
8. Verify owner isolation with two different accounts, including sign-out and account switching.
9. Finish moderation, privacy, terms and operational ownership before inviting a community.

Never expose an admin token or service-role key in a browser bundle or commit credentials. The publishable key is the only kind of Supabase key appropriate for the browser, with restrictive database policies.

## Running and checking

Use the managed `artifacts/neu-website: web` workflow for the preview.

From the workspace root:

```sh
pnpm install
pnpm --filter @workspace/neu-website run typecheck
pnpm --filter @workspace/neu-website test
pnpm --filter @workspace/scripts run neu:test
pnpm --filter @workspace/scripts run neu:db:test
pnpm --filter @workspace/scripts run neu:api:test
```

The Vite commands require `PORT` and `BASE_PATH`. Replit supplies these through the artifact workflow. For a standalone static build outside the workflow, supply them explicitly, for example:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/neu-website run build
```

The output is `artifacts/neu-website/dist/public/`. Use an SPA fallback when serving route URLs directly.

The development-only catalog and research imports are `pnpm --filter @workspace/scripts run neu:seed` and `pnpm --filter @workspace/scripts run neu:research:seed`. Never run those against production.

## Git and publishing

The active source repository is the Replit workspace. Stage 3 is committed on local `main`; no remote push was performed. This user explicitly withheld push and deployment approval for this stage. Do not attempt GitHub operations, change deployment settings, or publish until they are separately approved. A local commit is not a push, release, or production database migration.
