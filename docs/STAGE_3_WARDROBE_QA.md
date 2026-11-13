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

The browser session stopped at the skipped-step warning. The warning is now fixed and covered by a regression test, but the planned browser follow-up was blocked before it could run. Therefore the following are **not verified in the browser**: routine save/edit/reload, routine-ID preservation, future-version save protection through the UI, the research page, and the remaining responsive sizes. Automated browser testing was unavailable in the current session; passing code tests are not a substitute for those checks.

Before stopping, the browser did verify known-shade onboarding; saving and retaining a draft through an internal detail-page round trip; saving a TEST-labeled Neu Edit; adding and marking the exact multi-use variant as owned; and reusing that same item for both Cheeks and Eyes. It verified the ordinary blush picker omitted Eyes and Lip color, simple mode did not require Foundation, and simple/elaborate views referenced the same collection. It stopped before routine save, so saved routines remain to be checked end to end.

The display-warning fix was typechecked, covered by the dedicated membership test, and included in the final website build. The TEST-labeled browser data remained in that isolated test browser. No owner-browser, production or authenticated data was touched.

## Scope limits

These results do not establish calibrated shade matches, wear/skin compatibility, complete priced baskets or identical results on two-toned lips. The data coverage and remaining beta work are documented in `STAGE_3_WARDROBE.md`. Links are real product pages but may default to another variant; confirm the exact shade, price and stock at the retailer.

The history-preserving review branch and separate Replit-history branch were pushed to GitHub with owner approval. GitHub `main` remains unchanged. No production/Supabase/native-app changes, deployments, public review submissions or community activation were performed.
