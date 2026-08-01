# Neu — iOS app UI kit

An interactive click-through of the core Neu flow. Open `index.html`.

**Flow:** Quiz (30-sec, no camera) → Tone result (Monk placement + olive undertone) → For You feed (products filtered through your tone twins) → Product detail (tone-twin verdicts) → You / profile → retake quiz.

## Files
- `index.html` — mounts the app inside a 390×844 iOS frame; loads the DS bundle, Lucide, and the screens.
- `NeuApp.jsx` — shell: status bar, screen router, `TabBar`, and the shared `Icon` (Lucide) helper.
- `QuizScreen.jsx` · `ResultScreen.jsx` · `FeedScreen.jsx` · `ProductScreen.jsx` · `ProfileScreen.jsx`
- `data.js` — fake content (tone twins, products, reviews). No photos; product imagery is CSS color placeholders.

## Composition
Screens compose the design-system primitives — `Button`, `Chip`, `QuizOption`, `SegmentedControl`, `ProductCard`, `ToneSwatch`, `Badge`, `Avatar`, `Card`, `TabBar` — via `window.NeuDesignSystem_32f7fb`. Icons are Lucide (CDN); brand mark from `assets/`.
