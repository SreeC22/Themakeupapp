# NEU: REPLIT AGENT IMPLEMENTATION SKILL

Version: 1.0 | Scope: Web MVP | Owner-approved product brief: November 2026

## 0. Agent role and operating agreement

You are the principal product engineer, data architect, UX engineer, and quality lead for **Neu**, a personalized makeup discovery website. Your job is to extend the **existing repository**, not to create a disconnected demo or replace completed work.

Source repository: https://github.com/SreeC22/Themakeupapp
Existing live entry point (as documented in repository): https://sreec22.github.io/Themakeupapp/
Research inputs:
- Pantone SkinTone Guide: https://www.pantone.com/skintone and https://www.pantone.com/na/en-us/products/graphics/skintone-guide
- r/OliveMUA: https://www.reddit.com/r/OliveMUA/

**Working protocol:**
1. Inspect the repository thoroughly before editing. Start with README.md, CLAUDE.md, HANDOVER.md, APP_PLAN.md, WEB_MVP_SETUP.md, WEB_MVP_SCHEMA.sql, SCHEMA.sql, index.html, community.html, community.js, app/, and design-system assets. Check for more recent commits or documentation and reconcile conflicts instead of assuming old notes are current.
2. Create a **new Git branch** for the web MVP, not direct edits to `main`. Don't modify production integrations, forms, credentials, or app parity logic without tests and owner approval.
3. This brief supersedes earlier product direction where they conflict: launch now includes product-level shade recommendations and four makeup categories, not just a tone-twin feed. Earlier rules on design quality, honesty, security, and no invented user data remain.
4. Build in small independently demonstrable stages. At the end of **each** stage provide changed files, commands run, screenshots or browser verification, passing/failing tests, known limitations, and an owner-review checkpoint. Do not claim a stage is complete without running relevant tests.
5. Do not deploy publicly, change the public landing site, enable paid services, collect new sensitive information, or publish community content without explicit owner approval. You may implement these in a preview/development environment.
6. If integration credentials or supplier permissions are missing, build robust, well-labeled local/demo paths and explain the blocker. Never fabricate functionality or replace a blocked requirement with an invented API.
7. Preserve the Neu brand's minimal design. Read actual design-system tokens. Avoid decorative noise, fake social proof, or claims of clinical/scientific certainty.
8. Prefer a coherent, maintainable application to excessive scaffolding or a premature AI/ML service. Use deterministic, auditable ranking rules for the MVP.
9. At any point where a requirement is technically or legally infeasible, present the smallest workable alternative and record the reason in `docs/DECISIONS.md`.

## 1. Mission, positioning, and boundaries

### User-facing promise
"Discover foundation, concealer, blush, and lip products suited to your complexion, undertone, skin type, and preferences, with experiences shared by people like you."

### Launch categories: **only four**
- Foundation
- Concealer
- Blush
- Lips (lipstick, lip tint, lip gloss, lip stain, lip liner when cataloged)

No skincare marketplace, bronzer, highlighter, eye makeup, fragrance, sunscreen recommendations, dermatology, or medical diagnosis in launch scope. Do not introduce these as functioning categories to pad the experience.

### Who this serves
US-based beauty shoppers across the full range of complexion depths, with deliberate support for users who struggle to find **olive**, **muted**, or **deep-skin** shade matches, and users with **two-toned or pigmented lips**. All skin tones are first-class, not special cases.

### What success means
- User completes a no-camera quiz in ~2–3 minutes, optionally faster with defaults and skip paths.
- User receives real, browseable products and exact variant/shade identifiers **only when verified**, with an explanation of the match and caveats.
- User filters by category, budget, finish, coverage, retailer, skin type, and evidence confidence.
- User can share an authentic, unpaid experience tied to a precise product + shade and their self-described profile, while preserving privacy.
- There are no fake reviews, made-up SKU matches, invented shade imagery, fabricated inventory, or unsupported fit scores.

## 2. Scope and staged roadmap

