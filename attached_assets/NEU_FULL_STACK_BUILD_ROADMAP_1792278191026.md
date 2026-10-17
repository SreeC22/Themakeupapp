# NEU | Full-stack website product and implementation roadmap

**Status:** Proposed implementation specification for owner approval. **Do not claim that proposed features are already connected.**  
**Source of truth:** The owner's attached Neu planning prompt, `SreeC22/Themakeupapp` README, APP_PLAN.md and HANDOVER.md.  
**Product:** Browser-first beauty product discovery and community, not a store, AI selfie analyzer or native app.  
**Owner decisions supplied now:** Approved minimal makeup-texture homepage direction; discover by skin depth and undertone; infer possible shade from currently worn makeup; clear undertone teaching; category preferences; recommendations and broader community library; account-gated saving; mandatory two-factor authentication for new accounts; US drugstore and prestige coverage; global ambitions; 13+ with legal gates; user photos private by default.  
**Important:** A globally launched 13+ service and a large current brand database are NOT assumed feasible without legal/content sourcing reviews and licensed or appropriately sourced catalog records.

## A. The exact product promise

**Neu helps you find makeup that works on skin like yours, informed by your existing product shades and experiences shared by people with similar skin depth and undertone.**

- Not a shade guarantee. Never claim a mathematically exact shade based only on another brand's shade name. Results are *likely matches* and *candidates to swatch*.
- Not a review farm: genuine community posts and curated examples must be visually distinct. Do not invent reviewers, ratings, product statistics or local popularity.
- Makeup should support individual style. Matching is contextual, not a rigid identity or diagnosis.
- Discoverability must not require an account. Saving, posting and a wider community library can require an account after the user understands the value.
- Photos can be omitted from reviews. Uploaded photos are **private until the user explicitly publishes a selected image**, with special rules for minors.

## B. Approved visual system: do not redesign

Preserve the existing approved Neu homepage, not previous rejected mockups. Cream `#FBF7F2`, blush paper `#F3ECEB`, deep plum `#514659`, ink `#322B34`, restrained mauve `#786B88`, berry `#B85F78` as small accent. Headings Cormorant Garamond; content DM Sans; utility labels Space Mono sparingly. Accessible contrast required. Light, generous whitespace, restrained thin separators. Makeup texture image blended into hero with no image frame and no overlaid product or profile cards. No human face in homepage hero. No emojis, em dashes, cartoon illustrations or bright peach/yellow collages. Keep reading text comfortably sized. Responsive mobile/tablet/desktop.

Suggested consistent hero text: **Find makeup that works on skin like yours.** Supporting: "Discover products and shade experiences from people with a similar skin tone and undertone." CTA: **Find my skin match**; secondary: **Browse products**. Inform users browsing is available without an account. Keep image license/ownership recorded.

Do not treat concept art or sample posts as endorsements or genuine live members.

## C. User journeys

### C1. Guest arriving for the first time
1. Land on homepage. Within five seconds understand: personalized makeup discovery through skin-context-based product experiences.
2. Choose **Find my skin match**, **Browse products**, or **Learn undertones**.
3. Onboarding/quiz explains that existing foundation/concealer shade may improve the *starting estimate*. It is optional.
4. Enter an existing brand, exact product, variant and shade, if known; pick personal depth visually; answer beginner-friendly undertone guidance, or select unsure.
5. Choose desired product categories (foundation, concealer, blush, bronzer, lipstick, lip liner, eye makeup, SPF, primer, powder, setting products, etc.) and optional concerns/preferences.
6. See editable **Your shade profile** with an estimate, confidence language, inputs used, and invitation to correct it. No false precision.
7. See **Starter picks for your profile**: a small clearly labeled curated set and, when available, separate real community recommendations with provenance and sample sizes.
8. Browse more products, compare experiences, and use Learn; saving opens a sign-up prompt and afterward returns to the exact product and intended save action.

### C2. Returning member
Sign in, complete actual second factor, see saved products, profile and followed categories, explore latest recommendations from similar members, edit profile, share a text-first review, optionally publish a photo, delete account.

### C3. Community contributor
Search existing brand/product/shade to avoid duplicates; contribute first-person experience, skin-context fields disclosed with clear visibility preview, whether repurchased/holy grail or not, optional photo upload (private staging), independently choose publish photo, submit, edit/delete and report. No pressure to reveal face, real name or location.

