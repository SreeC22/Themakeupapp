# Stage 2 actual verification

This is the next-stage verification report, not a claim that the full progressive catalog or production launch is complete.

## Completed automated checks

| Command | Actual outcome |
|---|---|
| `pnpm --filter @workspace/scripts run neu:test` | 53 passed, 0 failed |
| `pnpm --filter @workspace/neu-website test` | 75 passed, 0 failed; includes the existing 56 plus 19 new profile/onboarding/preference regressions |
| `pnpm --filter @workspace/scripts run neu:db:test` | 2 passed, 0 failed |
| `pnpm --filter @workspace/scripts run neu:api:test` | 4 passed, 0 failed against the running proxy/API |
| `pnpm --filter @workspace/scripts run catalog:test` | 3 passed, 0 failed; existing development catalog suite |
| `pnpm run typecheck` | Passed across libraries, API, website, design-system preview, sandbox and scripts |
| `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/neu-website build` | Passed; 361.51 kB JavaScript / 109.80 kB gzip, 151.51 kB CSS / 26.83 kB gzip |
| `git diff --check` | Passed after trimming generated trailing blank lines |

The 53 matching tests cover wrong warm/cool/neutral recommendations, olive temperatures, hard depth gates, conflicting source claims, missing evidence, estimates/reports, stale/future facts, name-only identities, exact and missing references, fit corrections, oxidation, manual overrides, saturation gaps, category preferences, concealer intent, two-toned lips, contradictory full/sheer goals, budget uncertainty and deterministic behavior. Synthetic fixtures are clearly test-only and never catalog records.

Database tests read the actual normalized development subset and deliberately attempt cross-product evidence inside a rolled-back transaction; the foreign key rejects it. API tests verify real catalog responses, bounded input rejection, reference inference, missing-reference limitations and source explanations. No account/member writes occur.

The existing catalog suite performs idempotent development research import and cleans its generated test fixtures; it is not a pure no-database test. The new seed was explicitly imported and repeated with unchanged counts to check idempotence. No production or owner Supabase operation was performed.

## Integration findings fixed before review

- Included `DOM.Iterable` for the generated client's real POST header handling.
- Fixed the UI's exact `No change noticed` option so it does not invalidate a stable perfect reference.
- Verified sheer lip variants cannot satisfy full/even coverage. Contradictory goals are surfaced instead of averaged.
- Name-only complexion identities are not arbitrary personalized shade suggestions when the user has known traits.
- Removed an unsupported formula assertion from the active Fenty observation; the normalized formula remains unknown.
- Content-addressed source observations prevent withdrawn same-day assertions from reappearing after reimport; previous evidence stays separate.
- Updated privacy copy to disclose transient API processing rather than falsely claiming nothing leaves the browser.
- Removed concurrent queries on the same PostgreSQL transaction client after a driver deprecation warning.

## Browser verification

**Passed:** one isolated browser test session with a focused continuation for the second requested path. No real login, public post, checkout, owner Supabase change or owner-browser reset was performed.

### Known reference path

- At 390px: equal opening choices, Concealer → e.l.f. Cosmetics → Hydrating Camo Concealer → exact Medium Sand, Perfect match, No change noticed, then Dry.
- Went directly to four-category discovery, without a mandatory category questionnaire or account prompt.
- Real catalog/recommendation requests returned `200`; source-based medium/Neutral reference descriptors and limitations appeared without percentages.
- Reload retained reference names, exact IDs, fit, oxidation and skin type. Editing to Too pink persisted and did not invent a corrective shade-step offset.
- Added TEST-prefixed missing brand/product/shade values. They persisted as self-reports without catalog identities.
- Saved Fenty 106N, opened actual source/evidence details and verified saved state after reload.
- The isolated legacy-key sentinel remained unchanged.

### Manual path and preferences

- Backtracked to the opening choice without losing references or the save.
- Selected stable Medium swatch 24, Olive, Cool-olive, Muted and Dry.
- Learn returned to the same coloring step with choices intact; the actual Back controls retained selections.
- Results truthfully showed **no supported foundation candidates** for this evidence-limited cool-olive profile, not a warm/neutral-olive substitution or name-only foundation.
- Foundation Medium/Matte preferences and Lips Two-toned/Full/Opaque-even/Satin preferences remained independently saved after reload.
- Lip suggestions were source-described high-coverage satin variants, not sheer/Veil. The UI explicitly avoided promising an even result on two-toned lips.
- Profile editing remained available. Reference IDs/Too pink feedback, the TEST self-report, saved Fenty shade and legacy sentinel remained unchanged.

Representative overflow checks passed at 360, 390, 768 and 1440 pixels. A 768px Saved card remains narrow with unused adjacent whitespace, but no clipping/overflow was observed. No page/console errors were observed. One immediate post-reload screenshot was briefly blank; populated DOM and later captures were normal, with no recurring rendering failure established.

The browser did not repeat every unchanged Stage 1 path or perform a new account/real-publication flow. Export/reset/corrupt/future-state protections remain covered by the existing and extended unit suite and prior unchanged Stage 1 verification, not a newly claimed browser certification.

Browser screenshot references: opening `9ypdrc`, known reference `zosn0s`, persisted corrected reference `tzciw0`, missing entry `ww7otd`, saved detail `wfrcdd`, manual depth `te6bjh`, Learn return `a7oloq`, independent preferences `w2rdgw` / `ckd3qq`, narrow lips layout `gzm96u`, honest foundation gap `r2wxck`.

## Coverage and limits

The reviewed development subset contains 25 selected candidate brands, 4 with verified product lines, 5 lines and 197 verified identities plus one unresolved Fenty identity. Four US selectors reconcile with their source-declared counts on the observation date. Exact trait evidence is a separate measure from shade identity.

The full 100–150-line / 2,000–4,000-variant target is not complete or required for Stage 2. Unknowns, partial ranges, absence of measured saturation/cool-olive evidence, missing prices/inventory and lack of real two-toned-lip outcome evidence remain visible. See `STAGE_2_IMPLEMENTATION.md`.

This is not a full accessibility certification, security audit, real-device certification, current-inventory guarantee or independently calibrated matching validation. No real registration, public posting, production deployment or remote push is tested or claimed.

## Evidence files

Raw run output and screenshots are retained under ignored `generated-artifacts/neu-stage2/`. The initial mobile choice screenshot is `mobile-onboarding.jpg`. Runtime API/workflow logs were inspected; observed `400` responses are intentional invalid-input tests, while the API's root `/` probe returns its expected `404`.
