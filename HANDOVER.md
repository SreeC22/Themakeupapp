# HANDOVER

Start-here note for the next session. Full spec lives in CLAUDE.md, TEAM.md, APP_PLAN.md. This file is the pick-up point.

## State (2026-07-18)

Repo is docs plus one live file. Nothing is built past the landing site. `app/` does not exist yet. Latest commit on main: 73db212.

Tracked: index.html (live, 563 lines), README.md, CLAUDE.md, TEAM.md, APP_PLAN.md, SCHEMA.sql, .gitignore. No build step, no tests, no CI.

## Done

- Landing page, tone quiz, and waitlist. Live on GitHub Pages: https://sreec22.github.io/Themakeupapp/. Self-contained single file (index.html), inline CSS and JS.
- Waitlist wired to FormSubmit. Signups reach sreechityalawork@gmail.com with the tone profile attached.
- Supabase schema written (SCHEMA.sql): waitlist plus app tables with RLS. Not deployed.
- Team roles and the four-milestone app plan documented.

## Next (unblocked, needs no owner input)

M1 skeleton, per APP_PLAN.md. Expo (React Native, TypeScript, Expo Router) app in `app/`:
- Tab navigation, design tokens ported from index.html (t1 to t10, ink #111111, accent #C2452D).
- Quiz working fully offline, identical results to the site for identical inputs.
- Tone profile persisted in AsyncStorage.

Done when it runs in Expo Go with zero TypeScript errors and the quiz matches the site on the same inputs (including the olive path and manual override).

## Blocked on owner (Sree only)

1. Supabase project. Owner creates the free project and hands the URL plus anon key to the Tech Lead. Gates M2 (backend, auth, seed feed). SCHEMA.sql is ready to paste.
2. App name. Undecided, Everytone is the front-runner. Site renames via one constant (index.html:384).
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
