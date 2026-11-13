# Stage 3 — Personalized Makeup Wardrobe & Adaptive Looks

## Current scope and review gate

This roadmap supersedes the earlier four-slot look-first iteration without removing it or its saved data.

**Philosophy:** Maximalism with caution.  
**Promise:** More looks. Fewer unnecessary products.  
**Primary journey:** Onboarding → Complexion Profile → Your Neu Edit → Explore Looks → Customize → Save or Shop.

Stages 1 and 2 remain supporting infrastructure. Neither an exact foundation match nor a newly generated shopping list per occasion is the core product.

### Increment A — reusable collection and routines

- `/edit` is the primary post-onboarding screen.
- Explicit creation uses the actual profile-bound API response without an occasion color palette.
- A focused collection of optional core products, owned products and user-chosen extras is stored separately from routines.
- Six templates: Five-Minute Face, Everyday, Work & College, Soft Glam, Party Glam, Special Occasion.
- Simple/elaborate versions use the same collection. Steps can be skipped, added, removed, reassigned and annotated.
- Moisturizer/SPF are preparation instructions only. No skincare shopping category was added.
- Draft navigation state survives internal navigation in this visit; explicit saves persist in this browser. Save before refreshing/closing.
- Old `/looks` and `/looks/saved` remain available for compatibility.

### Increment B — evidence and richer makeup roles

- Additive catalog categories: Eyes, Multi-use, Setting.
- Normalized dated evidence supports application areas, routine roles, lip subcategories, versatility, combination guidance and benefits.
- Manufacturer labeling—not creator usage—authorizes eye/lip cross-application.
- Lipstick, liner, gloss, oil and tint/stain roles are represented. Initial verified additions supply liner/gloss; oil/tint coverage remains a data gap.
- Unsupported opacity, two-toned-lip outcomes, unknown formula suitability and incomplete routines are not converted into exact matches or guaranteed results.
- Research observations have a separate PostgreSQL table and read-only `/api/neu/research`; they do not enter shade matching as manufacturer facts.
- Initial research is candidate-only. No independent favorite, popularity or endorsement is established.

## Verified catalog coverage

26 selected US-market brands; 5 have reviewed lines. There are **16 lines, 399 verified shade/palette identities and 1 unresolved identity**. Fifteen selector ranges are reconciled; one remains partial. All prior records and source history are preserved.

Seven added lines:

| Official product | Observed variant identities |
| --- | ---: |
| Makeup by Mario SurrealSkin Natural Finish Foundation | 32 |
| Makeup by Mario SurrealSkin Awakening Concealer | 26 |
| Makeup by Mario Ultra Suede Sculpting Lip Pencil | 22 |
| Makeup by Mario SuperShine Lip Gloss | 11 |
| Makeup by Mario Soft Pop Plumping Blush Veil | 10 |
| Makeup by Mario Ethereal Eyes Palette: Nature | 1 purchasable palette, not 12 separately sold pans |
| e.l.f. Monochromatic Multi-Stick | 7 |

US product pages and their public product JSON selectors were inspected on the recorded observation date. Foundation letter codes were **not** decoded into undertone/depth claims. Mario's Mid-range budget tier is editorial segmentation, not a quoted price.

Only the four previously verified individual variant prices are present. The additions intentionally contain no inferred price/currency or stock claims. Numeric basket fit generally remains unverified.

The progressive catalog target remains roughly 100–150 lines and 2,000–4,000 shade/color variants, now across 26 selected brands. Complete current US ranges remain the eventual goal, not a requirement to invent unsupported records.

### Sources

- https://www.makeupbymario.com/products/surrealskin-natural-finish-foundation
- https://www.makeupbymario.com/products/surrealskin-awakening-concealer
- https://www.makeupbymario.com/products/ultra-suede-sculpting-lip-pencil-1
- https://www.makeupbymario.com/products/supershine-lip-gloss
- https://www.makeupbymario.com/products/soft-pop-plumping-blush-veil
- https://www.makeupbymario.com/products/ethereal-eyes-eyeshadow-palette-nature
- https://www.elfcosmetics.com/products/monochromatic-multi-stick

## Initial research coverage

Six dated observations across four public URLs: two current official guidance pages, plus two historical UK editorial articles covering four product/shade observations. Empty fields mean unknown, not a favorable result.

- https://britishbeautyblogger.com/makeup/elf-monochromatic-multi-stick
- https://midlifeandbeyond.co.uk/midlife-makeup-finds-for-summer-and-beyond

These reports are paraphrased; no creator media or full reviews were copied. The UK reports do not establish current US formula equivalence. One reported misspelling is retained rather than silently mapped to a catalog SKU. Sponsorship/ownership/affiliate disclosures are recorded as stated, without inferring purchase or independence. Source-specific negatives are retained.

Reddit/Instagram experiences, independently corroborated favorites and profile-specific outcome evidence are not established by this initial research. There are no public review submission routes.

## Remaining work before public beta

- Broader complexion, olive-temperature and lip-opacity evidence; actual use validation rather than descriptor alignment alone.
- Reliable current US price observations and sufficiently priced complete collections.
- Verified oil/tint/stain and setting coverage, richer formula and wear evidence.
- Current, independently corroborated research with explicit disclosures and source/formula reconciliation.
- Owner-approved account/authentication/synchronization and production security/privacy work.
- Public community only after **500+ registered users AND owner approval**; neither condition alone enables it.

No production systems were changed. The history-preserving GitHub review and Replit-history branches were pushed with owner approval; GitHub `main` and deployment remain unchanged. Stage 3 stops for owner review after preview and actual test reporting.
