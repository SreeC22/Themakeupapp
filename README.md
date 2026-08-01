# Neu

Makeup recommendations from people with your skin tone.

The beauty industry writes advice as if every face is the same shade. This app flips that: your skin tone is the organizing principle. You tell us your tone once, and everything you see (products, reviews, recommendations) comes from people who actually match you.

## Why this exists

Finding the right foundation shade, or a blush that does not go muddy, or an SPF without white cast, is guesswork for most people:

- Shades get tested under store lighting on the back of a hand, and look wrong by the next day.
- Reviews treat every skin tone as interchangeable, so a 5-star product for one tone can be a miss for another.
- Viral recommendations come from people who do not share your depth or undertone.

The fix is not more reviews. It is reviews from people who share your tone. That is the whole product.

## How it works

1. **Take the tone quiz (30 seconds, no camera).**
   Pick your shade from a 40-shade palette built on the [Monk Skin Tone Scale](https://skintone.google/the-scale), the 10-tone research standard for inclusive skin representation, with a slider to fine-tune between shades. Then three quick checks anyone can do (vein color, sun reaction, gold vs silver jewelry) work out your undertone: Warm, Cool, Neutral, or Olive. The quiz explains its reasoning and you can override it.

2. **Get your tone profile.**
   Depth + undertone, for example "Tan 5 · Olive". This becomes your lens on the entire app.

3. **See what works on skin like yours.**
   A feed of products posted by people who match your profile ("tone twins": within one depth step, same undertone). Post what you use and it reaches everyone who matches you.

## What's in this repo

| Path | What it is |
|---|---|
| `index.html` | The live landing page: explains the app, runs the real tone quiz, and captures the waitlist. Fully self-contained (single file, inline CSS/JS, no build step). |
| `APP_PLAN.md` | The full iOS app plan: React Native (Expo) stack, data model, screens, and milestones to TestFlight. |
| `Neu Design System/` | Design tokens (light + dark), components, wireframes, brand voice, and the UI kit for the app. |
| `README.md` | This file. |

## Landing page details

- **Design:** minimal, Glossier/Rhode direction. White background, Instrument Sans, thin rules, one accent color for CTAs.
- **Quiz:** the same logic the app will ship with. Shade selection is continuous (any color on the Monk continuum, not just 10 buckets). Undertone is derived from observable signals, with plain-language help so people who have never heard the word "undertone" can still answer.
- **Waitlist:** email capture wired to FormSubmit. Each signup arrives by email with the person's full tone profile attached, so the waitlist is tone-tagged from day one and early invites can seed every corner of the range.
- **No dark patterns:** no fake testimonials, no invented user counts. Example posts are clearly framed as what a post looks like.

## The app (next)

React Native (Expo, TypeScript), iOS first. Supabase backend. See [APP_PLAN.md](APP_PLAN.md) for the data model, screen map, matching logic, and the four milestones from scaffold to TestFlight.

## Status

| Phase | Status |
|---|---|
| Landing page + tone quiz + waitlist | Done, in this repo |
| Name + domain | Name locked: Neu. Domain pending; site rename lands with the next tested pass |
| React Native app, milestone 1 (offline quiz + feed skeleton) | Next |
| TestFlight beta, invite the tone-tagged waitlist | After |

---

Made with every shade in mind.
