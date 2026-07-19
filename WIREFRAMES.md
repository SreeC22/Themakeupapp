# Neu wireframes (v1)

Low-fi screen spec for `app/`. Source of truth for M1 build; `head-of-mobile-engineering` codes from this, `head-of-product-design` owns changes. Visual mockups live in the published wireframes artifact; this file is the contract.

## Global

- Tokens (port from index.html :root): bg #FFFFFF, ink #111111, gray #6E6E6E, line #E6E2DD, panel #F7F5F2, accent #C2452D (CTAs only), Monk t1 to t10.
- Type: Instrument Sans (expo-google-fonts). Sizes: title 22, section 17, body 15, caption 12, label 11 uppercase tracked.
- Buttons: pill radius. Primary = accent bg, white text. Secondary = ink bg. Tertiary = text-only gray.
- Cards: white bg, 1px line border, radius 8. No shadows.
- Twin = depth within 1, same undertone. Match % = same undertone +50, depth distance 0 +50, 1 +35, 2 +15 (cap 100). Match chip: small pill on post cards, "98%" plus "Twin" prefix when twin.
- Seeded content is always labeled "Curated starter pick". Never present seeds as users. (House rule 4.)
- M1 is fully offline: bundled seed JSON (products + starter picks per tone cell) + AsyncStorage (profile, own posts, saves). No network, no auth until M2.
- Navigation: onboarding stack, then tab bar: Feed, Explore, Post, You. Post is an action tab (opens composer modal).

## 1. (onboarding)/welcome

Purpose: value prop, route into quiz.
Layout, top to bottom:
- Wordmark "neu" (dot in t7 like the site).
- H1: "Makeup recs from people with your skin tone."
- Sub (gray): "A 30-second quiz. Your tone profile. Recs from people who match you."
- Tone row: 10 Monk dots.
- Primary CTA: "Take the quiz".
- Tertiary: "I already have a profile" (visible only if AsyncStorage has one; skips to tabs).
States: none. No sign-in at M1 (auth is M2; do not show a disabled button).

## 2. (onboarding)/quiz, step 1: shade

Same logic and values as the site quiz. Parity is a release gate.
Layout:
- Progress bar: 4 thin segments (a 5th appears only if neutral-confirm triggers).
- Title: "Pick your shade." Help (gray): "Look at your inner forearm in daylight, not your hand. Close is good enough."
- Preview row: 56 swatch circle + depth name ("Tan 5") + "tap a shade, slide to fine-tune".
- Swatch grid: 40 interpolated shades, 8 columns x 5 rows, radius 6.
- Slider: Monk gradient track, STOPS identical to site JS/CSS (0,7,14,22,32,47,62,78,90,100). Ends labeled "Fairest" / "Deepest".
- MST attribution line (caption, links to skintone.google/the-scale).
- Secondary CTA: "This is me".

## 3. Quiz, steps 2 to 4: signals

One question per screen, auto-advance on tap (220ms), Back text button below.
- Step 2 veins: "Flip your wrist over. What color are your veins?" Options with color chips: Green-ish (warm) / Blue or purple (cool) / Green, and my skin has a gray-green cast (olive) / A mix, or can't tell (neutral).
- Step 3 sun: "In strong sun, your skin usually..." Tans easily (warm) / Burns or goes pink first (cool) / Burns, then tans (neutral).
- Step 4 jewelry: "Which jewelry looks better against your skin?" Gold (warm) / Silver (cool) / Both look fine (neutral).
Derivation (identical to site): olive vein answer short-circuits to olive; else majority warm vs cool; tie = neutral.

## 4. Quiz, neutral-confirm (conditional)

Trigger: derived undertone is neutral AND vein answer was not olive. (Olive hides in neutral; this is the rescue. Grill 2026-07-19.)
Layout:
- Progress bar gains a 5th segment.
- Title: "One more check." Question: "Does your skin ever look slightly gray or green in photos or against white?"
- Options: "Yes, often" (olive) / "No" (neutral) / "Not sure" (neutral, result screen scrolls override into view).
Parity: the site gets this same step in its own owner-approved change before app launch.

