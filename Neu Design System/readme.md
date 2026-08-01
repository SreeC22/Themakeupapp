# Neu — Design System

> Makeup advice that finally has *your* face in mind. Neu removes the default.

Neu is an iOS app. A 30-second quiz (no camera, no photos) places you on the **Monk Skin Tone Scale** and works out your undertone — **including olive**, which most tools pretend doesn't exist. From then on the whole app is filtered through people who share your tone: your **tone twins**. Their foundation that didn't oxidize, their SPF that left no cast, their blush that didn't go muddy. You see what works on skin like yours, and eventually you post what works on you.

**Brand voice:** friendly, girl-to-girl.

## Sources
This system was authored **from the brand brief only** — no codebase, Figma, or existing assets were provided. All visual decisions (palette, type, logo, components) are original and are a proposed starting point for the team to steer. If you have brand files (fonts, logo, Figma), share them and this can be reconciled to the real thing.

---

## Content fundamentals — how Neu writes

- **Person:** Second person, always. We talk to *you* ("what works on skin like yours", "your tone twins"). Neu refers to itself as "we" sparingly and warmly ("we worked out your undertone").
- **Tone:** Girl-to-girl, but **modern and smart** — Neu's essence is **Personal · Inclusive · Smart · Modern**. Warm, direct, a little conspiratorial, like a friend who actually knows her stuff. Confident, never clinical, never preachy.
- **Casing:** Sentence case everywhere in UI and headlines. UPPERCASE only for small mono labels/eyebrows (e.g. `YOUR UNDERTONE`, `FOR YOU · MST-07 OLIVE`).
- **Specificity is the brand.** We name the exact failure modes beauty content ignores: "didn't oxidize", "no white cast", "didn't go muddy", "no grey cast". Concrete > flattering. Never "flattering for all skin types", "universally beautiful", or "one-size-fits-all" — that's the default we exist to remove.
- **Numbers with people attached:** "1,240 tone twins share MST-07 olive", "87% of your tone twins wear 310–330". Data always ties back to real people like you.
- **Length:** Short. Headlines are one editorial line; body is 1–2 sentences. Punchy over thorough.
- **Emoji:** No. Warmth comes from voice and the serif italic, not emoji.
- **Example headline:** *"You're MST-07, olive."* / *"What works on skin like yours."* / *"Meet my tone twins."*

---

## Visual foundations

**Overall vibe.** Clean, modern, friendly beauty — not a clinical color-analysis tool. Pure white (true black in dark), a calming amethyst signal, frosted glass, and the Monk Skin Tone Scale as the recurring hero motif.