### C4. Moderator/owner
Sign in with strong MFA and least-privilege permissions; review reports and rights requests, act on content with an audit trail, maintain product data corrections, reconcile duplicates, address copyright and urgent abuse reports, honor deletion requests.

## D. Route map and page specifications

| Route | Main UI and behavior | Account | Definition of done |
|---|---|---|---|
| `/` | Approved hero, brief "How it works," 1 primary CTA, public Learn + Discover access; only truthful content | No | Value understood in five seconds, mobile responsive |
| `/quiz` | Accessible multi-step workflow described below, resumeable local guest draft | No | Completes with known or unknown product and undertone |
| `/quiz/results` | Editable profile, explanation, candidate picks grouped by category, evidence/confidence, Explore CTA | No | Never presents guesses as verified exact matches |
| `/learn` | Depth, undertone, olive cast, vein limitations, swatching advice, lighting, product oxidation, color theory | No | Plain-language guides and accessible visual examples |
| `/discover` | Brand/product search, category, budget/drugstore, depth, undertone, skin type, product availability, similarity sorting, clear filters | Limited guest browsing | Results sourced and filters work; no-match state helpful |
| `/products/[slug]` | Actual brand and product name, variants/shades, category, verified catalog facts vs reviews, report problem | Basic guest page | Provenance and shade identity visible |
| `/products/[slug]/shades/[id]` | Exact shade and formulation, community notes, adjacent shade comparisons, caveats | Some gated notes | No confusion between different versions or reformulations |
| `/reviews/[id]` | Single community note, authorship pseudonym, opted-in contextual profile fields, disclosure, report | Public if published | Private fields never leak |
| `/saved` | Personal saved product/shade/note folders, remove/revisit, empty/error states | Yes + MFA | Isolated per user and across devices |
| `/share` | Text-first product note flow; draft, preview, publish, edit, delete; photo publishing separate | Yes + MFA | No accidental photo visibility |
| `/account/sign-up` | Age/jurisdiction eligibility, identity creation, verification, mandatory real second factor | No | Writes blocked until required MFA |
| `/account/sign-in` | First-factor login, TOTP challenge, recovery | No | AAL2 enforcement verified |
| `/account/settings` | Account, privacy, edit profile, MFA factors, consent, data export/deletion | Yes + MFA | Works end-to-end |
| `/profile` | Guest-local or signed-in private profile, clear fields and visibility controls | No or yes | No unauthorized reading |
| `/report` or report modal | Confidential reports; routes to genuine moderator workflow | Optional | Reporter and moderator states functional |
| `/privacy`, `/terms`, `/community-guidelines`, `/copyright`, `/accessibility` | Attorney-approved documents and reporting contacts | No | Reflect actual data practices and launch markets |
| `/admin` | Restricted moderation/catalog stewardship | Admin MFA | Role isolation and audit logs |
| 404/offline/error | Retry with preserved inputs where possible | Any | Never silently lose work |

### Desktop and mobile navigation
Desktop: Neu mark, Discover, Learn, Find my tone, Saved, Share, sign in/account. Use minimal links and progressive disclosure, not ten equally prominent actions. Mobile: simple header, menu/drawer, sticky quiz next/back footer where appropriate. Do not display inaccessible actions as though live.

## E. Quiz: required experience and logic

### Quiz global UI
One question per screen, visually minimal. Header Neu logo, back, `Step X of Y`, short progress line, optional 'Skip' only for optional questions. Primary CTA bottom/right, contextual help expandable, no distracting decorations. Save anonymous progress only in current browser with expiry; explicit consent before carrying it into account. Keyboard, screen-reader, large tap targets and clear selections.

**Do not replace the existing functional shade/undertone quiz without comparison and parity tests.** Extend it in a way that preserves current completed flows.

### Step 0. Welcome and explanation
Headline: **Let's find your makeup match.** Body: "We use the shades you already wear, your skin depth and your undertone to suggest products and show experiences from people with similar skin. Results are a starting point, not a guarantee." No selfie required. **Start**, **Browse first**, **Learn how matching works**.

### Step 1. Do you already use a complexion product? (OPTIONAL)
"Do you currently wear a foundation, concealer, skin tint or tinted SPF that matches you reasonably well?" Yes / No / Not sure.
If yes, searchable typeahead fields: **Brand**, **Exact product/line**, **Shade name or number**, **How does it match?** (great match, slightly light, slightly dark, too pink, too yellow/orange, oxidizes, unsure). Option **Add another product**. Require product variant/formula and shade to be explicitly selected from a reliable catalog before lookup; permit "Can't find mine" free text saved as unverified evidence, not a canonical match. Brands in initial autocomplete should include multiple budgets and shade ranges, not prestige only.
Explanation: "Your existing match gives us a clue about depth and undertone, but labels vary between brands and formulas." Never simply equate a shade label with a human complexion profile.

