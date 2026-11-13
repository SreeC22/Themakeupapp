# Neu website handoff

## Current Neu Edit and adaptive routines

The revised Stage 3 specification makes the reusable collection central: Onboarding → Complexion Profile → Your Neu Edit → Explore Looks → Customize → Save or Shop. `/edit`, `/routines` and `/research` extend the existing website and protected local store. Current roadmap, coverage and limits: `STAGE_3_WARDROBE.md`; actual checks: `STAGE_3_WARDROBE_QA.md`. No push, deployment, production changes or public community activation. Public community is additionally gated on 500+ registered users and owner approval.

## Historical Your Neu Look handoff

The owner accepted Stage 2 based on its report and confirmed the look-first core product. Stage 3 extends it without replacing the existing website, design system or catalog. The primary journey and review gate are documented in `STAGE_3_REQUIREMENTS.md`; implementation/coverage and actual checks are in `STAGE_3_IMPLEMENTATION.md` / `STAGE_3_QA.md`. `/looks` and `/looks/saved` add local planning/editing/owned reuse; `/results` remains individual discovery. Community stays out. Stop for review; no push or deploy.

## Current Stage 2 handoff

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

## Current website journey and storage

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
```

The Vite commands require `PORT` and `BASE_PATH`. Replit supplies these through the artifact workflow. For a standalone static build outside the workflow, supply them explicitly, for example:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/neu-website run build
```

The output is `artifacts/neu-website/dist/public/`. Use an SPA fallback when serving route URLs directly.

## Git and publishing

A local Git commit is not a GitHub push or a deployment. The owner subsequently authorized pushing the approved website and repository organization to GitHub main.

GitHub has separate history from this Replit workspace. The prepared source port is based on GitHub main, on local branch `sync/neu-website-main`, commit `7e0f32a`, with a linked worktree under `generated-artifacts/neu-github-main`. Verify its Git top-level before operating there. It adds an isolated `website/site` and `website/design-system` workspace with portable Vite configurations, a lockfile, contributor guidance and updated root documentation. Existing native code, root static pages and database scripts are unchanged.

The subsequent Stage 0/1 work is on `feature/neu-web-mvp-stage-1` and is not included in that older pending source-port commit. No new GitHub push is attempted as part of the stage preview.

The portable workspace installed successfully; both typechecks and production builds passed. GitHub rejected the push with an invalid username/token error, including one retry after attaching the existing connection. GitHub CLI is not authenticated here. The source port is committed locally, not pushed. Restore write authentication before retrying a normal fast-forward push; do not force-push or merge the unrelated Replit history into GitHub.

Nothing should be published automatically. The owner decides what stays and when the website is ready to share.
