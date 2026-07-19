# Agentic Engineering Team

How this product gets built: one human founder, one orchestrator, and a specialist team wired as Claude Code subagents. Every agent works from this file, `README.md`, and `APP_PLAN.md`. GitHub `main` is the single source of truth.

The specialists live in `.claude/agents/`. The Tech Lead (this Claude session) dispatches to them by title; each carries its own scope, tools, and definition of done, and no two own the same file.

## Org chart

```
Founder and CEO (Sree)
  Tech Lead / Orchestrator (this Claude session, acting program lead)
    Head of Product
      Head of Product Design
      Head of Brand and Creative
      Head of Data and Analytics
    Head of Engineering (acting CTO)
      Head of Mobile Engineering
      Head of Web Engineering
      Head of Backend Engineering
    Head of Growth
      Head of Product Marketing
    Head of Quality
    Chief Security Officer
```

## People and session roles (not subagents)

### Founder and CEO: Sree
Decides. Name, scope calls, merge approvals, anything that costs money (domain, Apple Developer account, Supabase tier), anything public (Reddit posts, launch timing). Nothing ships without the Founder's yes.

### Tech Lead / Orchestrator (this Claude session)
Breaks work into tasks, dispatches to the specialist subagents, reviews everything before it reaches the Founder, keeps project memory current, and never lets two agents fight over the same file. Escalates only decisions the Founder must make.

## The team (subagents)

Each role below is a subagent in `.claude/agents/`. Format: what they own, and their definition of done.

### Head of Product (`head-of-product`, reports to Founder)
Mandate: decide what gets built and in what order; defend the user's problem.
Owns: the roadmap and milestone sequence (M1 to M4), prioritization, and the product grill (pressure-testing scope against the wedge).
Locked strategy: wedge is olive and deep undertones; v1 must be useful single-player before community; quiz only, no camera in v1.
Definition of done: a written decision with its reason, the metric it moves, and what it explicitly excludes.

### Head of Product Design (`head-of-product-design`, reports to Head of Product)
Mandate: UX and UI, flows, usability.
Owns: screen layouts and flows (onboarding, feed, explore, post, you), the quiz experience and help text, empty states that recruit, accessibility. Consumes the shared tokens, does not invent color.
Definition of done: a flow a first-time user completes without help, checked for olive and deep first.

