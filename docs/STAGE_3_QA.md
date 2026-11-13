# Stage 3 actual verification

## Automated results

| Check | Actual outcome |
|---|---|
| Website unit/regression suite | 127 passed, 0 failed: 75 previous tests, 13 frontend integration/helper tests, 9 navigation tests and 30 look-model/storage/catalog tests |
| Existing matching safeguards | 53 passed, 0 failed |
| Normalized development database | 2 passed, 0 failed |
| Actual API through shared proxy | 4 passed, 0 failed |
| Existing catalog regression suite | 3 passed, 0 failed |
| Full workspace typecheck | Passed |
| Production-mode website build | Passed; JavaScript 408.40 kB / 124.04 kB gzip; CSS 152.57 kB / 26.95 kB gzip |

Tests exercised unknown/stale/estimated prices, numeric and maximum-tier budgets, no fabricated totals, wrong-undertone exclusions, unknown formula/opacity, reference/profile request integrity, source freshness, unresolved saved IDs, explicit clears, independent swaps, owned reuse, edited owned labels with leftover catalog IDs, revision conflicts, unavailable/quota storage, corrupt/future protections and legacy-key preservation. Navigation tests cover detached draft snapshots, exact null/missing choices, return-time revalidation, external edits/deletion conflicts, new editors, successful-save identity promotion, bounded eviction and reset.

The curated evidence matrix checked 32 occasion/profile/tier configurations with four supported descriptor/style choices, while asserting no complete verified-price total. It also checked truthful low-tier and cool-olive foundation gaps. This is deterministic evidence-rule verification, not independent shade or wear-time validation.

During integration, old catalog-size assertions were changed from a fixed Stage 2 count to baseline-preservation and actual-count reconciliation. A test fixture initially used three incorrect old product IDs; those assertions were corrected to the actual unchanged IDs. The initial failures were in regression expectations, not deleted catalog data. All final outcomes above are from the corrected integrated suite.

## Browser result

The first browser pass found an actual working-state loss: generated choices disappeared after opening an internal catalog detail and returning. No profile data was lost, but the remaining save/edit journey was blocked. That was not counted as a pass.

The fix introduced provider-lifetime working-editor snapshots, preserving inputs, exact choices/nulls, conflict baseline and dirty state across internal navigation. Current evidence revalidates without generating replacement selections or implicitly saving a library entry. The website was restarted after the fix.

**The fixed critical journey passed in the same isolated browser context:**

- Reused the retained Medium Sand/Perfect match/Dry profile without repeating onboarding. Generated one new Soft Glam/Mid-range set explicitly.
- Actual recommendation POST returned `200`, offering Fenty 316N, e.l.f. Medium Sand, e.l.f. Cheeky Lychee and e.l.f. O FACE Drive.
- Opened internal catalog details and returned. All four exact choices, Soft Glam and Mid-range remained intact. Automatic evidence refresh did not replace them or create a saved entry.
- Swapped Lips to Effortless. The other three IDs stayed unchanged, and the swap itself added no recommendation request.
- Marked Effortless owned without changing the current selection, then explicitly reused it. Only Lips became the owned choice. The UI distinguished zero new purchase from a retail price; three unknown prices kept the complete total unverified.
- Saved a unique TEST-named look, reopened it, updated the same ID/name and USD 100 limit, then reloaded. Exactly one library entry remained, with occasion, budget, three catalog choices and owned Lips preserved.
- Start new opened an independent empty editor without changing that saved look.
- Temporarily replaced only the isolated test-browser look key with version 99: saving was blocked, raw data was not overwritten and no false saved-success state appeared. Restored the captured test data and reopened the same saved ID successfully.
- Original profile JSON remained byte-for-byte unchanged; the TEST legacy-key sentinel was unchanged.
- Saved editor/library layouts had no horizontal overflow at 360, 390, 768 and 1440 pixels. Edit/save controls remained reachable after scrolling.

Eight recommendation POSTs occurred over the fixed journey, including Generate, navigation/reopen refresh and individual discovery. The isolated swap did not add a request. No failed API response was observed. Development restart/HMR logs included a transient provider-context error, followed by normal reconnection; it did not recur on the final reload.

The product-save control remained visible/enabled, but the tester did not repeat saving an individual product or every unchanged Stage 1/2 path. The optional oxidation selector was not exercised in this Stage 3 browser journey. Existing regression and prior-stage coverage are not represented as a new end-to-end certification. Future-version recovery actions were closely spaced visually, though usable.

Screenshot references: source/evidence `jjtj7t`; detail `h97o3m`; initial discovered reset `34rntt`; fixed internal detail `oadkvu`; Lips swap `bmh81w`; owned reuse `q36kfu`; updated saved entry `bswwrj`; protected version `ogmrvq`; independent new editor `foglzf`; final saved editor `ye4f7m` / `7xmcbn`.

## Runtime and privacy boundaries

Managed website and API workflows were restarted after the implementation batch. The actual mobile `/looks` page rendered successfully. API catalog/recommendation requests returned `200`; invalid-input tests intentionally returned `400`. API-root probes return the existing `404`.

Earlier live-edit HMR logs included transient invalid-hook/provider-context errors while provider files were changing or reconnecting. Fresh final reloads rendered normally. The successful final browser verdict is distinguished from these development-edit logs; this report does not claim that every prior log was clean.

No production/Supabase writes, real checkout, public post or owner-browser-data deletion was performed. Browser-local save behavior is not a cloud-account test. This is not full accessibility certification, a security audit, real-device certification or a verified live-stock/price guarantee.

## Evidence

Logs and the mobile preview screenshot are under ignored `generated-artifacts/neu-stage3/`. Coverage, official sources and limitations are in `STAGE_3_IMPLEMENTATION.md`. Source fixtures are clearly test-only and are not imported into the catalog.
