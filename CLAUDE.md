# CLAUDE.md

Context for Claude Code sessions in this repo. Read TEAM.md (roles), APP_PLAN.md (app spec), README.md (product).

## What this isdi

The Makeup App (working title): makeup recommendations organized by skin tone. A quiz derives a tone profile (depth on the Monk Skin Tone Scale + undertone), and users see product picks from people who match them. Live site: https://sreec22.github.io/Themakeupapp/ (GitHub Pages from main, root).

## Current state (2026-08-01)

- index.html: landing + working quiz + waitlist. Live and verified. Self-contained single file, no build step.
- Waitlist: form POSTs to FormSubmit (alias endpoint in the WAITLIST_ENDPOINT constant in index.html); signups arrive in the owner's Gmail with tone profile attached.
- SCHEMA.sql: Supabase schema ready to paste (waitlist table + app tables with RLS). Waiting on the owner to create the free Supabase project and provide URL + anon key. Then point the site's form at the Supabase REST insert and keep FormSubmit for email notification.
- Next build milestone: M1 in APP_PLAN.md. Expo (React Native, TypeScript) app in app/, quiz working offline, tone profile in AsyncStorage. iOS first.
- Name: locked, Neu (owner decision 2026-08-01). The site still shows the old APP_NAME constant; flip it to Neu in a dedicated pass with the Playwright test gate, not as a drive-by.
- Neu Design System/ at repo root: tokens (light + dark), components, wireframes, brand voice, UI kit (quiz, result, feed, product, profile). Source of truth for app styling. Fonts: Poppins substitutes for Circular Corner until licensed.
- Feed layout: A (2-up grid) provisional, owner has not picked between wireframe alternates A/B/C.
- Strategy note from the last product grill: wedge segments are olive and deep undertones (sharpest verified pain, no incumbent coverage); v1 must be useful single-player (seeded tone-tagged picks) before community features.

## House rules (owner's law, do not relitigate)

1. No em dashes anywhere, in any copy or docs. Use commas, periods, colons, parentheses.
2. Minimal words. No filler sections, no decorative copy.
3. Design: Glossier/Rhode minimal. White, Instrument Sans, thin rules, one accent (#C2452D) for CTAs only. No gradient text, marquees, emoji bullets, heavy shadows, over-rounded cards.
4. No fake social proof, ever. Example content is labeled as example.
5. Shade palette is the Monk Skin Tone Scale (10 official hexes in :root of index.html). Slider stops are non-linear so brown midtones get track room; JS STOPS must match the CSS gradient stops.
6. Quiz logic is the spec: 40-shade palette + slider, undertone derived from veins/sun/jewelry with olive detectable and manual override. The app's quiz must produce identical results to the site for identical inputs.

## Gotchas

- APP_PLAN.md sits at repo root (GitHub web upload flattens paths). If you reorganize into docs/, fix the README links.
- The tone-profile string format sent with waitlist signups: "Depth Name (#hex) · Undertone" plus "(self-set)" when overridden. Keep it stable; the owner's inbox filters on it.
- Test the site with Playwright before shipping changes: quiz flow end to end, olive path, override chips, mobile horizontal overflow = 0.
- Owner approves anything user-facing, anything public, and anything that costs money. See TEAM.md.