### Stage 0 — repo assessment, migration design, and baseline safety (no user-facing change)
Deliver:
- `docs/EXISTING_SYSTEM_AUDIT.md`: actual live website, quiz, design-system, community, data-schema, app state, integration dependencies, and tests.
- `docs/MVP_ARCHITECTURE.md`: proposed architecture and reuse strategy for web-first development. Respect the existing static-site architecture when practical. If a server is necessary for authenticated reviews/moderation, justify it and plan migration without breaking GitHub Pages.
- `docs/DECISIONS.md`: conflicts with prior architecture and explicit decisions.
- Baseline screenshot captures (desktop + mobile) and current test results.
- Protect existing FormSubmit waitlist and existing mobile parity tests. Don't expose email addresses or keys in logs.
Acceptance: existing site behaves identically; no production edits or secret leaks.

### Stage 1 — user-facing web IA and interactive prototype (mock data clearly labeled)
Design and implement **preview-only** responsive flow:
1. Landing: honest value proposition, four makeup categories, quiz CTA, explanation of community evidence.
2. Quiz: complexion depth, undertone, saturation (optional/unknown supported), skin type, product needs, budget, and lip pigmentation.
3. Profile results: editable summary with confidence/uncertainty and privacy choice.
4. Recommendations page with four category tabs, sorting/filtering, comparison and explanations.
5. Product detail: brand/product, precise verified shade, formula facts, retailer purchase links, community experiences, source/provenance.
6. Community review submission, moderation states, and browsing from similar profiles.
7. Saved products/profile settings (locally in preview until connected backend is ready).
No dead CTA. If live data/auth is not active, show truthful demo or disabled states with explanation.
Acceptance: clickable end-to-end desktop/mobile flow; keyboard navigation and WCAG-oriented semantics; mobile overflow zero; visual review from owner.

### Stage 2 — data model + first **verified** cross-price catalog
Implement normalized catalog schema, provenance, admin import workflow, and seed first 25 brands as **candidate brand records**. Then add actual products/shades only when evidence verified from brand/retailer pages or authorized feeds. Never infer a shade's hex, undertone, stock, or formula from its name alone.

**Proposed 25-brand editorial shortlist, subject to live inventory checks and owner approval:**
- Budget/drugstore (9): e.l.f. Cosmetics; Maybelline; L'Oréal Paris; NYX Professional Makeup; Milani; ColourPop; wet n wild; Revlon; CoverGirl.
- Midrange/accessible prestige (8): Rare Beauty; Fenty Beauty; NARS; MAC Cosmetics; Tarte; Huda Beauty; Too Faced; Juvia's Place.
- Premium/luxury (8): Estée Lauder; Lancôme; Dior; Armani Beauty; Charlotte Tilbury; Haus Labs; Pat McGrath Labs; Danessa Myricks Beauty.

Note: These are candidate **brands**, not assertions that every brand has all four categories, is currently stocked by a particular store, or offers an olive-specific product. Adjust final selection on actual category coverage, shades spanning all depths, inclusive olive options, price distribution, and US consumer availability. Don't fabricate availability at Sephora, Ulta, Target, Walmart, CVS, Walgreens, or a brand website. Record sources and verification dates.

Product/variant import priorities:
A. Foundations and concealers with verifiable shade labels and brand undertone descriptions.
B. Blushes with documented finish/texture/pigment level.
C. Lips, especially coverage/opacity and naturally pigmented or two-toned-lip experiences.

Acceptance: queryable schema; admin-readable provenance; duplicates handled; product with unverified shade cannot be displayed as a confirmed shade match; seed data is explicitly demonstration data unless verified.

### Stage 3 — deterministic recommendation engine v1
Implement ranking as documented in section 6. Distinguish category-specific matching. Require explainability, uncertainty, and guardrails. Write regression fixtures for many complexion depths, undertones, saturation levels, skin types, two-toned lips, and price brackets.
Acceptance: every recommendation can show "why it appears" and evidence quality; missing data reduces certainty rather than being silently invented; alternative and no-exact-match states work.

### Stage 4 — authentic community loop
Connect profiles, real user reviews, saves, filtering, reporting, admin moderation, and basic trust signals. Do not invent reviews, verified purchase badges, or user populations. Enforce one-review-per-user-per-product-shade policy or a clearly documented alternative that allows updates. Let users self-report whether they purchased/received a product, but do **not** label as verified purchase absent actual verification.
Acceptance: end-to-end two-account tests; user cannot edit another user's reviews or private saves; report/appeal and admin moderation exist; no rewards, paid rankings, sponsored placements, or review incentives.