### Step 2. Select approximate depth (REQUIRED FOR NON-PRODUCT PATH, EDITABLE OTHERWISE)
Display an inclusive non-linear shade/depth continuum with accessible textual labels and a fine-tuning slider if appropriate. Use the existing Monk-inspired color range with accurate attribution, not a false claim that all digital monitors show exact skin colors. Offer "I'm not sure", lighting instructions, and examples accessible without images. Avoid deriving race or ethnicity. If product evidence exists, offer a **starting suggestion** with a clear override. Store numeric depth separately from display labels.

### Step 3. Learn and choose undertone (OPTIONAL, NEVER DIAGNOSIS)
Question: **Do you know your undertone?** Choices warm, cool, neutral, unsure, with "I notice an olive cast" as an independently selectable attribute. **Olive can coexist with warm, cool or neutral**, not an exclusive replacement category. Explain warmth/coolness simply.
If unsure, optional guided observations:
- "In daylight, do the veins on the inside of your wrist look more blue/purple, green/teal, mixed, or hard to tell?" with visual illustration **without implying certainty**.
- "Does your skin tend to look more golden/peach, rosy/pink, mixed, slightly gray/green, or unclear alongside white?"
- "Do complexion products often turn too orange, too pink/ashy, or both?" optional.
- Jewelry and sun reaction examples are *weak supplementary clues*, not definitive tests. Different lighting, perception, skin depth and visible veins make them unreliable.
Present: "Your answers may lean [warm/cool/neutral], with [possible olive cast]. Does that sound right?" Choose **Yes**, **Change**, **I'm still exploring**. Underlying confidence: explicit self-ID > tentative clues; no diagnostic or exact percentage claim.

### Step 4. Skin type and formula preferences (OPTIONAL)
Dry, oily, combination, normal, sensitive, not sure; consider finish: natural, matte, dewy, no preference; coverage: sheer, medium, full; price: affordable/drugstore, midrange, prestige, any. Do not treat sensitivity as a medical diagnosis. Skin concerns optional and private.

### Step 5. What makeup should Neu help you find? (REQUIRED SELECTION)
Multi-select visually clear categories: Foundation and skin tint; Concealer; Blush; Bronzer and contour; Lipstick and gloss; Lip liner; Eyeshadow and liner; Mascara; Primer and setting; SPF; Powder; All products. Allow multiple and easy change. If none chosen, explain requirement. This directly drives result categories and later Discover filters.

### Step 6. Confirm your profile
Show: Selected/estimated depth range; undertone or still exploring; olive cast yes/no/unknown; observed currently worn products and match-quality note; selected categories, formula and price preferences. Each has Edit. Explain what is private and what can be disclosed when publishing a review. Optional browser-local guest storage, with delete option.

### Step 7. Results and invitation into product discovery
Headline: **Your starting shade profile is ready.** Then **Your potential holy grails**, grouped by selected categories. Each product card must show product brand, precise formulation and shade if supported, drugstore/prestige label, reason (e.g. "3 community members with similar depth/undertone reported this worked" only if actually true), type of evidence (community, curated editorial, catalog similarity), confidence and caveats. Holy Grail is a *member-authored repurchase/favorite label*, not a scientific Neu guarantee. For an empty community, show **Curated starting points** and "Be among the first to review" instead of fake social proof. CTAs: **Explore more for my tone**, **Save this** (sign-up gate), **Adjust my profile**, **Learn why**.

### Step 8. Account gate only when necessary
When user clicks Save, Publish, or broad library access: "Save your discoveries and keep your shade profile across devices." Preserve intended action and original destination through signup and MFA. Explicitly ask permission to import local quiz answers to cloud profile. Offer Not now for guest exploration.

### Quiz edge cases
No product found; a product shade has no mapping; conflicting two shades; very different seasonal shades; 'unsure' depth and undertone; different formulas with identical shade name; sunscreen white cast; user changes answers; browser refresh; expired draft; no community entries; session expiry in the middle; low bandwidth; invalid selected product. Never block results solely because user cannot identify veins.

