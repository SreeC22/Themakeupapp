# Neu Stage 0 and Stage 1 verification

## Result

Stage 1 is ready for owner review as a working local-only website preview. It is not a production community beta or a verified recommendation engine.

## Commands actually run

| Check | Result |
| --- | --- |
| `pnpm --filter @workspace/neu-website test` | 56 passed, 0 failed. |
| `pnpm --filter @workspace/neu-website typecheck` | Passed. |
| `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/neu-website build` | Passed. Final JS bundle 297.96 kB, gzip 91.75 kB. |
| `pnpm --filter @workspace/scripts run catalog:test` | 3 existing development-catalog tests passed. Fixture cleanup is part of the suite; no member/Supabase operations were performed. |
| `node --experimental-strip-types generated-artifacts/neu-github-main/app/scripts/parity.mjs` | 2,180 legacy site/app comparisons passed. Existing typeless-module warning only. |
| `git diff --check` | Passed. |
| Read-only GET of documented public legacy entry | HTTP 200. No waitlist form submission or deployed-site mutation. |

Logs are retained under ignored `generated-artifacts/neu-stage1/`. The initial audit and unchanged legacy files are described in `EXISTING_SYSTEM_AUDIT.md`. Build/typecheck success is not a production deployment.

## Unit coverage

- Nineteen evidence tests: four-category scope, unique URL-safe identities, original record/source fidelity and no invented shade/price/formula/image/review facts.
- Twenty-six state tests: fifteen named profile journeys spanning all eight depth ranges; private defaults; independent answer arrays; all forty swatch identities; honest unknowns; corrupt/future-version preservation; blocked/quota storage; preview-only deletion preserving legacy data; invalid enum/category/duplicate-save rejection; local-only moderation state serialization.
- Eleven browsing tests: category, text and brand constraints; zero-result cases; unknown price/finish/coverage and skin-type evidence; source-host retailer filtering; verified-shade evidence exclusion; deterministic non-mutating sorts; numeric budget validation.

Named profile fixtures include fair cool dry, fair warm oily, light cool muted olive, light warm olive combination, medium neutral, medium muted olive, tan warm olive oily, tan cool olive dry, deep neutral, deep cool dry, deep warm combination, two-toned lips with an opaque goal, very fair uncertain undertone, very deep uncertain undertone and light-medium neutral olive.

These test profile persistence, not product suitability. Stage 3 ranking fixtures and calibrated confidence tests remain future work.

## Browser outcome, including the failure found

One browser tester ran the main journey, then a focused continuation after a real defect:

1. The initial pass completed the depth-first quiz, contextual Learn return, exact swatch/trait retention, results reload, filters, comparison, product evidence and local saved-list persistence/removal.
2. It found that saving from `/review/new` retained a draft in state but did not put its identity in the URL. Reload therefore opened a new blank form.
3. The save action now replaces the URL with `/review/new?draft=<local-id>`. The form loads that exact saved identity.
4. The same tester verified the corrected save/reload/update path and completed the previously untested remainder. It did not rerun the whole quiz or claim a fresh comprehensive test pass.

## Browser checks that passed

- Actual website at `/`, not the sandbox or design-system browser.
- Mobile homepage retains the embedded approved texture image.
- Four-section quiz: Medium starting shade 4, exact `neu-depth-24`; Olive/Cool-olive; Muted/Dry; typed brand autocomplete; optional private product/shade history; Foundation and Lips.
- Contextual Learn returns with answers intact. One combined result/profile, not repeated result screens.
- Profile answers persist after reload. Unknown product facts are labeled as such.
- Lips and brand search narrow actual research records; a strict budget/evidence request produces a truthful empty state.
- Two-product comparison and source-backed detail. Historical date and external recorded URLs were inspected, not opened for a purchase.
- Local save survives reload; removal works.
- Local review draft survives reload and update at the same identity. Simulated Approved remains private and unsubmitted, with public submission disabled.
- Community separates local drafts from zero genuine connected public experiences.
- Admin is restricted/unavailable. No public moderation authority or fake sign-in.
- Profile is private by default. Actual downloaded JSON was parsed and contained the test answers/drafts.
- Confirmed deletion removes the current preview key while preserving a separately seeded legacy test sentinel.
- Retailer filter restricts recorded source hosts; verified-shade-only and strict skin-type evidence produce honest empty states.
- `/discover` and `/share` compatibility routes resolve correctly.
- Overflow checks passed at 360, 390, 768 and 1440 widths on representative pages. The wider checks were not a complete every-route viewport matrix.
- No page/console errors were captured in monitored checks.

Browser test data was synthetic, local to the isolated test context and cleared with the preview reset. No public content, real account, retailer transaction, Supabase operation or production deployment occurred.

## Visual evidence

- Before: `generated-artifacts/neu-stage0/mobile-before.jpg` and `desktop-before.jpg`.
- After: `generated-artifacts/neu-stage1/mobile-home.jpg` and `desktop-results.jpg`; final reviewed capture: `desktop-results-final.jpg`.
- The browser report in this conversation includes captures of exact swatch selection, local draft reload, genuine empty community, admin restriction, JSON export, confirmed reset and responsive layouts.

## Explicitly not certified

Full WCAG/screen-reader audit, real-device testing, slow-network benchmarks, production behavior, native dependency typecheck/export, live FormSubmit delivery, real auth, private backend ownership/RLS, rate limiting, moderation operations, catalog freshness/image rights, verified exact shades, recommendation correctness and legal/privacy release review were not established by this pass.

Corrupt/future-version storage and blocked/quota behavior were unit-tested, not separately exercised through browser settings. No full security scan was requested or claimed.

## Owner checkpoint

Review the working website and this report. Do not start the verified-catalog stage, ranking engine, real community integration or production deployment until the next approval.