### Stage 5 — hardening, real-device QA, beta readiness
Run all checks in section 11. Improve performance/accessibility/mobile layout, reduce friction, add useful empty states, write rollback instructions and privacy/moderation copy. Prepare a deployment checklist only; owner approves actual release.
Acceptance: no critical accessibility/security defects or false claims, tests pass, documented known limitations and approved release plan.

### Future phase, NOT launch: camera/selfie color analysis
Architect a separate, opt-in module for selfie-based assistance. No camera permission, photo upload, face inference, or third-party image processing in the launch MVP. Future feature must include camera lighting/calibration cautions, manual overrides, photo deletion/retention controls, consent, bias evaluation across depths, and explicit statement that phone images are not reliable color measurements. Keep current manual quiz fully functional forever.

## 3. Pantone and color-scale constraints

Pantone states that its updated SkinTone Guide contains **138** physical reference tones. This is a conceptual inspiration and potential licensed reference system, **not** permission to reproduce its full swatch library, identifiers, exact RGB approximations, branded assets, or official mappings in an app. Before integrating official swatches, check Pantone's license, permitted usage, attribution, and whether actual digital color values are licensed for this product. Ask owner to provide proper permission/asset access if needed. Never scrape the Pantone webpage to copy color values or images. Do not claim "Pantone certified" or "Pantone matched" without authorization and validated methodology.

**Safe implementation path for launch:** retain the project's existing Monk-inspired/custom tone input temporarily, subject to its own attribution/usage check; or construct a properly licensed/original inclusive visual depth selector. Treat on-screen colors as approximate only, due to screen calibration and lighting. Profile should use a stable internal depth coordinate and separate undertone/saturation values, with source metadata; avoid silently replacing old Monk scale identifiers with Pantone IDs. Build a future `color_reference_system` abstraction and migration that can support licensed Pantone references later.

If a Pantone license is obtained later, support mapping between versioned tone systems through explicit curated correspondence, not arbitrary one-to-one conversion. A screen-selected swatch is not an objective spectrophotometer measurement.

## 4. Quiz specification

**First screen:** "Find your complexion" with an illustrated, diverse depth selector, labels, and editable choices. Must work without photos, accounts, or purchase history.

**Mandatory or minimally necessary inputs:**
- Approximate complexion depth (full fair-to-deep spectrum, granular enough for useful filtering).
- Undertone selection: warm, cool, neutral, olive, or **not sure**. Never force a user into one.
- What to shop for: one or more of foundation/concealer/blush/lips.

**Optional inputs and guided help:**
- Olive refinement: warm-olive, cool-olive, neutral-olive, or not sure; allow olive as a first-class primary undertone. Do not infer it from veins alone.
- Saturation: muted, balanced, bright/saturated, unknown; use layperson explanations and examples. Not a required technical color judgment.
- Surface redness: optional self-reported attribute only; do not conflate it with undertone or diagnose rosacea.
- Skin type: oily, dry, combination, unsure. Allow normal as "unsure/other" if desired; do not force incorrect label.
- Formula preferences: coverage (sheer/medium/full), finish (dewy/natural/matte), fragrance preference, sensitivity preference, application style. These are preference filters, not medical or ingredient-safety guarantees.
- Budget: user-set maximum or flexible budget. Let users optionally browse across all price tiers.
- Prior foundation or concealer that works / is too warm / too pink / too orange / too deep. Make an optional feedback input with exact product and shade if cataloged. This is stronger evidence than simple undertone quiz guessing.
- Concealer intent: spot-concealing, brightening under-eyes, and/or color-correcting. These require different shade advice; don't automatically suggest "two shades lighter" for everyone.
- Two-toned lips: **yes/no/unsure**, plus optional upper lip darker, lower lip darker, darker lip outline, or overall lip pigmentation. NEVER ask the user to identify their lip pigmentation as a disorder. Ask whether they want opaque even coverage or a sheer/natural result.
- Color preferences: blush/lip colors (e.g., rose, berry, peach, nude, coral, red, brown); optional.

**UX:** optional fields are skippable. Show why each is asked, provide "I don't know," allow changes after results, and avoid deterministic diagnosis from jewelry or vein tests. Keep data locally for anonymous users; make account creation optional for quiz and browse.

## 5. Recommendation semantics and domain logic

