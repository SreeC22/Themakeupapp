# Neu website handoff

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

The owner approved a shorter flow instead of the original long questionnaire:

1. Current makeup, optional. Brand and product fields support typed suggestions and manual entry. Product fit observations expand within each product.
2. Forty illustrative depth swatches, or an unsure answer.
3. Optional undertone and independent olive characteristics on the same screen.
4. Makeup interests, with optional preferences in an expandable section.
5. One editable starting-point page with clearly labeled illustrative examples.

The final action goes directly to `/discover`. There is no second results page or account gate. `/profile` aliases `/quiz` rather than exposing a second, conflicting profile editor.

Quiz answers are held in the current page session. Back, closing the quiz, navigating to Learn and returning preserve the draft. Refreshing clears it, as stated on the first question. The pre-existing coarse local profile store remains for backward compatibility with educational controls; it is not a cloud account or the new forty-swatch quiz store. Unknown quiz depth and undertone are never silently converted into a personal match. Profile-example comparison is shown only when the visitor supplies depth and a definite undertone.

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

A local Git commit is not a GitHub push or a deployment. This delivery does not push, change GitHub permissions or re-test remote authentication. Confirm the intended remote and working credentials separately before pushing.

Nothing should be published automatically. The owner decides what stays and when the website is ready to share.