## F. Matching and ranking engine

### Evidence hierarchy
1. **First-person user review with explicit current product/shade and profile**, strongest contextual evidence but not objective validation.
2. **Verified manufacturer or licensed product data** for names, shades, links and availability; these facts do NOT prove exact cross-brand shade equivalence.
3. **Editorially curated starter suggestions** marked as curated, independently sourced.
4. **Algorithmic similarity candidates** labeled estimated, with source coverage and known uncertainty.

### Candidate generation
Use skin depth distance and undertone agreement; optional olive cast and skin type compatibility; currently worn product shade evidence; budget, finish, category, availability filters. For complexion items, downrank incompatible shades and note low confidence; for color cosmetics, user preferences and community experiences may matter more than an exact depth label.

### Explainability
For each result show a short *real* reason, such as: "Similar undertone and depth to your profile," "People in a comparable profile repurchased this," or "Brand shade data suggests a nearby shade, please swatch." Use low/medium/high *evidence quality labels* defined internally, never unvalidated "98% compatible" percentages.

### Match safety
A suggested match must allow edits, comparison and feedback (worked, too warm, too cool, oxidized, not right). Capture feedback only with clearly disclosed use. Do not infer ethnicity/race or create biometrics.

### "Near me" and "most used around me"
**Needs owner decision and real data.** Distinguish (A) "popular among people with similar tone" from (B) geography-based popularity. For v1, default to A. For optional nearby discovery later: ask users for coarse metro/city *only with consent*, never collect precise GPS in v1; display aggregates only when minimum unique-member count and anti-reidentification thresholds are reached. Do not expose other members' locations or individual use. If unavailable, say "Not enough local reviews yet"; do not infer popularity from retail availability or fake counts. Popularity needs clear denominator/time range and bot/spam protections.

## G. Product catalog and brand coverage

### Data hierarchy
`brand` -> `product` -> `formula/version` -> `variant/shade` -> community `product_notes`, with immutable IDs, canonical names, aliases, manufacturer URL, regional availability, category, shade identifiers, discontinued flags, first/last verified dates, source/license and last update. Keep shade records separate from posts; deleting/discontinuing a product must not cascade-delete historical user reviews without a deliberate moderation/legal policy.

### Example initial US brands, **coverage targets not claims of loaded data**
Drugstore/accessible: e.l.f. Cosmetics, Maybelline, L'Oréal Paris, NYX Professional Makeup, Milani, Wet n Wild, Revlon, CoverGirl, ColourPop, Essence, Catrice, Black Radiance, Juvia's Place, Makeup Revolution, LA Girl, Physicians Formula, Neutrogena, Burt's Bees.
Prestige/other popular: Fenty Beauty, Rare Beauty, NARS, MAC Cosmetics, Estée Lauder, Clinique, Lancôme, Dior Beauty, Charlotte Tilbury, Huda Beauty, Haus Labs, Makeup by Mario, Tower 28, Kosas, Saie, Merit, Danessa Myricks, Pat McGrath Labs, Bobbi Brown, Too Faced, Tarte, Urban Decay, Smashbox, Sephora Collection, bareMinerals, Armani Beauty.
This is a *representative* initial coverage list, not exhaustive. Never promise "all US makeup brands" or every shade is present. Import breadth incrementally, track coverage gaps, allow "request missing brand/product" and moderator deduplication.

### Legal and technical catalog rules
Brand/product names for accurate identification generally differ from licensed product photography. Source images by permission/licensed feeds/own photos/user uploads with rights. Track licensing per asset, attribution and expiry; no scraping or unauthorized hotlinking that violates site terms. Do not invent shade-to-hex mappings: digital swatches approximate appearance and need human review. Official facts and user experience must be separated visually.

### Data ingestion approach
Phase 1 seed small balanced verified assortment across price tiers, inclusive shade ranges and multiple categories; Phase 2 provider/import pipeline with schema validation, image-rights record, deduplication and admin review; Phase 3 fill coverage according to requests and real usage. Add search aliases, exact shade matching, product reformulations, EAN/UPC where available, country availability and availability date.

## H. Architecture and data model

### Recommended web-first architecture
Keep or adapt the existing runnable React application under `artifacts/neu-website/` if confirmed available in the current workspace. Determine its actual framework and routing before changing anything. React + TypeScript + accessible component primitives + TanStack Query, Supabase Postgres/Auth/Storage, server-side endpoints or edge functions for privileged operations, migrations under version control, optional full-text search with trigram/FTS. Hosting provider and deploy domain **unresolved**. No secret or service-role key in frontend. Existing `index.html` legacy quiz and Expo app are reference implementations, not proof the shared website backend works.