**Never equate skin tone, undertone, skin type, and lip pigmentation.** These are separate dimensions with different relevance to each category.

- **Foundation:** nearest verified shade depth + undertone + saturation where known, followed by formula suitability for skin type, coverage/finish preferences, price, user outcome evidence. Shade matching and formulation are two different component scores. Surface redness must not be interpreted automatically as cool undertone.
- **Concealer:** shade and formula based on intended use, plus base complexion and exact product shade. Spot matches versus brightening versus color-correction should be visibly separate. Avoid universal shade-difference rules.
- **Blush:** aesthetic color family + pigmentation/sheer-buildable behavior on similar depth/undertone, formula appropriateness for skin type/preference, real user outcomes. There is no objective "exact match" to the complexion for a blush.
- **Lips:** complexion/undertone + natural lip pigmentation + opacity/finish + color family + user-reported appearance (e.g., pulls purple, washes out, looks gray). For two-toned lips, explain that sheer products may appear different on upper and lower lips. Recommend opaque or liner-compatible options only when appropriate to user's goal; do not claim certain products cover pigmentation unless there is product evidence.
- **Olive:** refine by temperature and saturation. Never treat olive as an automatic synonym for warm. Provide "too orange / too pink / too yellow / too gray" feedback loops. Use real shade reports in matching while avoiding unverified global shade labels.
- **Skin type:** oily/dry/combination guides finish, wear and formula preference based on supported product information and reviews, not clinical promises. A reviewer with similar skin type supplies experiential evidence, not proof of universal suitability.

## 6. Matching and ranking algorithm, auditable v1

Use a rules-based system, not arbitrary embeddings or an LLM hallucinating shade equivalences. Represent optional/unknown fields explicitly and calculate **component scores plus a separate evidence confidence**. Keep scoring config versioned and testable; do not show an uncalibrated "97% exact match".

Candidate retrieval:
1. Hard-filter category; restrict to current verified, sellable US products where available, and respect explicit budget ceiling when set. If live availability is unknown, show "availability not verified" and avoid declaring in-stock.
2. For base products, require a verified product/shade name and normalized source; if not found, surface candidates as exploratory, not precise matches.
3. Compute category-appropriate fit components. Missing dimensions contribute **unknown** rather than a fabricated neutral score.
4. Return ranked results with structured explanations, evidence source and last verified date, and an alternative option when exact match is uncertain.
5. Support user feedback: too warm/cool, too light/dark, oxidizes, too drying/oily, color looks different on upper lip. These are self-reported observations; feed them into personalized ranking after explicit consent, not into unsupported universal truth.

Suggested weights (initial hypotheses only; tune with user testing):
- Foundation: shade similarity 55, formula/skin type 20, personal preferences 10, community outcomes from similar profiles 15.
- Concealer: shade/intent fit 50, skin-type/formula 20, preferences 10, community outcomes 20.
- Blush: aesthetic color fit 35, formula/finish 20, budget/preferences 15, community outcomes 30.
- Lips: lip pigmentation/desired opacity 30, aesthetic color fit 25, finish/preferences 15, community outcomes 30.
Use weights **only** for relevant known data; model uncertainty separately, and don't claim these numbers are empirically validated.

Results UI should show human-readable labels such as:
- "Shade candidate: depth aligns; olive undertone is not documented"
- "Supported by 3 reviews from people with similar undertones" (only if 3 genuinely exist)
- "Budget-friendly option; formula may be too matte for your preferences"
- "Two-toned lips: opaque coverage is documented; actual appearance can vary"
- "Not enough evidence to identify an exact shade yet"

Never assert a cosmetic product *prevents or treats* rosacea/acne or is universally safe for sensitive skin. No diagnoses.

## 7. Data architecture and entities

Use the repository's existing Supabase setup when connected and appropriate. If unavailable, isolate persistence behind a repository interface with mock data strictly marked `demo`. Propose migrations rather than clobbering existing tables or user records.

