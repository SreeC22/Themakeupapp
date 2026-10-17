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
- `artifacts/mockup-sandbox/`: retained visual references and alternative explorations, not the production frontend.
- `artifacts/api-server/`: existing API service, not a replacement for Supabase.

Changes to the actual website should be made in `artifacts/neu-website/`, not only in the canvas mockup.

## Current release boundary

This is a frontend handoff, not a completed shared-community beta.

The homepage, public education, guest exploration and local profile interactions do not require a community account. Example product content must remain explicitly labeled as examples. Local profile storage is not cloud sync.

Do not invite people to create real shared posts or claim that accounts, cloud saves, moderation or database permissions are verified. These remain part of the unfinished Supabase work.

## Supabase setup still required

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

A local Git commit is not a GitHub push or a deployment. The only configured remote at handoff time was the platform's backup remote, not a GitHub repository. Reconnect the intended repository before pushing.

Nothing should be published automatically. The owner decides what stays and when the website is ready to share.