### Proposed normalized tables
- `profiles`: `user_id`, pseudonym, age_band (minimum necessary), region eligibility, depth estimate, undertone nullable, olive_cast nullable, skin_type nullable, visibility preferences, timestamps.
- `guest_profile_imports` (optional short lived): consent/expiry; alternatively client-only guest state.
- `brands`: brand ID, canonical name, aliases, homepage, moderation status.
- `products`: product ID, brand ID, name, category, formula, region, source, last verified, status.
- `product_shades`: stable ID, product ID, shade name/code, optional manufacturer-supplied metadata, source; no fabricated RGB match.
- `owned_shade_evidence`: user ID, product shade ID or unverified free text, experience outcome, private by default.
- `quiz_sessions` (prefer ephemeral/local): optional answers, inference explanation and version; do not store unnecessary raw behavior.
- `category_preferences`: user ID, category, optional finish/budget.
- `product_notes`: id, author, product_id, shade_id optional, public body, verdict, repurchase flag, disclosure, selected public context snapshot, status, timestamps.
- `saves`: user ID, target type + target ID, created_at, unique per user target.
- `media_assets`: uploader, private storage key, rights affirmation, scan/moderation state, `visibility=private` default; separate explicit publication state + permitted derivatives.
- `reports`: reporter (or confidential contact), target, reason, status, assigned moderator, audit metadata; never public.
- `moderation_actions`: actor, action, target, reason, timestamp, retention.
- `consents`: user, consent kind, policy version, timestamp, revocation where applicable.
- `catalog_sources`: supplier/license, last verified, expiration and permissible uses.
- `aggregate_popularity`: category/product and coarse region with privacy threshold, limited period and true distinct counts (future only).
- `account_deletion_jobs`: request, processing status, purge coverage/retention exceptions.

### Permissions matrix (conceptual; implement and test in RLS)
| Entity | Anonymous | Authenticated member | Owner | Moderator |
|---|---|---|---|---|
| Brand/catalog approved entries | Read | Read | Manage | Correct with audit |
| Private profile | None | Owner only | No default general read | Restricted, case-specific |
| Community notes published | Read permitted public note fields | Read | Moderate | Moderate |
| Draft notes | None | Author only | Restricted legal need | Limited assigned case |
| Saves and owned products | None | Owner only | No default general read | No |
| Private images | None | Uploader only by signed URL | Exceptional audited access | Access for flagged item only |
| Published image derivative | Only if explicitly published | Read | Moderate | Moderate |
| Reports | None | Own report receipt/status only | Manage | Assigned queue |
| Moderation logs | None | None | Restricted read | Assigned actions |

All rights enforced on backend, storage and database, not only CSS/route guards. RLS must be enabled and tested on every member table. Use private buckets for originals, signed short-lived URLs, explicit thumbnail publication; strip geolocation EXIF; inspect file types and malware; separate staging vs published media. Protect exports/deletions, rate-limit and audit admin use. No overly broad public views or privileged RPC functions.

### Mandatory *actual* two-factor authentication
**Not the same as email verification or a single email OTP.** Proposed flow: verify email/password or passkey as first factor, enroll an authenticator-app TOTP factor at first account creation; verify TOTP and require assurance level 2 (`aal2`) for saving, posting, profile cloud persistence and sensitive account operations. On future sign-in complete second factor before protected activity. Supabase supports TOTP enrollment/challenge/verify and JWT assurance levels, but implementation and enforcement still need building and independent testing. Recovery codes/secure reset support **Needs owner decision**; do not leave users permanently locked out. Recovery must be rate-limited and abuse-resistant. No access to protected resource at AAL1 via direct API/RLS. Check invitation/email flows, session timeouts, account switching and removing factors. Sources: https://supabase.com/docs/guides/auth/auth-mfa and https://supabase.com/docs/guides/auth/auth-mfa/totp

## I. Age eligibility, privacy and legal launch gates

