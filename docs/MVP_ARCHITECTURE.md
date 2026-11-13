# Web MVP architecture and reuse plan

## Stage 1 boundary

Extend the existing website and shared Neu package. Keep its responsive homepage artwork, Learn content, route/base-path handling and accessible quiz controls. Do not replace it with a standalone sandbox, create a new app, change the public landing page or migrate the native app.

Stage 1 is a working browser preview. Historical product metadata comes from existing research, with source dates and explicit shade/availability limits. Do not add invented variants, prices, formula facts, images, users or reviews.

## Stage 1 routes (implemented baseline)

- `/`: approved homepage, four launch categories, quiz and guest browsing.
- `/quiz`: compact depth-first consultation, unknown/skip paths and optional refinements.
- `/results`: editable local profile summary and four-category research browsing with evidence explanations, comparison and filters that handle missing metadata honestly.
- `/products/:slug`: precise recorded product name, source, known/unknown facts, local save and genuine empty community state.
- `/community`: genuine empty member evidence with working exploration/filter controls and an explicitly local draft path.
- `/review/new`: structured local-only draft and clearly labeled moderation demonstration, never a live submission.
- `/saved`: locally saved product identifiers, not cloud saves.
- `/profile`: edit/restart, local privacy preferences, export and confirmed local deletion.
- `/admin`: unavailable/protected-state explanation. No public moderation privileges.
- Preserve `/learn`, `/discover`, `/share` compatibility and `/design-guide`.

## State and evidence

Versioned local browser storage holds only the anonymous quiz, selected local saves and explicitly local review drafts. Public sharing is off by default. Surface blocked/corrupt storage explicitly. Never silently turn unknown values into medium/neutral or an exact shade match. Do not delete legacy storage keys.

Retain the current stable forty-swatch identifiers and approximate-color disclaimer. Add optional saturation, olive subtype, lip pigmentation, concealer intent and formula preferences without extra mandatory technical-question screens. The newer specification makes olive a first-class choice; legacy olive-cast information remains separate and compatible.

The Stage 1 product projection contains only source-backed names, categories and URLs from existing research. Record its source observation date. Unknown prices/finish/coverage/shades stay null. Sorting is browsing, not a disguised match algorithm. No calibrated scores, stock assertions or paid placements.

## Current roadmap: collection-first product direction

The revised Stage 3 scope supersedes the earlier fixed-bundle journey. Your Neu Edit is a reusable personal collection; six adaptive routines use that same collection with optional steps and labeled-use restrictions. See `STAGE_3_WARDROBE.md` / `STAGE_3_WARDROBE_QA.md`. PostgreSQL manufacturer evidence remains separate from curated research observations; public community remains gated. Earlier look-first scope below is historical and retained for provenance.

### Historical look-first scope

The owner accepted Stage 2 based on its implementation report and authorized **Stage 3: Your Neu Look**. Neu's primary product is now explicitly a personalized makeup look builder: Beauty Profile → Choose a Look → Budget → Personalized Set → Customize → Save or Shop. Foundation matching is supporting infrastructure, not the main product destination.

See [Stage 3 requirements](STAGE_3_REQUIREMENTS.md) for scope and stage checkpoints. Preserve Stage 1/2; no public community, remote push or production deployment. The older roadmap below is historical where it differs.

## Revised roadmap after Stage 1 approval

The owner accepted the Stage 1 report and authorized Stage 2, including explainable recommendations previously listed under Stage 3. The subsequent onboarding brief also belongs in Stage 2. See [Stage 2 requirements](STAGE_2_REQUIREMENTS.md). The uploaded original specification remains unchanged as historical source material; these newer instructions take precedence where they differ.

### Stage 2: verified catalog, shorter onboarding and explainable discovery

- Add normalized brand, product line, shade/color variant, source and matching-evidence entities without replacing existing data or the owner's Supabase project.
- Work toward 25 selected US-market beauty brands, 100–150 product lines and approximately 2,000–4,000 variants across Foundation, Concealer, Blush and Lips. These are progressive targets, not Stage 2 exit requirements.
- Each selected line should eventually include its complete current US range. Track enumerated variants, source-declared range size, missing variants, observation date and completeness status separately. A partial verified subset must not be labeled a complete range.
- Prioritize a representative verified subset across drugstore, mid-range and luxury. Separate verified facts, estimates and user experiences; report evidence gaps independently of coverage.
- Begin with equally prominent "I already know my shade" and "Help me find my shade" paths. Both produce the same editable complexion profile. Preserve typed brand search, the manual forty-swatch palette, unknowns and backtracking.
- Keep shared onboarding limited to essential complexion inputs, oily/dry/combination skin type and optional undertone confirmation. Move category preferences into discovery, persist them and avoid repeated questions.
- Immediately show all four categories with explainable, versioned, category-specific recommendations. Handle olive temperatures, saturation, reference fit/oxidation corrections and two-toned lips without invented shade equivalences, percentages or confidence scores.
- Preserve references when catalog entries or evidence are missing. Insufficient evidence means limited suggestions or no precise cross-brand match, never fabricated certainty.
- Preserve existing Stage 1 design, local data, learning, saves, comparison, export/deletion and compatibility paths. No account gate before discovery.
- Test both onboarding paths, selections and missing entries, persistence/editing, reference corrections, explanations, incorrect undertones, mobile layouts and existing regressions.

Stop after showing a working Stage 2 preview, actual test results, verified coverage and outstanding gaps. Do not push or deploy without approval.

### Following phases: only after another owner review

Further catalog expansion, calibration and discovery refinement can follow Stage 2 approval. Do not start a separate ranking phase automatically; its initial explainable logic is now included in Stage 2.

Public community features are outside the MVP. Introduce them only after 500+ registered users **and** explicit approval of that phase. Preserve existing private local drafts/data without representing them as public reviews. Real authentication and private account functionality remain separately scoped; no synthetic registration counts or fake users.

When approved, community work must include ownership, private saves, rate limits, reporting, moderation and two-account RLS verification against the owner's existing Supabase project. A server/edge layer may be justified for privileged moderation and rate limiting; credentials must never enter browser code.

Release hardening and any hosting change require their own review. No tracking, camera/selfie processing, paid services or public deployment is silently authorized.
