# HANDOVER

Start-here note for the next session. Full spec lives in CLAUDE.md, TEAM.md, APP_PLAN.md. This file is the pick-up point.

## State (2026-08-01)

M1 is built. `app/` is an Expo app (SDK 57, TypeScript, Expo Router): offline quiz with the neutral-confirm step, tone profile and saves in AsyncStorage, 14 curated starter picks bundled (olive and deep over-seeded), tabs For You / Discover / Saved / You, Neu DS tokens (light + dark), Poppins + Space Mono.

Checks: `cd app && npm run typecheck` (clean), `npm run parity` (2180 checks against index.html, identical), `npx expo export` (bundles). Run it: `cd app && npm start`, then Expo Go or iOS simulator.

## Done

- Landing page, tone quiz, and waitlist. Live on GitHub Pages: https://sreec22.github.io/Themakeupapp/. Self-contained single file (index.html), inline CSS and JS.
- Waitlist wired to FormSubmit. Signups reach sreechityalawork@gmail.com with the tone profile attached.
- Supabase schema written (SCHEMA.sql): waitlist plus app tables with RLS. Not deployed.
- Neu Design System committed at repo root; app tokens mirror it.
- M1 skeleton (above). Parity is enforced by app/scripts/parity.mjs, which extracts the site's quiz functions from index.html at run time.

## Next (unblocked, needs no owner input)

- App icon + splash from Neu DS assets (assets/neu-icon.svg) wired into app.json.
- Composer sheet UI (M3 surface, no backend needed): binary repurchase + verdict chips, per the Mobbin research PDF.
- Site neutral-confirm pass is specced in APP_PLAN.md but user-facing: needs owner approval, ship with the Playwright gate.

## Blocked on owner (Sree only)

1. Supabase project. Owner creates the free project and hands the URL plus anon key to the Tech Lead. Gates M2 (backend, auth, seed feed). SCHEMA.sql is ready to paste.
2. App name: resolved. Neu, decided 2026-07-19, trademark screen required before launch. Site renamed via the constant (index.html:384).
3. Apple Developer account ($99/yr). Gates M4 (TestFlight). Not needed before then.

## Gotchas

- No em dashes anywhere, copy or docs. Commas, periods, colons, parentheses only. (House rule 1.)
- Tone-profile string format is "Depth Name (#hex) · Undertone", plus "(self-set)" when overridden. The owner's Gmail filters on it. Keep it stable.
- Quiz JS `STOPS` (index.html:399) must match the CSS gradient stops (index.html:104). Both are non-linear so brown midtones get track room.
- APP_PLAN.md sits at repo root because GitHub web upload flattens paths. If you move docs into docs/, fix the README links.
- Test the site with Playwright before shipping site changes: full quiz flow, olive path, override chips, mobile horizontal overflow equals 0.

## Where to flip things (index.html)

- APP_NAME: line 384
- WAITLIST_ENDPOINT (FormSubmit alias): line 385
- Monk palette t1 to t10: lines 15 to 16 (:root)
- Accent and ink tokens: lines 17 to 18
- Gradient stops (CSS) line 104 and STOPS (JS) line 399: keep in sync

## Approvals

Owner approves anything user-facing, public, or costing money. Internal docs and the M1 scaffold do not need sign-off. See TEAM.md.