Owner says **global, age 13+**, but this cannot be achieved merely by a 13+ checkbox or a global terms page. Region-specific child privacy/parental-consent requirements can apply, including older minors. Do not launch worldwide by default. Build an allowlist of reviewed countries and an eligibility rules service mapping jurisdiction + age range + consent requirements. No birthdate publicly displayed; collect only what's truly needed. If region/age cannot be lawfully supported, block account creation with a clear non-stigmatizing explanation. Counsel must review actual country coverage, consent and age-assurance design before rollout. No behavioral advertising, no sale of profile data, no face recognition or precise location for launch. Privacy notices and deletion/export mechanisms must reflect the deployed behavior.

For social functionality involving minors: apply stricter privacy defaults; consider disabling photo publication, geolocation and direct messaging entirely for minors in initial launch. Photos are private by default for everyone. Explicit user photo publishing action, separate promotional reuse consent, identity/rights affirmation, report/block content features, DMCA notices, repeat-infringer handling, nonconsensual intimate imagery rapid action workflow, moderation capacity. Privacy policies should not promise absence of third parties when service providers exist. Legal reviewer must sign off on ToS, Privacy, Community/Photo Rules, DMCA, regional notices, affiliate disclosures and retention schedules.

## J. Required product/system states

Every flow must show: loading skeleton, no match, no catalog result, unsupported shade, new user, permissions denied, unsaved changes, API failure, offline/timeout with retry, expired auth callback, TOTP invalid/locked, private image blocked, content under review, save/publish pending and failed, region ineligible, lack of local popularity evidence. Never claim success until DB confirms. Keep draft locally when safe and disclose expiration.

## K. Accessibility and quality

WCAG 2.2 AA target. Proper labels, descriptions, error text, focus indicators, AA contrast, keyboard operable swatch selector that doesn't rely on color alone, screen-reader step announcements, >=44 CSS px touch targets where feasible, zoom at 200%, reflow at narrow screens, reduced motion, image alt text, skip links, accessible 2FA and voiceover support. Test desktop (1440/1024), tablet (768), mobile (375/320). Core Web Vitals budgets chosen by team. No layout shift from image; avoid giant uncompressed hero. SSR/SEO public product and education pages where practical. Privacy-aware instrumentation for page visits, quiz completion, no-result searches, category selection, save intention and opt-in returns; never log raw TOTP, precise age or unnecessary skin notes.

## L. Page-sized prioritized implementation roadmap

**Rule:** Work one milestone/PR at a time. An owner signs off on public design, data, vendors, costs and new policy scopes. Never claim connected behavior until an integration test verifies it. Preserve approved homepage. Don't rewrite stable components without reason.

### P0: Audit and baseline (must do first)
1. Locate actual React website (`artifacts/neu-website/`) and any legacy landing/Expo directories. Inventory routes, components, build commands, environment and tests; compare attached prompt to code. Document any missing workspace.
2. Inspect existing owner-managed Supabase project using permitted non-admin access only, reconcile migrations with schema. **Do not assume project tables exist.** Ask owner to execute admin-only steps manually. Never request keys in chat output.
3. Run baseline build, lint, typecheck, navigation and mobile screenshot smoke. Preserve screenshots; no deployment.
4. Produce `IMPLEMENTATION_STATUS.md` with `Implemented frontend / Not connected / Proposed / Needs owner decision` for every major feature.
**Done when:** current build is understood and untouched visual baseline is reproducible.

### P1: Shared design components and nav
Make reusable header/footer, typography/color tokens, status components, product card, filter bar, progress indicator, accessible inputs. Keep approved hero unaltered beyond accessibility/copy alignment. Responsive and readable.
**Done when:** screenshot parity reviewed; no extra image overlay/card, no horizontal scroll, link destinations valid.

### P2: Quiz extension and local guest profile
Extend existing functional quiz with prior-product lookup stub, explicit uncertainty handling, depth/undertone with olive separate, category selections, preferences, accessible result summary. Use a small real sourced test catalog and clearly label demo mappings. Persist locally with expiry, allow edit/reset. Don't claim results are live recommendations.
**Done when:** new/old paths work with known shade, unknown shade, olive/neutral, unsure and phone width.

### P3: Catalog schema, verified seed and search
Migrate brands/products/formulas/shades, ingestion provenance, alias search, categories and price tiers. Seed balanced verified products including **drugstore** and prestige and a wide range of complexions. Disclose catalog coverage. Missing-product request flow.
**Done when:** branded search returns correct variant/shade, no duplicate IDs, human QA for at least each seed, catalog sources recorded.

