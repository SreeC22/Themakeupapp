# Stage 0: existing system audit

## Repository baseline

The Replit workspace and GitHub repository have separate histories. Development is on `feature/neu-web-mvp-stage-1`, created from the existing approved website, not a new scaffold.

GitHub main was checked read-only and remains `6e0acc4`. Its preserved checkout is accessible through the linked worktree at `generated-artifacts/neu-github-main`; its local source-port commit has not been pushed. GitHub write authentication remains a separate unresolved issue. No authentication or production configuration was modified for this audit.

Reviewed the root README, CLAUDE, HANDOVER, APP_PLAN, WEB_MVP_SETUP, SCHEMA and WEB_MVP_SCHEMA references and focused portions of the static landing/community implementation and native parity harness. Root documentation describes older native/static behavior, not the newer approved React website. The newer build specification governs Stage 1.

## Reusable website

- `artifacts/neu-website`: existing React/Vite website, working routes, four-section consultation, exact forty-swatch selection, public Learn pages, product examples and error boundaries.
- `artifacts/neu-design-system`: approved tokens and five reusable control families. This remains the visual source of truth.
- `artifacts/mockup-sandbox`: earlier visual explorations. It is not the production website source.
- `artifacts/api-server` and `lib/db/src/catalog`: existing services and additive research catalog. Neither is a working member backend for the React website.

The quiz draft is currently page-session-only. `/profile` redirects to `/quiz`; `/saved` and `/share` explain missing backend functionality. `/results`, product detail, community, review and protected admin journeys are missing from the newer website. Older example data must not become verified product facts.

## Existing app and public site

The GitHub `app/` Expo implementation and root `index.html` remain unchanged. Their parity harness reads the root legacy quiz directly. FormSubmit wiring was inspected without submitting a form or changing its destination. A baseline source-line search included an existing contact address in tool output; that address is not reproduced in the audit or new application files. Future source searches should avoid printing contact/configuration lines.

The documented public entry is a GitHub Pages static site. This audit does not certify its deployed state, submission delivery or current hosting settings. Local legacy source checks are not a production browser test.

## Data evidence

`research/neu-catalog/initial.json` records historical US retailer observations checked on 2026-10-17. It has 37 product-evidenced relevant brands among a larger candidate directory. Its named product records can support a preview research listing, not a verified exact shade, present stock, current price, product image permission or personalized fit score.

Its broad taxonomy includes categories outside the new four-category launch. Preserve the research collection and project a four-category website view rather than destructively replacing it.

## Security and integration gaps

The legacy Supabase scripts are proposals, not proof of deployed policy safety. Findings include broad reads in the base script, product-to-post cascading deletion, and community migration grants/policies requiring reconciliation with the existing owner-administered project. No Supabase queries, migrations, credentials or existing integrations were changed.

Real sessions, private profile/saves isolation, reports, moderator roles and two-account RLS tests remain unverified. The Stage 1 website must not report an authenticated or published action as successful.

## Actual baseline checks

- `pnpm --filter @workspace/neu-website typecheck`: passed.
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/neu-website build`: passed.
- `node --experimental-strip-types generated-artifacts/neu-github-main/app/scripts/parity.mjs`: passed, 2,180 checks. Node reports an existing typeless-package performance warning; no app configuration was changed to hide it.
- Diff against GitHub main for native app, root static pages and SQL scripts: empty.
- Replit homepage screenshots: `generated-artifacts/neu-stage0/mobile-before.jpg` (390x844) and `desktop-before.jpg` (1440x1000). No browser errors observed.
- Public legacy page: read-only GET returned HTTP 200 and title `neu`. Legacy inline quiz/waitlist markers are present. No form was submitted; function-level parity is proven against the preserved repository source, not against the deployed HTML.
- Existing catalog suite, `pnpm --filter @workspace/scripts run catalog:test`: 3 tests passed. This suite uses the workspace development catalog database, idempotently imports the existing research batch and cleans up its generated fixture identifiers. It does not use the owner's Supabase member tables.
- Stage 1 evidence projection tests, `node --test artifacts/neu-website/tests/catalog-evidence.test.mjs`: 19 passed. These prove source-record fidelity, not present retailer availability or shade compatibility.

Native full dependency typecheck/export, live waitlist submission, deployed website browser behavior, production Supabase/RLS, security certification and real-device/screen-reader testing were not performed.