Suggested entities / key fields:
- `brands`: id, normalized_name, website_url, editorial_tier, candidate_status, created_at.
- `products`: id, brand_id, product_name, category, subcategory, formula_type, coverage, finish, advertised_skin_type, ingredients_url, product_page_url, status, verification_state, last_checked_at.
- `product_shades`: id, product_id, exact_shade_name, manufacturer_shade_code, description_raw, standardized_depth_range, undertone_claim, saturation_claim, pigment_opacity, swatch_asset_permission, verification_state, source_id.
- `retailer_offers`: id, product_id, shade_id nullable, retailer, product_url, displayed_price, currency, stock_state enum(verified_in_stock/verified_out_of_stock/unknown), checked_at, source_id. Prices and inventory are optional and timestamped, not implied current.
- `sources`: id, source_kind(official_brand/authorized_retailer/user_report/editorial/other), url, title, captured_at, attribution_notes, terms_permission_status, verification_actor.
- `tone_profiles`: user_id nullable or local id, scale_type, depth_value, undertone, olive_subtype, saturation, skin_type, optional_redness, lip_pigmentation_pattern, desired_lip_coverage, preferences, quiz_version, updated_at, privacy_setting.
- `recommendation_runs`: id, user_id nullable, engine_version, input_snapshot_minimized, output_ids, timestamp; privacy-preserving / optional logging.
- `reviews`: id, author_id, product_id, shade_id nullable, rating or verdict, structured wear notes, exact shade, self-reported_skin_profile_snapshot (only consented attributes), purchase_context_self_reported, provided_free_or_paid_flag, incentive_disclosure, created_at, updated_at, moderation_status.
- `review_flags`: review_id, reporter_id, reason, status, created_at; restricted to reporter/moderators.
- `saves`: user_id, product_id, shade_id nullable, created_at.
- `shade_feedback`: user_id or anonymous local token, product_shade_id, depth_fit, undertone_fit, wear_feedback, lip_appearance_notes, created_at, privacy consent.
- `admin_audit`: event, actor_id, affected_id, timestamp, moderation reason.

Enforce foreign keys, unique product-variant IDs, controlled enum vocabularies, schema migrations, indices for filters, least-privilege roles, Supabase RLS, and server-only secrets. Do not expose auth user emails, private saves, admin reports, or internal audit trails to public readers. RLS must be tested with two distinct accounts.

## 8. Authentic, non-incentivized community evidence

Product philosophy: **no paid reviews, rewards for positive reviews, sponsored product rankings, or disguised promotional posts**. Members give genuine reports about what they tried. Organic, voluntary reviews only. If compensated/free products are disclosed, they must be visibly labeled or excluded from the unpaid-only view; do not silently assert they are unbiased. Note that Neu cannot independently verify a user's claim of no incentive unless a verification mechanism exists.

Review UI should capture:
- Product + exact shade, if relevant.
- "Would you repurchase?" yes/no/unsure, optional brief written experience.
- For foundation/concealer: shade result (exact, too warm, too cool, too orange, too pink, too light, too dark, gray, oxidized), coverage and wear.
- For blush: visible on my complexion, ashy, too pigmented, buildable, easy to blend, formula feel.
- For lips: opacity on upper/lower lip, actual visible color compared with advertised color, longevity, whether lip liner was used.
- Self-described tone/undertone/skin type (optional privacy controls), wear context, disclosure of brand/free-product relationships.

Allow text-only reviews; do **not** require face photos. Any future photos need permissions, removal tools and moderation review. Show filters by similar tone, undertone, skin type, and two-toned-lip experience. With zero real reviews, show an honest empty state, not seeded fictional users.

Abuse controls: sign-in for posting, sane rate limits, input validation, XSS sanitization, spam protections, report/hide/moderation queue, edit/delete, community guidelines, and no private DMs in v1. Keep aggregate review metrics accurate and never conflate editorial picks with community ratings.

## 9. Data acquisition, verification, and retail links

Goal: approximately 25 popular US brands, spanning affordable to high-end, with accurate **specific products/shades**. This is an editorial curation effort, not a license to scrape whole retailers.

Allowed paths, subject to actual terms/permissions:
- Official brand and retailer public pages for manual verification, using links and brief factual metadata consistent with applicable terms.
- Authorized supplier/affiliate feeds or APIs when permissions and credentials exist.
- Admin-reviewed contributor submissions for missing products/shades.

