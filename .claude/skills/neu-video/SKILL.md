---
name: neu-video
description: Build short Neu promo, demo, and launch videos with Remotion (React and TypeScript, programmatic video). Use when making a waitlist teaser, an App Store preview, a Reddit or Instagram clip, or a product demo for Neu. Owns the on-screen look and copy rules; the Head of Brand approves the look, the Founder approves anything public.
---

# Neu video

Make short, quiet, on-brand videos for Neu: the tone palette in motion, not a hype reel. The Monk skin tones do the visual work that other apps do with gradients and mascots.

## Stack

Remotion (React plus TypeScript, renders to mp4). Scaffold only when you are actually building:

```
npx create-video@latest   # pick the TypeScript "Hello World" template, put it in video/
```

Notes:
- The `video/` project pulls a large node_modules. Do not commit node_modules. Add a `video/.gitignore` if you keep the project in this repo, or keep it in a separate repo and commit only the compositions.
- Render with `npx remotion render <CompId> out/<name>.mp4`.
- Preview with `npx remotion studio`.

## Brand lock (do not improvise)

Pull tokens from index.html :root. They are law, same as the site and app.

- Background #FFFFFF. Ink #111111. Gray #6E6E6E. Hairline #E6E2DD. Panel #F7F5F2.
- Accent #C2452D, for one CTA or one emphasis per scene, never as fill or gradient.
- Monk scale, the only decorative color: t1 #F6EDE4, t2 #F3E7DB, t3 #F7EAD0, t4 #EADABA, t5 #D7BD96, t6 #A07E56, t7 #825C43, t8 #604134, t9 #3A312A, t10 #292420.
- Type: Instrument Sans. Tight negative tracking on big headings, uppercase tracked labels for captions. Load it as a local font in Remotion (staticFile), do not rely on a CDN.
- Wordmark: lowercase "neu" with a single t7 dot.
- Shape and finish: pill CTAs, 8px card radius, 1px hairlines, no shadows, no gradient text, no glow.

## Copy rules (house rules apply to every frame)

- No em dashes on screen. Commas, periods, colons, parentheses.
- Minimal words. One idea per scene.
- No fake social proof. No invented user counts, no fabricated testimonials, no star ratings you cannot back. Any example post is labeled "example".
- Do not imply a camera or AR try-on. Neu is a no-camera quiz. Show the quiz, not a face scan.
- Do not overclaim "match". Tone is the strongest filter, not a guarantee. Say "people who share your tone", not "your perfect match".

## Motion

- The palette is the animation: stagger the 10 Monk dots in, slide the shade selector along the Monk gradient, settle onto a tone card. Springs for the dots, eases for text.
- Calm and legible. 30fps. Short holds so copy is readable. No frantic cuts, no parallax soup.
- Default silent with on-screen captions (social autoplays muted). If you add audio, licensed only, and the video must read with sound off.

## Composition recipes

Vertical 1080x1920 is the default for Reddit and Instagram. Landscape 1920x1080 for a site or App Store demo.

1. Waitlist teaser (about 12s, vertical):
   wordmark in, headline "Makeup recs from people with your skin tone", the 10 dot tone row staggers in, the shade slider glides and lands on "Tan 5 · Olive", CTA "join the waitlist" in accent. End on the wordmark.
2. App Store preview (15 to 30s, portrait device frame):
   quiz shade step, one undertone question, profile reveal, starter picks labeled "Curated starter pick", feed with a match chip. Show the real flow from the wireframes.
3. Demo or explainer (landscape, room for captions):
   the same beats slower, each with one caption line. Good for the site hero or a Reddit feedback post.

Reuse the wireframe component vocabulary (tone swatch, tone card, match chip, starter pick card) so the video and the app read as one product.

## Deliverables

- mp4 per channel at the right size (vertical for social, portrait for App Store, landscape for site).
- Keep clips short. A teaser earns attention in the first second: open on the tone row or the headline, not a logo hold.

## Ownership and approval

- Head of Brand and Creative owns the look and signs it off against these rules.
- Head of Growth owns which channel and drafts the surrounding post; the Founder posts.
- Any launch or promo video is public, so the Founder approves before it goes out. No public video without that yes.