- **Color.** Neutrals are locked: **white** `#FFFFFF` is the background in light mode and **true black** `#000000` in dark — always. Text is dolphin ink (`--ink #2E2440`). Brand hues: **amethyst** `#7C6A99` is the signature / trust signal (selection, badges, placement ring; lifts to `#B79ED6` on black), with **lilac** `#AB92BF`, **berry** `#C75C86` (blush cue) and **caramel** `#C08552` (spark) in support. Amethyst is used as a signal, never a full-screen wash. The **Monk Skin Tone Scale** (`--mst-1…10`) and **undertone chips** (warm/cool/neutral/**olive**) are fixed color tokens, never themed.
- **Type.** A single **geometric, soft-cornered sans**: the brand face is **Circular Corner** (Medium as the workhorse weight), substituted by **Poppins** until licensed (approved substitutes: Circular Std, Avenir Next, Sofia Pro, Nunito Sans). Headings are Medium with slightly wide letter-spacing; body is Regular. Data/labels = **Space Mono** (tone codes like `MST-07`, uppercase eyebrows).
- **Glassmorphism.** Frosted translucent panels — cards, chips, nav, overlays — via `--glass` / `--glass-strong` fill, `--glass-border`, a bright inset top-edge `--glass-highlight`, and `backdrop-filter: blur(var(--glass-blur))`. A faint amethyst `--aurora` sits behind so the glass has something to refract on an otherwise white/black base.
- **Spacing.** 4pt base rhythm, generous. Screen gutters 20–22px. Cards breathe (16–20px inner padding).
- **Backgrounds.** Flat white / black + the faint amethyst aurora. No photographic hero backgrounds, no aggressive gradients. Product imagery is a soft two-stop tonal gradient placeholder, never a stocky photo. Occasional amethyst-soft tint block for "tone twin" callouts.
- **Corner radii.** Soft, not bubbly. Cards `--r-lg 20px`, inputs/tiles `--r-md 14px`, buttons and chips are full pills (`--r-pill`). Tone dots are circles.
- **Cards.** White (or glass) surface, hairline border (`--line`), soft low shadow (`--shadow-md`), 20px radius. Never a colored left-border accent.
- **Shadows.** Low and soft. Three steps: `sm` / `md` / `lg`, plus a sheet shadow, plus the glass shadow. Elevation is gentle; nothing floats hard.
- **Borders.** 1px hairlines in `--line`/`--line-strong`. Selected/active states use a 1.5–3px amethyst ring rather than a heavy border.
- **Animation.** Restrained. 120–180ms ease transitions on color/background. Press = subtle scale (0.97) on buttons. No bounces, no long showy motion.
- **Hover / press.** (Touch-first, but for web) hover = slight darken/tint; press = scale-down for buttons, tint fill for options. Selection = amethyst ring + fill for quiz options, amethyst fill for chips.
- **Transparency & blur.** Central to the look — see Glassmorphism above. The `TabBar`, cards, chips and floating overlays are frosted glass (`--glass` + `backdrop-filter: blur`). Text and the amethyst signal stay opaque for legibility.
- **Imagery color vibe.** Clean, skin-forward, softly lit. No heavy grain; product placeholders are gentle two-stop tonal gradients.
- **Signature motif.** The **placement dot**: a warm skin-tone circle inside an **amethyst ring** (the logo, the `ToneSwatch` selected state, the profile tone). It encodes the product — "your tone, placed."

---

## Iconography

- **Set:** [Lucide](https://lucide.dev) (open-source, 2px rounded-stroke) — loaded from CDN (`unpkg.com/lucide`). **Substitution flag:** no icon set was provided, so Lucide is a chosen match for the friendly, rounded feel. Swap for the team's real set when available.
- **Style:** line icons, 2px stroke, 22px in the tab bar / 16–20px inline. Icons inherit `currentColor`; active nav is amethyst, default is `--ink-3`.
- **Usage:** functional only (nav, back, search, save, shop). Icons are never decorative filler.
- **Emoji / unicode:** not used as icons. The two exceptions are the heart save toggle (♥/♡) and the check on selected quiz options (✓), used deliberately.
- **Brand mark:** the mark is a placement dot (skin-tone gradient) inside an **amethyst ring**; wordmark "Neu" in Circular Corner / Poppins. The files in `assets/` (`logo.svg`, `logomark.svg`, `logo-reversed.svg`) are **placeholders in brand colors** — the final logo will be supplied by the team.

---

## Components (`window.NeuDesignSystem_32f7fb`)

Reusable primitives, grouped by concern under `components/`.

**forms/** — `Button` (primary/quiet/soft/ghost pill), `Chip` (selectable, optional tone swatch), `Input` (search field), `SegmentedControl`, `QuizOption` (large tappable quiz answer).
**display/** — `Card` (base surface), `ProductCard` (product surfaced through tone twins — the feed's heart), `Badge` (verdict/status pill), `Avatar` (tone twin, corner tone dot), `ToneSwatch` (the Monk-tone dot with olive placement ring — signature primitive).
**navigation/** — `TabBar` (iOS bottom nav, translucent blur).

> **Intentional additions (from-scratch build, no source inventory):** `ToneSwatch`, `QuizOption`, and `ProductCard` are brand-specific primitives added because the Monk-scale placement, the quiz, and the tone-twin feed are the product's core — a generic kit wouldn't capture them.

## UI kits
- **`ui_kits/neu-app/`** — the Neu iOS app: interactive quiz → tone result → tone-twin feed → product detail → profile. Open `ui_kits/neu-app/index.html`.

## Foundations (Design System tab)
Specimen cards live in `guidelines/`: Colors (neutrals, brand hues, semantic), Brand (Monk Skin Tone Scale, undertone chips, logo, voice), Type (display, body, mono, scale), Spacing (scale, radii, elevation).

---

## Index / manifest
- `styles.css` — global entry point (import this one file). `@import`s everything below.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadow.css`.
- `assets/` — `logo.svg`, `logomark.svg`, `logo-reversed.svg`.
- `guidelines/` — foundation specimen cards (`*.card.html`).
- `components/{forms,display,navigation}/` — `<Name>.jsx` + `.d.ts` + `.prompt.md`, one `*.card.html` per group.
- `ui_kits/neu-app/` — iOS app kit + `README.md`.
- `SKILL.md` — Agent-Skill wrapper for downloading/using this system.
- `thumbnail.html` — homepage tile.

## Fonts — substitution flag
The brand face **Circular Corner** (Medium; geometric, rounded-corner sans) is **not a free font**, so it is listed first in the stacks and substituted by **Poppins** (nearest geometric match) via Google Fonts CDN (`tokens/fonts.css`); Space Mono covers tone codes. Approved close substitutes if Poppins isn't wanted: **Circular Std, Avenir Next, Sofia Pro, Nunito Sans**. Provide the licensed Circular Corner `woff2` (add an `@font-face` in `tokens/fonts.css`) to swap in the real face and clear the font flag.
