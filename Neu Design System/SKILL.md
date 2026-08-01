---
name: neu-design
description: Use this skill to generate well-branded interfaces and assets for Neu, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Brand:** Neu — an iOS makeup app that removes the "default face". A 30-second quiz places you on the Monk Skin Tone Scale and finds your undertone (including olive). Everything is filtered through your "tone twins".
- **Voice:** friendly, girl-to-girl, second-person, sentence case, specific ("didn't oxidize", "no white cast"). No emoji. See README "Content fundamentals".
- **Look:** white background always (true black in dark mode); dolphin ink; **amethyst** `#7C6A99` as the single trust signal (selection, badges, placement ring), with lilac, berry & caramel in support. Frosted **glassmorphism** panels over a faint amethyst aurora. Circular Corner (→ Poppins) throughout + Space Mono for tone codes. Soft pills & 20px cards, gentle shadows, Lucide icons.
- **Tokens:** link `styles.css`; use the CSS custom properties (`--paper`, `--ink`, `--amethyst`, `--accent`, `--glass`, `--glass-blur`, `--aurora`, `--mst-1…10`, `--tone-olive`, `--font-display`, …). Dark mode = `.theme-dark` or `[data-theme="dark"]`.
- **Components:** `window.NeuDesignSystem_32f7fb` after loading `_ds_bundle.js` (Button, Chip, QuizOption, ProductCard, ToneSwatch, Badge, Avatar, Card, TabBar, …).
- **Signature motif:** the placement dot — a skin-tone circle inside an amethyst ring.