### P4: Matching engine and honest result explanations
Combine entered existing shades, selected depth/undertone, preferences and community evidence. Simple deterministic, auditable first version with tests. No AI/selfie inference. Annotate "estimated" and evidence type. No match state should suggest expanding category/filters rather than fabricate output.
**Done when:** tests cover conflict, no mapping, lighter/darker adjustments and traceable explanation.

### P5: Auth plus mandatory MFA
Supabase email signup/login, verified identity, TOTP enrollment at creation, subsequent challenge, secure recovery design, AAL2-enforced protected writes/reads, explicit guest profile import approval, post-auth return to saved target. Age/region eligibility gate first.
**Done when:** two users and one anonymous user cannot read/write each other's content, and AAL1 cannot bypass protected operations even via direct API.

### P6: Personal profile and saves
Private cloud profile, user preference edits, list/remove saves, cross-device sync, deletion/export, local sign-out cleanup. Profile cannot be viewed by other users unless specific fields are opted into a published note.
**Done when:** refresh, different browser, account switch, no RLS leak and deletion cases pass.

### P7: Text-first community reviews
Post/search/detail, product/shade validation, pseudonymous identity, optional visible context, actual experience/repurchase, edit/delete/report, duplicate product suggestion. Initially no photo publishing until moderation and legal sign-off.
**Done when:** genuine notes visible, drafts private, reports reach owner queue, deleted posts behave appropriately.

### P8: Private photo upload and explicit publish (later gate)
Add image upload only after privacy/legal/moderation review: owner-only originals, EXIF stripping, malware/type checks, no face requirement, separate selected-image publication confirmation, removal across derivatives and caches, stricter minor controls. No promotional reuse by default.
**Done when:** a private image is inaccessible by any other user and published content can be promptly unpublished/deleted.

### P9: Discovery polish and community feedback
Product detail and notes, filters for category/skin similarity/price range, honest count labels, candidate vs actual review, "why" explanations, recommended alternatives, collection requests, responsive and accessible refinements.
**Done when:** first-time visitor can discover a non-sponsored useful candidate in under a few minutes and report low quality.

### P10: Optional coarse-location popularity (NOT launch blocker)
Decide what "around me" means. Optional coarse region only; demonstrate sufficient real users and k-anonymity/threshold before releasing counts. No default GPS/nearby individual identities. Until eligible, UI says not enough local data and offers tone-similar reviews globally.
**Done when:** privacy review and true aggregate counts verified; otherwise keep off.

### P11: Launch quality, compliance and operation
Attorney approves age/jurisdiction policies, upload/safety flow and actual provider list. Confirm moderation staffing, DMCA agent procedures if applicable, incident-response plan, privacy export/delete, backups, production domains/email callbacks, logging, rate limits and accessibility. Two-user, anonymous, child/region gate, MFA bypass and destructive action end-to-end tests. Deployment requires owner permission and a rollback plan.
**Done when:** documented release checklist fully passes and owner explicitly authorizes production publication.

## M. User stories and test suite

- As a guest, I can finish the quiz without knowing my undertone, and still receive clearly uncertain starting suggestions.
- As a guest, I can search "Maybelline" and a precise complexion shade and get correct product/version suggestions or an honest not-found state.
- As a guest, I can enter one foundation that fits well and another that oxidizes; I see an editable estimate, not a fake exact match.
- As a user selecting blush and SPF, I get those categories in results, not an irrelevant foundation-only list.
- As a user with deeper skin and olive cast, I have meaningful supported input choices and no hard-coded exclusion.
- As a budget user, drugstore results are not buried beneath only prestige brands.
- As a prospective saver, my quiz and target item survive sign-up, email verification and MFA (with explicit import consent).
- As a new member, enrollment in TOTP is required; first-factor-only attempts at protected API paths fail.
- As a member, my saved products persist across browsers, but no second account can access them.
- As a reviewer, I can publish without a face/photo and can remove a post.
- As a photo uploader, no one can access the original before explicit publication, including by guessing a URL.
- As a community browser, I never see fictional testimonials portrayed as verified user reviews.
- As a person asking for "most used near me", the system never invents regional statistics.
- As a moderator, I can act on a report and see an audit trail; a normal member cannot.
- As a minor user, jurisdiction and visibility policies are enforced as legally reviewed; unsupported regions cannot bypass age gate by changing URL.

## N. Acceptance metrics and launch evidence