Not allowed:
- Inventing product IDs, shades, prices, inventory, shade hex values, wear claims, photographs, review text or quoted recommendations.
- Unauthorized bulk scraping, circumvention of robot restrictions, rate limits, anti-bot mechanisms, or licensing controls.
- Reusing branded product photos/swatches without necessary rights; use safe placeholders and external links until licensed.
- Presenting stale or missing price/availability as up-to-date.
- Copying Reddit comments/photos into public Neu reviews without users' permission. Reddit discussions may inspire requirements and taxonomy, not become fake first-party evidence.

Minimum verified product fields for a shoppable listing: official brand, product name, category, source URL, last-verified timestamp. For a **shade-specific match**, also require the exact variant name/ID and independent evidence for any asserted undertone or depth compatibility. If the listing lacks those, mark it "shade details unverified" and exclude from exact-shade recommendations.

Retailers: offer external links to Sephora, Ulta, Target, Walmart, CVS, Walgreens, and brand-direct sites **only for verified matching product URLs**. There is no checkout or price-comparison requirement in v1. Clearly label external navigation and whether links are affiliate links, if ever used. Avoid claiming retailers carry all 25 brands.

Build admin curation/import screens for: product link, retailer, brand, source claims, shade list, source quality, change history, last-check date, and verification status. Never auto-promote unverified community shade reports to official product facts.

## 10. Web design specification

Use Neu's existing minimal brand/design assets as the design source of truth. If conflicts arise, consult current repo design system. In older repo docs the style is clean Glossier/Rhode-inspired, white/neutral surfaces, restrained CTAs, clear typography, thin dividers; avoid unlicensed fonts, artificial testimonials, garish gradients, generic 'AI beauty' language, and oversized cards.

Mobile-first layout (360px viewport baseline) and desktop layout. Accessible contrast and touch targets. Give color descriptors in text as well as swatches. Screen-reading users must be able to complete quiz and inspect product evidence. All filters and quiz steps must be keyboard-usable. Avoid making color the only carrier of meaning.

Core pages:
- `/` value proposition + start quiz + browse categories.
- `/quiz` short, resumable, skippable optional questions.
- `/results` category tabs + match explanations + evidence labels + budget controls.
- `/products/:slug` product details, exact available shade variants, editorial source, user reviews, retailer links.
- `/community` filter genuine member experiences by profile similarity.
- `/review/new` logged-in structured contribution flow.
- `/saved` saved items, optional authentication.
- `/profile` edit quiz choices, privacy/export/delete account where supported.
- `/admin` protected editorial validation + moderation, never exposed to regular users.

For each product card: brand, precise product name, category, shade only when known, price if timestamp-verified, formula info, match explanation, evidence-strength label, save action and external buy/brand link. For blush/lips, avoid a fake "foundation shade match" chip; show "recommended color family" instead.

Empty states: "We don't have a verified shade in your range yet", "No unpaid community reviews for this product", "You can help improve recommendations by sharing what you tried". No fabricated scarcity, counts, social activity or reviews.

## 11. Tests, QA, and release gates

Test suites must include:
1. **Repo baseline:** current JS and Expo quiz parity scripts (e.g. `cd app && npm run parity` if still applicable), type checks/build, existing static site smoke tests. Changes to web quiz that affect app parity require explicit compatibility plan; do not silently break older mobile code.
2. **Quiz:** all undertones and unknown; olive as cool/warm/neutral leaning; muted vs bright; every complexion range; skin types; anonymous path; edit profile; contradictory inputs; optional skips; lip pigmentation path; no-camera mode.
3. **Ranking:** verified shade vs unverified; mismatched depth; warm-olive versus cool-olive; muted foundation; powder/matte products for different skin types with careful caveats; price cutoff; zero inventory data; no exact match; concealer use-cases; two-toned lip opacity; blush color reasoning.
4. **Data:** duplicate brand/products, product+shade exact ID, source provenance, missing source, outdated retailer offers, verification downgrade, restricted images; all claims derived from stored evidence.
5. **Community:** two users with distinct access; private saves; review posting/edit/delete; user reports; moderator actions; no review count inflation; spam/XSS protection; no incentive disclosure hidden.
6. **UI:** 360px/390px/768px/desktop; no horizontal scroll; layout consistency; keyboard focus, forms and field errors, screen-reader labels, contrast, reduced motion and low bandwidth.
7. **Security:** service secrets only server-side, RLS tests, auth boundaries, admin access, no third-party tracking without consent, avoid storing photos and unnecessary health-related data.
8. **Quality:** no false availability, fake quotes, 'exact match' certainty, unlicensed Pantone assets, misattributed product imagery, accidental public preview data.

