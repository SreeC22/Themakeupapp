# Your Neu Look — implementation and evidence

## Product direction and working journey

Neu is a personalized makeup look builder. The primary journey is **Beauty Profile → Choose a Look → Set Budget → Generate Personalized Makeup Set → Customize → Save or Shop**. Foundation matching supports that journey rather than defining the whole product.

The existing website now provides:

- `/looks`: Everyday, Soft Glam, Party Glam and Work & College; budget tier/optional USD limit; explicit generation; four visible product slots; per-slot customization, evidence and unresolved states.
- `/looks/saved`: saved complete/draft looks, reopen/edit, same-ID updates, save as a separate new look and confirmed deletion.
- An owned-product makeup bag, including catalog items and explicitly self-reported items. Marking something owned is not proof of fit and does not itself authorize replacing a working selection.
- Existing `/quiz` two-path onboarding, `/profile` and exact reference editing. Completion leads into look building.
- Existing `/results` individual discovery, historical comparisons/details, `/saved` product saves, Learn and private feedback compatibility paths.

Home/navigation prioritize Your Neu Look, while individual product exploration remains accessible. No new public community, account requirement, checkout, cloud profile or fictitious merchant service is introduced.

## Implementation checkpoints

1. Product direction and stage requirements were aligned in the roadmap.
2. Source-bounded look planning and mobile-first occasion/budget/customization surfaces were added.
3. Named local looks, editing, owned reuse, export/reset integration and storage protections were connected.
4. Strategic catalog additions and actual verification were completed for the stage review.

See `STAGE_3_REQUIREMENTS.md` for the owner scope and `STAGE_3_QA.md` for actual results rather than assumed completion.

## Evidence-bounded look planning

The existing generated catalog/recommendation API hooks remain in use; there is no fake recommendation fallback or second competing matcher. The submitted profile is retained alongside its freshness-guarded response so a previous profile cannot masquerade as current.

Occasions provide editorial cheek/lip color directions where the user left those choices open. Explicit saved category preferences take precedence. The system does not claim that a brand scientifically endorses an occasion, that products have tested layering compatibility, or that finish guarantees wear time.

- Complexion auto-selection requires a descriptor-aligned result from the existing hard depth/undertone/olive rules.
- Color auto-selection requires an explicit fresh source color family. Names alone do not become color classifications.
- Requested formula/finish/coverage/opacity without supporting evidence remains an unresolved alternative, not an automatically satisfied preference.
- Unknowns, estimates, reports, stale/future evidence and unresolved identities do not become verified facts.
- A missing saved choice stays retained and visibly unresolved; revalidation does not silently replace it.
- Swapping one slot changes that selection only. Regenerating the whole set requires an explicit action/confirmation.
- Owned reuse is explicit; zero cost means **no new purchase**, not a zero retail price. Self-reported products can be reused without being called verified matches.

### Budget interpretation

Tier means an editorial maximum: Mid-range may include Drugstore, and Luxury may include either lower tier. It is not a verified basket price.

Numeric-budget planning avoids knowingly selecting an automatic purchase above the remaining verified budget. A deliberate over-budget swap remains visible with an over-budget warning. Unknown prices are never counted as free or used to certify a total. All four purchases must have verified prices—or explicit owned reuse—for a known new-purchase total. Taxes, shipping, promotions and current availability are not guaranteed.

The present price coverage is sparse. Most numeric-budget plans therefore remain **budget unverified**, not falsely “under budget.”

## Current catalog coverage

Observation date: **2026-11-13 UTC**. These are source observations, not live inventory or independently calibrated matches.

| Measure | Stage 2 baseline | Current Stage 3 subset |
|---|---:|---:|
| Selected candidate brands | 25 | 25 |
| Brands with reviewed lines | 4 | 4 |
| Product lines | 5 | 9 |
| Verified shade/variant identities | 197 | 290 |
| Identity under review | 1 | 1 |
| Selector ranges reconciled with source count | 4 | 8 |
| Partial ranges | 1 | 1 |

Identity verification, complete selector enumeration and verified matching traits are **different coverage measures**.

### Strategic additions