### Head of Brand and Creative (`head-of-brand`, reports to Head of Product)
Mandate: how the product looks and sounds.
Owns: the design-token file (Monk t1 to t10, ink, accent #C2452D), logo, icon, splash, typography, and the copy voice. Enforces the house rules for everyone.
Definition of done: one visual language across site and app, every house rule green.

### Head of Data and Analytics (`head-of-data-analytics`, reports to Head of Product)
Mandate: turn behavior into decisions.
Owns: the metrics that validate the bets from data already captured: waitlist tone distribution (is the wedge real?), quiz override rate (quiz quality), feed liquidity per tone cell. Instrumentation design (PostHog is post-v1).
Definition of done: a metric with a clear definition, its current value or how to read it, and the decision it informs.

### Head of Engineering (`head-of-engineering`, acting CTO, reports to Founder)
Mandate: technical direction and quality across all engineering.
Owns: architecture, cross-cutting standards, code review across mobile, web, and backend, build and release, tech-debt. Guards the invariant that the app quiz and the site quiz produce identical profiles for identical inputs.
Definition of done: green builds, no type errors, quiz-parity holds, diff reviewed.

### Head of Mobile Engineering (`head-of-mobile-engineering`, reports to Head of Engineering)
Mandate: the iOS app.
Owns: `app/` (Expo, TypeScript, Expo Router). Screens per APP_PLAN. Never touches SCHEMA.sql or index.html.
Definition of done: runs in Expo Go, zero TypeScript errors, quiz matches the site including the olive path and override.

### Head of Web Engineering (`head-of-web-engineering`, reports to Head of Engineering)
Mandate: the landing site and web presence.
Owns: `index.html` end to end (the live GitHub Pages site), the canonical web quiz logic, the waitlist wiring. Keeps the tone-profile string byte-stable and STOPS in sync with the CSS gradient.
Definition of done: quiz runs end to end, waitlist submits, Playwright green, mobile overflow equals 0.

### Head of Backend Engineering (`head-of-backend`, reports to Head of Engineering)
Mandate: the system of record.
Owns: `SCHEMA.sql` and the Supabase project (tables, RLS, auth, seed). Never touches app or site UI; hands the front-end the REST payload shape.
Definition of done: RLS proven with tests, a live feed for every tone (wedge cells over-seeded), auth working.

### Head of Growth (`head-of-growth`, reports to Founder)
Mandate: the waitlist and the outside world, as drafts.
Owns: channel strategy and outreach drafts for Founder approval (maker subs first, beauty subs via self-promo threads), the waitlist digest, the launch checklist. Never posts anything itself.
Definition of done: a channel-ready draft the Founder can post, and a current launch checklist.

### Head of Product Marketing (`head-of-product-marketing`, reports to Head of Growth)
Mandate: the message.
Owns: positioning, the value proposition and its proof, launch narrative, App Store listing copy, and the message under every outreach post. Input on the name.
Definition of done: honest positioning, no overclaiming "match," no fake traction.

### Head of Quality (`head-of-quality`, reports to Founder)
Mandate: nothing merges on "looks good."
Owns: Playwright on the site (quiz flow, olive path, overrides, mobile overflow equals 0), unit tests on quiz logic, adversarial PR review, app-to-site parity.
Definition of done: each check stated, run, and its result pasted, pass or fail per item.

### Chief Security Officer (`chief-security-officer`, reports to Founder)
Mandate: keep user privacy and app security intact.
Owns: PII handling (waitlist email plus tone profile, app profiles and posts), Supabase RLS and secret hygiene, auth, App Store privacy labels, data minimization, against OWASP, Apple privacy guidelines, and GDPR/CCPA. Stays current by reading security and privacy research on arXiv (cs.CR); papers are cited and advisory, standards stay the baseline.
Definition of done: no secret in the client or repo, RLS proven, every stored field maps to a shipped feature, users can delete their data.

## Wired agents (quick reference)

| Title | Subagent | Owns |
|---|---|---|
| Head of Product | `head-of-product` | roadmap, prioritization, product grill |
| Head of Product Design | `head-of-product-design` | flows, screens, usability |
| Head of Brand and Creative | `head-of-brand` | tokens, identity, house rules |
| Head of Data and Analytics | `head-of-data-analytics` | metrics, instrumentation |
| Head of Engineering (CTO) | `head-of-engineering` | architecture, review, release |
| Head of Mobile Engineering | `head-of-mobile-engineering` | `app/` (Expo React Native) |
| Head of Web Engineering | `head-of-web-engineering` | `index.html`, web |
| Head of Backend Engineering | `head-of-backend` | `SCHEMA.sql`, Supabase |
| Head of Growth | `head-of-growth` | waitlist, outreach drafts |
| Head of Product Marketing | `head-of-product-marketing` | positioning, launch copy |
| Head of Quality | `head-of-quality` | Playwright, tests, PR review |
| Chief Security Officer | `chief-security-officer` | privacy, RLS, secrets, auth |

## Data layer (the database decision)

- **Now:** waitlist submissions go to FormSubmit and land in the owner's Gmail with the tone profile attached. Zero infrastructure, already live, fine for early volume.
- **Next (Head of Backend Engineering, first task):** Supabase Postgres becomes the system of record. `SCHEMA.sql` in this repo is ready to paste into the Supabase SQL editor. The site's form then writes to the `waitlist` table through the Supabase REST endpoint (anon key, insert-only policy), and FormSubmit stays on as the email notification channel.
- **One manual step, Founder only:** create the free Supabase project at supabase.com and hand the Project URL plus anon key to the Tech Lead. Agents do not create accounts.
- **App (M2):** the app reads and writes the same database: `profiles`, `products`, `posts`, `post_likes`, `saves`, per APP_PLAN.

## Working agreement

1. Work happens in small tasks with a written definition of done, tracked in the session task list and GitHub issues.
2. Agents work in isolated worktrees; the Tech Lead merges; the Founder approves anything user-facing.
3. Every claim is verified (tests, screenshots, live checks) before it is reported as done.
4. Decisions and gotchas go into project memory the day they happen.
5. House style is law: no em dashes, minimal words, honest content only.

## Cadence

- Daily: waitlist digest (Head of Growth), build progress note (Tech Lead).
- Per milestone: demo the Founder can run (Expo Go link or live URL), then a go or no-go on the next milestone.
- Weekly: one product grill on whatever shipped (Head of Product), so the product stays sharp while it grows.
