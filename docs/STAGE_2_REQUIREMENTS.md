# Stage 2 acceptance requirements

These owner instructions extend the existing Neu roadmap after approval of Stage 1. They also incorporate the subsequent uploaded onboarding brief. They supersede conflicting stage/order language in the original specification, without rewriting that source document.

## Progressive catalog

- 25 selected US-market beauty brands across drugstore, mid-range and luxury.
- Eventual target: 100–150 product lines and approximately 2,000–4,000 individual shades/color variants.
- Only Foundation, Concealer, Blush and Lips.
- Each selected line should eventually cover its complete current US range where reliably verified.
- Stage 2 can ship a representative verified subset. Full target completion must not block early testing.
- Report verified brands, lines, unique variants, category/tier coverage and range completeness separately from targets.
- Mark partial ranges, source-declared totals, unresolved variants, stale observations and verification gaps explicitly. Listing counts are not proof of current stock.

## Database and evidence

Build normalized brand, product, shade and matching-evidence storage. Reuse existing project infrastructure and preserve existing records and the owner's Supabase project.

Keep verified manufacturer/retailer facts separate from estimates and user-reported experiences. Each accepted fact needs its source, observation date, market and evidence basis. Do not turn shade codes, photographs, product names or user testimony into unsupported calibrated color measurements.

No invented products, shade equivalences, prices, availability, percentages or confidence scores. Unknowns remain unknown.

## Two short onboarding paths

Start with **"Let's find your match. How would you like to start?"**

Equally prominent choices:

1. **"I already know my shade"**: typed/searchable brand, exact foundation or concealer product, exact catalog shade, then fit: Perfect match, too light, too dark, too orange/yellow, too pink, or too gray. Oxidation feedback is optional. Preserve missing/self-reported references distinctly from verified catalog selections, explain evidence limits and support adding multiple references later.
2. **"Help me find my shade"**: preserve the manual palette and stable identifiers; guide depth and undertone including olive, allow unsure and corrections, and do not copy proprietary Pantone assets.

Both paths write the same editable Neu complexion profile. Shared questions are essential complexion information, oily/dry/combination skin type and optional undertone confirmation. Reference feedback must not silently rewrite manufacturer data or fabricate cross-brand equivalents.

## Discovery

Immediately offer Foundation, Concealer, Blush and Lips without mandatory sign-in. Explain recommendations using applicable depth, undertone, saturation, skin type, references and saved category preferences.

Move these preferences out of the shared questionnaire:

- Foundation: coverage and finish.
- Concealer: brightening versus spot concealing.
- Blush: formula and finish.
- Lips: two-toned pigmentation, coverage and finish.

Save preferences rather than repeatedly asking. Support different olive temperatures and two-toned lips explicitly. Show evidence-backed candidates separately from suggestions with limited evidence. No exact cross-brand match when the supporting shade data is insufficient.

Users can edit their profile and reference shades at any time. Preserve Stage 1 local data, learning, saves, comparison, export/deletion, compatibility paths and shared design system. Use minimal mobile-first screens, clear progress and reliable backtracking.

## Community boundary

Public community features are not part of the MVP. They require **500+ registered users and explicit approval of that phase**. Preserve existing private local draft data without implying public sharing. Do not invent users, counts, reviews or moderation actions.

## Required verification and review gate

Run automated tests for matching, especially incorrect undertone recommendations, and the existing relevant regressions. Verify both onboarding paths, exact product/shade selection, missing entries, persistence/editing, reference fit corrections, evidence explanations and mobile responsiveness. Fix observed failures and report actual results, not intended coverage.

At the Stage 2 checkpoint provide:

- A working preview in the existing website.
- What was implemented versus what still needs verified data.
- Verified coverage and data gaps separately, including partial ranges.
- Actual test commands/results and important limitations.

Stop for owner review. Do not push, deploy, rebuild the project or advance to another stage without approval.