Provide at least 12 named user-journey fixtures including: fair cool dry; fair warm oily; light cool muted olive; light warm olive combination; medium neutral; medium muted olive; tan warm olive oily; tan cool olive dry; deep neutral; deep cool dry; deep warm combination; two-toned pigmented lips with preference for opaque lipstick. Include important intersectional tests without inferring skin color or product preferences from ethnicity.

For each stage provide `npm` commands, automated test outputs, before/after screenshot references, failures, and an updated issue list. Implement meaningful unit tests plus browser E2E tests using tools available in Replit (e.g. Playwright when supported). If browser automation is unavailable, say so and provide a reproducible manual QA plan.

**Non-negotiable failure:** a review written by the agent appears as a real user's review, an unverified shade is displayed as exact, the app claims to have copied Pantone's 138 proprietary swatches without license, a public link is invented, or an authenticated user reads another user's private information.

## 12. Analytics and privacy

Measure product usefulness without surveillance:
- Quiz completion and skipped-answer rates (anonymous and consent-aware).
- Profile manual override rate, olive-path friction, no-exact-match incidence.
- Recommendation click-through by category, save rate, product detail views, external retailer click-outs.
- Review contributions per actual participant, number of verified shade reports, moderation queues.
- User-submitted post-purchase fit feedback such as too orange/too light, with explicit provenance and consent.

Do not collect ethnicity, race, or diagnoses as input proxies. Do not demand birthdate or gender. Treat skin-tone profiles and optional self-reported redness as potentially sensitive to users; minimize, secure, provide edit/delete pathways, and avoid public exposure of a private user's skin profile. No photo storage in MVP. Before public beta draft a plain-English privacy policy, community guidelines, account deletion flow, and data-retention plan, for owner/legal review.

## 13. Agent output artifacts

Create or update these documents in the new branch:
- `docs/EXISTING_SYSTEM_AUDIT.md`
- `docs/MVP_ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/PRODUCT_TAXONOMY.md`
- `docs/MATCHING_ENGINE.md` with math/pseudocode, assumptions and examples
- `docs/CATALOG_SOURCING.md` with verified sources, permission checks and 25-brand coverage matrix
- `docs/PRIVACY_AND_COMMUNITY.md`
- `docs/QA_TEST_PLAN.md` with real pass/fail outcomes
- `docs/RELEASE_CHECKLIST.md`

Add relevant database migrations, schemas, typed API contracts, UI components, tests, fixtures, and curated entries with provenance. Every feature should have a crisp scope and acceptance test; avoid broad unfinished checklists labeled "done".

## 14. Immediate start command for Replit Agent

**First action, before coding:** clone/import `https://github.com/SreeC22/Themakeupapp`, verify the actual current repository and documented app state, create a feature branch, and execute **Stage 0**. Show me the architecture/reuse plan and baseline findings. Then implement **Stage 1** as a local/Replit preview and present it for visual approval. Do not jump to all 25 brands or build a selfie system before the prototype is approved. Continue to Stages 2–5 only after each prior stage is demonstrated and its blockers are recorded. Do not alter the public production site or spend money without my explicit permission.

---

## Research notes for agent (not permission to copy)
- Pantone describes a 138-tone physical guide: https://www.pantone.com/skintone
- Pantone explains digital color-library access via licensed tools: https://support.pantone.com/en/are-printable-files-of-pantone-guides-available
- Olive community discussion of color depth, temperature and saturation: https://www.reddit.com/r/OliveMUA/comments/1vjzphk/base_product_identification_thread_revised/
- Muted olive foundation challenges: https://www.reddit.com/r/OliveMUA/comments/1deg5h9/medium_to_deep_skinned_muted_olives_what_are_your/
- Two-toned lips user experience: https://www.reddit.com/r/MakeupAddiction/comments/1s3i4nu/two_toned_lips/
- Ulta affordable makeup category (current products require re-verification): https://www.ulta.com/discover/makeup/best-affordable-makeup

Use these only as **research and user-needs references**. Do not scrape Reddit testimonials, borrow copyrighted photos, or make unsupported product claims.
