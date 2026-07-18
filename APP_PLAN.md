# The Makeup App — React Native App Plan

iOS-first React Native app. Skin tone is the organizing principle: quiz → tone profile → community recommendations from people who match you ("tone twins").

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React Native via Expo (SDK 53+, TypeScript)** | Fastest path to TestFlight; EAS handles signing/builds without a Mac-bound Xcode workflow; over-the-air JS updates for quick iteration |
| Navigation | **Expo Router** (file-based) | Deep links free, matches web mental model |
| State/data | **TanStack Query** + lightweight Zustand store | Server cache + tiny client state; no Redux ceremony |
| Backend | **Supabase** (Postgres + Auth + Storage + Row Level Security) | Free tier, auth built in, SQL you own, realtime later |
| Styling | StyleSheet + design tokens file (port the landing palette: tone scale `t1–t10`, cream/ink/rouge) | One visual language across site and app |
| Analytics | PostHog (free tier) later | Not v1-blocking |

## Data model (v1)

```
profiles      id (auth uid) · handle · tone_depth (1–10) · undertone (warm/cool/neutral/olive)
              · behavior (oxidizes/ashy/pink/never) · created_at
products      id · brand · name · category (base/blush/lip/eye/spf/other) · shade_label
posts         id · author_id → profiles · product_id → products · body (text)
              · rating (1–5) · created_at
post_likes    post_id · user_id (composite PK)
saves         post_id · user_id (composite PK)
```

Match score (v1, computed client-side or SQL view): same undertone +50, tone depth distance 0→+50, 1→+35, 2→+15, else 0. "Tone twins" = depth within ±1 AND same undertone.

## Screens (Expo Router routes)

```
(onboarding)/welcome        value prop, sign in with Apple / email OTP
(onboarding)/quiz           3-step tone quiz (same logic as the landing page)
(onboarding)/profile-ready  tone profile card reveal → enter app
(tabs)/feed                 default: posts by tone twins, match % chip on each card
(tabs)/explore              filter by category / any tone / brand search
(tabs)/post                 create a rec: pick/add product, shade, note, rating
(tabs)/you                  your tone profile, your posts, saved recs, edit tone
post/[id]                   post detail + comments (comments can slip to v1.1)
```

## Milestones

**M1 — Skeleton (days 1–2).** Expo app scaffolded in `app/` with TypeScript, Expo Router, design tokens, tab navigation, quiz flow working fully offline (no backend), tone profile persisted locally (AsyncStorage). *Demoable in simulator/Expo Go.*

**M2 — Backend (days 3–4).** Supabase project; schema above with RLS (users write only their own rows, read all); Sign in with Apple + email OTP; quiz result saved to `profiles`; seed ~30 realistic posts across tones so every tone profile sees a live feed.

**M3 — Community loop (days 5–7).** Feed filtered by tone-match with match chips; post creation; like/save; Explore with filters; empty states that recruit ("be the first Deep 8 · Warm poster").

**M4 — TestFlight (week 2).** Apple Developer account ($99/yr — the one hard prerequisite); EAS Build + Submit; app icon/splash from landing branding; privacy nutrition labels (email + user content); invite waitlist members from the FormSubmit signups (they're tone-tagged already).

## Decisions locked

- **No camera/AI shade detection in v1** — quiz only (same promise the landing page makes).
- **iOS first**, Android later (RN makes it cheap when the time comes).
- **Name pending** — code uses `APP_NAME` config constant, same as the site.
- Waitlist emails + tone profiles arrive via FormSubmit → Gmail; export to CSV when inviting to TestFlight.

## Repo layout

```
/index.html        landing page + waitlist (live via GitHub Pages)
/APP_PLAN.md       this plan
/app/              Expo React Native app (M1 scaffold next)
```