| Official US source | Category | Identities | Facts added and boundaries |
|---|---|---:|---|
| [e.l.f. Camo Liquid Blush](https://www.elfcosmetics.com/us/products/camo-liquid-blush) | Blush | 12 | Literal color descriptors, dewy/liquid claims and manufacturer skin-type statement |
| [e.l.f. O FACE Satin Lipstick](https://www.elfcosmetics.com/us/products/o-face-satin-lipstick) | Lips | 20 | Literal color descriptors and satin/lipstick claims; rich pigment is not assumed opaque coverage |
| [Fenty We're Even Hydrating Longwear Concealer](https://fentybeauty.com/products/we-re-even-hydrating-longwear-concealer-300n) | Concealer | 50 | Explicit undertone descriptions, medium coverage/natural finish/all-skin-types claims; selected 300N medium-family source context only, not inferred depth for all codes |
| [Rare Beauty Kind Words Matte Lipstick](https://www.rarebeauty.com/products/kind-words-matte-lipstick) | Lips | 11 | Full selector identities; only selected Fun had captured mauve color/price evidence. Other variant colors were not guessed |

These additions address lower-tier lip/cheek options, source-described styling colors and an alternative natural-finish concealer. They do not complete every budget tier or complexion.

### Individually verified price observations

- e.l.f. Camo Liquid Blush **Berry Well**: **USD 8**.
- e.l.f. O FACE Satin Lipstick **Standing Ovation**: **USD 10**.
- Fenty We're Even Concealer **300N**: **USD 34**.
- Rare Beauty Kind Words Matte Lipstick **Fun**: **USD 20**.

Each is attached only to its observed selected variant. USD was confirmed in the official page's structured/active currency metadata. No line-wide extrapolation, subscription price, shipping/tax estimate or current-stock assertion is imported.

### Actual planning coverage

Deterministic tests using the curated evidence formed four source-supported descriptor/style selections for **Fair/Neutral, Light/Warm, Light/Neutral and Medium/Neutral**, across all four occasions with Mid-range and Luxury maximum tiers: **32 checked configurations**. These are not human wear tests, exact shade guarantees or verified-price baskets.

Drugstore-only foundation remains unresolved because the observed e.l.f. foundation identities lack the required depth/undertone evidence. Cool-olive/muted foundation gaps remain unresolved. Those are intentional empty states, not substituted warm/neutral-olive matches.

The full 100–150-line / approximately 2,000–4,000-variant catalog target remains progressive and does not block the look experience.

## Persistence and integrity

`neu.looks.v1` stores named looks, exact category choices/nulls, occasion, budget, update time and owned products. Existing profile/product/draft keys and legacy IDs remain unchanged.

- Writes validate bounded data and a fresh revision, reject stale revisions and protect corrupt/future/unavailable storage.
- Failed/quota writes do not report success.
- Unsaved edits are not silently overwritten by newer saved-look revisions.
- Unresolved old IDs remain retained; explicitly clearing a slot stays cleared.
- The export includes looks/owned products and raw protected records losslessly.
- Explicitly confirmed preview reset covers the new library while preserving legacy-key protections.

Unsaved working editors are retained across internal navigation during the same app visit, including exact choices, budget and conflict baseline. Reopening a product detail does not generate a replacement set or silently create a saved look. Explicit Save promotes a new editor to its saved identity; Start new creates a separate empty editor. The transient cache is bounded to 24 recent editor routes and does not survive a full refresh/tab closure. Save important looks before refreshing, closing or discarding the visit.

This is browser-local storage, not a transactional cloud service, cross-device sync or an absolute simultaneous-tab concurrency guarantee.

Catalog changes are additive development imports through the existing idempotent, content-addressed curation command. Existing relational evidence/source isolation is preserved. No database migration/replacement, owner Supabase change or production write was required.

## Remaining limitations and review gate

- Twenty-one selected brands still have no reviewed lines in this matching subset.
- Not every complexion, olive temperature, formula preference or low-cost foundation can form four supported selections.
- Price observations cover only four individual variants; most complete USD basket totals cannot be confirmed.
- No live stock, affiliate feeds, checkout or automatically maintained retailer comparison is claimed. Actual internal details and observed official product pages are linked; the retailer can default to another shade, so the exact variant must be confirmed there.
- No tested formulation-layering compatibility, calibrated saturation/depth equivalence or individual two-toned-lip outcome guarantee.
- Guest browser data does not sync between devices. Clearing browser data can remove local looks.
- No public community and no new member-account capability.

Stop for owner review after the preview and actual results. No push or deployment is authorized.
