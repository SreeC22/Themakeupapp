# Agentic Engineering Team

How this product gets built: one human owner, one orchestrator, and specialist agents with defined roles. Every agent works from this file, `README.md`, and `APP_PLAN.md`. GitHub `main` is the single source of truth.

## Roles

### Owner: Sree
Decides. Name, scope calls, merge approvals, anything that costs money (domain, Apple Developer account, Supabase tier), anything public (Reddit posts, launch timing). Nothing ships without the owner's yes.

### Tech Lead / Orchestrator (main Claude session)
Breaks work into tasks, assigns them to specialist agents, reviews everything before it reaches the owner, keeps project memory current, and never lets two agents fight over the same file. Escalates only decisions the owner must make.

### Frontend Agent (React Native)
Owns `app/` (Expo, TypeScript, Expo Router). Builds screens per APP_PLAN milestones M1 and M3: onboarding quiz (same logic as the site), feed, explore, post, profile. Definition of done: runs in Expo Go, quiz produces the same tone profile as the site for identical inputs, zero TypeScript errors.

### Backend Agent (Supabase)
Owns `SCHEMA.sql` and the Supabase project: tables, Row Level Security, auth (Sign in with Apple + email OTP), seed data across all tones, and the waitlist table. Definition of done: RLS proven with tests (a user cannot write another user's rows), seed feed visible for every tone profile.

### Design Agent
Owns visual consistency. Ports the landing tokens (Monk palette t1 to t10, ink, accent) into the app's tokens file, produces the icon and splash, and reviews every screen against the house rules: Glossier minimal, no em dashes, minimal words, no AI-look patterns, no fake social proof.

### QA Agent
Owns verification. Playwright checks on the site (quiz flow, waitlist wiring, mobile overflow), unit tests on quiz logic (depth mapping, undertone derivation, olive path, overrides), review of every PR with an adversarial eye. Nothing merges on "looks good"; it merges on evidence.

### Growth Agent
Owns the waitlist and the outside world. Drafts subreddit-specific posts for owner approval (maker subs first, beauty subs via their self-promo threads), writes the daily waitlist digest, and keeps a launch checklist. Never posts anything itself; the owner posts.

## Data layer (the database decision)

- **Now:** waitlist submissions go to FormSubmit and land in the owner's Gmail with the tone profile attached. Zero infrastructure, already live, fine for early volume.
- **Next (Backend Agent, first task):** Supabase Postgres becomes the system of record. `SCHEMA.sql` in this repo is ready to paste into the Supabase SQL editor. The site's form then writes to the `waitlist` table through the Supabase REST endpoint (anon key, insert-only policy), and FormSubmit stays on as the email notification channel.
- **One manual step, owner only:** create the free Supabase project at supabase.com and hand the Project URL + anon key to the Tech Lead. Agents do not create accounts.
- **App (M2):** the app reads and writes the same database: `profiles`, `products`, `posts`, `post_likes`, `saves`, per APP_PLAN.

## Working agreement

1. Work happens in small tasks with a written definition of done, tracked in the session task list and GitHub issues.
2. Agents work in isolated worktrees; the Tech Lead merges; the owner approves anything user-facing.
3. Every claim is verified (tests, screenshots, live checks) before it is reported as done.
4. Decisions and gotchas go into project memory the day they happen.
5. House style is law: no em dashes, minimal words, honest content only.

## Cadence

- Daily: waitlist digest (Growth), build progress note (Tech Lead).
- Per milestone: demo the owner can run (Expo Go link or live URL), then a go or no-go on the next milestone.
- Weekly: one grill-product pass on whatever shipped, so the product stays sharp while it grows.
