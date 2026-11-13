# Neu

Browser-first makeup discovery, public color education and an evidence-aware website preview, with the existing native app preserved separately.

## Run & Operate

- `pnpm --filter @workspace/neu-website test` — preview state, evidence and browsing regression tests
- `pnpm --filter @workspace/scripts run neu:test` — pure source-evidence/matching safeguards
- `pnpm --filter @workspace/scripts run neu:db:test` — normalized development catalog integrity
- `pnpm --filter @workspace/scripts run neu:api:test` — actual API checks through the shared proxy
- `pnpm --filter @workspace/neu-website typecheck` — website typecheck
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/neu-website build` — standalone website build
- `pnpm --filter @workspace/api-server run dev` — run the existing API service
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/neu-website/`: actual website, not the mockup sandbox.
- `artifacts/neu-design-system/`: shared Neu tokens, components and documentation.
- `artifacts/mockup-sandbox/`: retained design explorations.
- `artifacts/api-server/` and `lib/db/`: existing API and additive research catalog.
- `docs/EXISTING_SYSTEM_AUDIT.md`: baseline findings and integration boundaries.
- `docs/NEU_WEB_MVP_SPEC.md`: preserved owner-provided web MVP specification.
- `docs/MVP_ARCHITECTURE.md`, `docs/DECISIONS.md`: reuse plan and current stage decisions.
- `docs/QA_TEST_PLAN.md`: actual checks, results and gaps.
- `docs/STAGE_2_REQUIREMENTS.md`, `docs/STAGE_2_IMPLEMENTATION.md`, `docs/STAGE_2_QA.md`: newer scope, coverage and current verification.
- `docs/neu-handoff.md`: source locations, storage and GitHub handoff.

## Architecture decisions

See `docs/DECISIONS.md`. The GitHub native/static repository and this Replit workspace have different histories; do not merge them blindly. Preserve legacy parity and public waitlist behavior.

## Product

Neu's confirmed primary product is a personalized makeup look builder: Beauty Profile → Choose a Look → Budget → Personalized Set → Customize → Save or Shop. Stage 3 routes are `/looks` and `/looks/saved`; individual discovery remains `/results`. New local looks/owned inventory use `neu.looks.v1`, separate from existing keys. See `docs/STAGE_3_REQUIREMENTS.md`, `docs/STAGE_3_IMPLEMENTATION.md` and `docs/STAGE_3_QA.md`. Do not present incomplete/unpriced drafts as verified four-item budget matches.

Stage 2 extends the accepted Stage 1 with known-shade/manual onboarding, one editable local profile, saved category preferences, a normalized catalog and source-explained candidates. Descriptor alignment is not an independently verified exact shade match. Real member accounts/public community remain unavailable; community requires 500+ registrations and owner approval. Selected traits are processed transiently by the API, not stored as server profiles. Existing owner Supabase and production data remain untouched. Stop for stage review; no remote push or deploy without approval.

## Gotchas

- Use the registered managed workflows for previews; they inject `PORT` and `BASE_PATH`.
- Edit design-system `tokens.json`, not generated CSS/token outputs.
- Keep existing browser storage keys and owner-administered Supabase data separate from preview state.
- Test logs, screenshots and linked external source-port worktrees belong under ignored `generated-artifacts/`, not in source commits.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Neu's additive US retailer reference catalog: `research/neu-catalog/README.md` covers source boundaries,
  verified counts, safe development setup/import commands, queries, CSV exports and future research batches.
  It is separate from Supabase member products and accounts. Do not replace or migrate community data.