Track real, privacy-respecting metrics: homepage CTA clicks; guest quiz starts/completes; percent unable to find current product; percent uncertain about undertone; results-to-product-detail; organic product searches; save intent and completed save; coverage by depth and price tier; no-match frequency; real review volume; moderation resolution time. Do not fake conversion claims or user counts. Require test results, source licenses, screenshot approvals and security review before launch.

## O. Owner decisions outstanding (never silently decide)

1. **Global rollout**: start with reviewed countries or hold worldwide registration until local legal rules are implemented. **Recommended:** country allowlist in phases.
2. **Minimum age 13**: exact parental-consent and under-18 feature restrictions per region. **Recommended:** age/region gate with stricter minors defaults; counsel approval.
3. **Current product database**: licensed/provider source, manual curation budget, initial target SKUs/shades. **Recommended:** verified balanced starter catalog + requests, not claim universal coverage.
4. **Matching confidence**: acceptable terms and editorial review. **Recommended:** "possible match" with explicit rationale, not precise scores.
5. **First-factor account method**: password+email verification or passkey; mandatory TOTP as second factor. **Recommended:** accessible password/password-manager flow with TOTP; recovery reviewed separately.
6. **Account recovery**: recovery codes, identity verification and failure support. **Recommended:** secure recovery codes stored safely, abuse controls.
7. **Public reviews**: users' optional skin context fields and display pseudonyms. **Recommended:** minimal opted-in context.
8. **Photos**: when (if ever) activate community publication for minors. **Recommended:** defer photo publication for minors at launch.
9. **Geographic popularity**: actual meaning of "around me", threshold and consent. **Recommended:** later optional metro aggregation, not first release.
10. **Operational identity**: unincorporated operator, domain, policy contact, support and moderation address. **Recommended:** counsel review before launch.
11. **Hosting and Supabase**: real domains, plan constraints, project/migration authority. **Recommended:** reconcile before implementation.
12. **Product buying links**: official brand/retailer external links vs affiliate links. **Recommended:** non-affiliate links initially with source disclosure; no checkout.

## P. Build-agent execution instructions (paste with this file)

You are implementing Neu, a browser-first full-stack makeup discovery website. Treat this document as a proposed roadmap and the attached Neu design as approved. Read the repo and existing docs before coding. **First response:** audit the actual workspace and existing Supabase integration, compare routes/components to the spec, create a numbered implementation plan with work estimates, blocked owner decisions and a dependency graph. Do not start the whole build in one uncontrolled pass. Preserve the approved hero visuals and exact design tokens. Implement **P0** first and report files examined, commands run, results, and next owner approvals. Work in small testable PRs; after each milestone, show before/after screenshots, tests, outstanding gaps and whether it is local, committed, pushed, or deployed. Never call placeholder data "live", never invent user posts, no unlicensed brand imagery, no admin secrets in browser, no unilateral deployment, purchasing or public policy changes. Do not use em dashes or emojis in UI copy.

### Completion tracker
| Milestone | Current verified state | Remaining | Dependency | Done means |
|---|---|---|---|---|
| Approved homepage | Attached planning prompt says implemented frontend | Confirm repo, preserve and test | P0 | Screenshot parity, clear copy, responsive |
| Learn | Attached prompt says frontend exists | Content quality and accessible tests | P0/P1 | Public page, accurate caveats |
| Quiz | Legacy README/HANDOVER describes existing quiz; current React status requires audit | Add owned-product, uncertainty, preferences, results | P0/P2/P3 | Guest-to-results tested |
| Catalog/Discover | Attached prompt says illustrative frontend | Real source-backed catalog/filtering | P3 | Accurate names/shades and search |
| Matching | No verified shared logic in current React | Versioned deterministic matcher and evidence | P3/P4 | Explainable, no fake precision |
| Auth/MFA | Attached prompt says not connected | First factor, TOTP, gating, recovery | P5 | Backend-enforced AAL2 |
| Profile/Saved | Guest browser storage only per prompt | Private server persistence | P5/P6 | Cross-device & isolation tests |
| Share/Reviews | Not connected per prompt | Validated real community records | P5/P7 | Edit/delete/report verified |
| Images | Not verified | Private storage + explicit publication | P7/P8 and legal | No cross-user leak |
| Popular near me | Not implemented/verified | Coarse-area privacy aggregates | Real density/P10 | True thresholded counts |
| Safety/Legal | Attorney package draft only | Approval + live operational workflows | P11 | Written sign-off, real reporting |

**Final production readiness status: NOT VERIFIED.**
