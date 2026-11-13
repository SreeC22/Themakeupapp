# Stage 3 wardrobe — actual verification

## Automated checks

All **231 automated tests passed**:

| Check | Passed |
| --- | ---: |
| Website state, matching integration, legacy regression, wardrobe/routine and navigation tests | 166 |
| Pure source-evidence/matching tests | 53 |
| Actual development PostgreSQL integrity tests | 2 |
| Actual catalog/recommendation/research API tests | 7 |
| Existing catalog regression tests | 3 |

Full workspace typechecking passed. After the browser-discovered display fix, website typechecking and all 166 website tests passed again. The final website production build passed:

- JavaScript: 460.22 KB / 138.51 KB gzip.
- CSS: 152.62 KB / 26.96 KB gzip.

Test/build logs are under `generated-artifacts/neu-wardrobe-stage3/` and are intentionally ignored generated output, not source files.

### Specifically covered

- Six routines and shared collection IDs rather than generated per-occasion shopping lists.
- Simple/elaborate versions, optional/skipped steps and explicit retained references.
- Multi-use manufacturer restrictions; ordinary blush cannot become eye/lip-safe.
- Liner/gloss subtype separation, layering roles, missing opacity and two-toned-lip uncertainty.
- Exact owned-identity validation, stale/estimated evidence rejection and missing items.
- Existing budget guards, no unknown-price-to-zero conversion, duplicate multi-use cost handling.
- Original product IDs, 26-brand seed, palette-versus-pan counting and no undertone decoding from Mario foundation letters.
- Backward-compatible store fields, revisions/conflicts, raw corrupt/future protection and no silent discarded routines.
- Research source separation, dated disclosures/negatives, candidate-only status and a read-only API.

## Browser check

The real browser run used its own TEST-labeled local data, not the owner's browser or production data. Initial work verified known-reference onboarding, internal detail/back draft retention, collection save, exact-variant ownership and same-item Cheeks/Eyes reuse.

It found a display bug: skipping Foundation hid its assessment product and incorrectly triggered a “no longer available” warning, although the saved collection reference remained intact. The condition now checks actual collection membership. A dedicated regression test covers present, skipped, unselected and genuinely removed references.

The follow-up continues the same browser session over the fix and the remaining routine-save/reload/protection checks. Final observations are appended below after that pass.

## Scope limits

These results do not establish calibrated shade matches, wear/skin compatibility, complete priced baskets or identical results on two-toned lips. The data coverage and remaining beta work are documented in `STAGE_3_WARDROBE.md`. Links are real product pages but may default to another variant; confirm the exact shade, price and stock at the retailer.

No production/Supabase/native-app changes, pushes, deployments, public review submissions or community activation were performed.