## 5. (onboarding)/profile-ready

Purpose: profile reveal plus the M1 single-player moment: starter picks immediately.
Layout:
- Tone card: 64 swatch, name "Tan 5 · Olive", basis line ("Olive undertone, based on a gray-green cast, you burn then tan, both metals work" or "set by you").
- Override row: "Doesn't sound right?" + Warm / Cool / Neutral / Olive chips. Override re-renders card and picks, stamps self-set.
- Section label: "Starter picks for Tan 5 · Olive".
- 3 to 5 pick cards: category label (uppercase caption), brand + product + shade, one-line why (e.g. "no orange cast"), "Curated starter pick" caption.
- Primary CTA: "Enter neu". Tertiary: "Retake the quiz".
States: picks come from the bundled JSON for that tone cell; every cell must resolve to at least 3 picks (nearest-cell fallback allowed, labeled with the source cell).

## 6. (tabs)/feed

Purpose: posts from your twins, default view.
Layout:
- Header: small tone chip (swatch + "Tan 5 · Olive"), tap opens You tab.
- Post cards, newest first: author head (26 swatch + tone label + match % chip), product line (category caption + brand/name/shade), body note, rating (5 dots, ink-filled), actions right-aligned: like count, save toggle.
- M1 sources: starter picks (labeled) + own posts. M2 adds real twins.
Empty state (recruiting, pulled forward from M3): tone swatch, "No Tan 5 · Olive posts yet. You'd be the first." Primary CTA "Post your picks". Starter picks list below so the screen is never valueless.
States: empty (above). No loading state at M1 (local data).

## 7. (tabs)/explore

Purpose: browse outside your twin cell.
Layout:
- Search field: brand or product.
- Category chips: All / Base / Blush / Lip / Eye / SPF / Other.
- Scope toggle: "My tone" / "All tones" (segmented, ink).
- Result list: same post card as feed (match chip shows even outside your cell).
States: no results ("Nothing yet for this filter." plus scope-widening hint).

## 8. (tabs)/post (composer, modal)

Purpose: create a rec.
Layout:
- Title "Post a rec". Close X (top left).
- Product field: search bundled products; no match shows "Add new" row (brand + name + shade inputs).
- Category select (chips, same set as explore).
- Shade label input (free text, e.g. "NC42").
- Note input (2 lines, placeholder "What worked, what didn't").
- Rating: 5 tappable dots.
- Primary CTA: "Post". Disabled until product + rating set.
M1: saves locally, appears in Feed and You immediately. M2 syncs to Supabase.

## 9. (tabs)/you

Purpose: profile, own content, the return hook.
Layout:
- Tone card (compact): swatch, name, "self-set" tag when overridden, "Edit tone" tertiary button (re-runs quiz, existing answers prefilled).
- Segmented: My posts / Saved.
- List: post cards (own posts editable via long-press: delete).
States: My posts empty ("Nothing posted yet."), Saved empty ("Saves live here.").

## 10. post/[id]

Purpose: post detail.
Layout:
- Author head (larger): swatch, tone label, match chip.
- Product block: category, brand, name, shade.
- Full note, rating.
- Actions: like, save.
- Section: "More from your twins" (up to 3 cards, same-cell posts).
No comments in v1 (v1.1 per APP_PLAN). Do not show a comments placeholder.

## Definition of done for M1 build

1. Runs in Expo Go, zero TypeScript errors.
2. Quiz parity with the site for identical inputs, including olive short-circuit, neutral-confirm, override stamping " (self-set)".
3. Tone-profile string byte-identical to the site format: "Depth Name (#hex) · Undertone" plus " (self-set)".
4. Every tone cell reaches at least 3 starter picks.
5. All tokens from the shared tokens file; no new colors, no shadows, no em dashes in copy.
