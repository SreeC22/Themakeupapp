# Web MVP architecture and reuse plan

## Stage 1 boundary

Extend the existing website and shared Neu package. Keep its responsive homepage artwork, Learn content, route/base-path handling and accessible quiz controls. Do not replace it with a standalone sandbox, create a new app, change the public landing page or migrate the native app.

Stage 1 is a working browser preview. Historical product metadata comes from existing research, with source dates and explicit shade/availability limits. Do not add invented variants, prices, formula facts, images, users or reviews.

## Routes

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

## Later stages, not silently implemented now

Stage 2: normalized product/shade/offer/source entities, approved catalog curation and source-permission review, reconciliation with existing Supabase data and explicit migrations.

Stage 3: versioned deterministic category-specific ranking with confidence separate from fit and regression fixtures.

Stage 4: real authentication, review ownership, private saves, rate limits, reporting, moderation and two-account RLS verification. Use the owner's existing Supabase project. A server/edge layer may be justified for privileged moderation and rate limiting; credentials must never enter browser code. Static hosting can still serve the frontend with authorized APIs, so a wholesale hosting replacement is not required.

Stage 5: release hardening, real-device/accessibility/security checks and owner-approved hosting migration. No new tracking, camera/selfie processing, paid services or public deployment in this delivery.
