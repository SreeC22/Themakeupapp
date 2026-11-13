# Neu: reusable product-planning prompt

Copy the prompt below into an AI conversation. Return with the resulting `NEU_PRODUCT_BRIEF.md` so we can finish the website one page at a time.

---

You are a product designer and senior web engineer helping me finish Neu. Create a practical, complete product requirements document as Markdown named `NEU_PRODUCT_BRIEF.md`. Give me the full Markdown document, not just an outline.

This is a planning request. Do not change code, create accounts, modify databases, push to GitHub, publish, or invent working integrations.

## The product idea

Neu is a browser-first makeup community, not an iOS app yet. I want to share a website link in makeup chats and communities so people can contribute their skin context, the product shades they use, and products they keep coming back to.

Makeup is a way of expressing yourself. Neu should help people discover possibilities, not tell them the one correct way to look. Skin depth, undertone, olive cast and skin type provide useful context for finding product experiences from people with similar skin. They are not diagnoses, rigid labels or guarantees of shade compatibility.

Public education belongs at the heart of the website: explain undertones and color theory in the same place people explore makeup.

Keep navigation and participation simple for beginners. Do not turn the first release into a store, an AI face-analysis app, a social-media clone or a native mobile app.

## Approved design decisions

Preserve this direction rather than proposing a redesign:

- Soft warm cream backgrounds, dusty rose and mauve accents, deep-plum main actions.
- Expressive serif headlines and clear, dark, comfortably sized reading text.
- Minimal navigation and a useful footer with public Learn access.
- Makeup-texture artwork embedded into the page, blending at the edges rather than sitting in a picture box.
- No information panels, skin-tone labels or product recommendation cards covering the hero image.
- Confident and personal like a makeup brand, without making the colors harsh.
- Responsive phone, tablet and desktop layouts.

Do not bring back the bright peach/yellow collage, dome-shaped image container, animated product illustrations, the rejected “beauty in your own tone” tagline, tiny pale text or redundant wording. Do not use em dashes or emojis.

Reference palette:

| Token | Color | Intended role |
| --- | --- | --- |
| Paper | #FBF7F2 | Main surface |
| Blush paper | #F3ECEB | Soft section surface |
| Dusty plum | #786B88 | Accent, subject to contrast checks |
| Deep plum | #514659 | Primary actions |
| Ink | #322B34 | Headings and reading text |
| Berry | #B85F78 | Small accent, not default body text |

Reference fonts: Cormorant Garamond for expressive headlines, DM Sans for reading text, Space Mono sparingly for utility labels. Readability matters more than preserving an unsuitable size or color.

## Current build versus intended product

There is now a runnable React website in `artifacts/neu-website/`, separate from retained canvas mockups.

Implemented frontend routes:

- `/`: approved homepage direction.
- `/learn`: public interactive education.
- `/profile`: guest skin profile stored in this browser only.
- `/discover`: searchable and filterable illustrative product examples.
- `/saved`: explains that account-based saving is not connected.
- `/share`: explains that publishing community notes is not connected.
- `/design-guide`: the approved visual reference and handoff.

Important distinctions:

- Example products and sample profiles are not live member posts or verified recommendations.
- Browser storage is not an account, shared data or cloud sync.
- Accounts, shared posting, cloud saving, moderation and database permissions are not implemented or verified in this website.
- Do not claim the current build is launch-ready.

There is an existing owner-managed Supabase project. The owner chose manual administration without providing an admin token. A previous read-only check accepted the project URL and publishable key, but the expected community tables were unavailable through the API. Do not assume their current state without checking.

The owner will decide what stays, what goes and what gets built next.

## First-release journey

Describe this journey clearly:

Home → Discover or Learn → optional skin profile → account when saving or sharing → return to the relevant product or note.

Guests should be able to learn publicly and browse a small number of starter picks. Explain the proposed account gate for a wider community library, saving and sharing. Separate the current example library from the eventual shared community.

Do not require a profile before public education. Explain what happens when a person is unsure of their undertone or skips optional fields.

## Specify every page and state

For each page, include its purpose, audience, entry points, essential content, primary and secondary actions, navigation, validation, data dependencies, privacy implications, and observable acceptance criteria. Cover guest, signed-in member and owner/moderator paths where relevant.

1. **Home:** explain Neu quickly; offer guest browsing and a skin starting point; link to Learn; keep the art clean; avoid repetitive invitations.
2. **Discover:** search, makeup categories, shade notes, skin-context filters, account gates, useful empty/no-match/loading/error states, and a way to clear filters. Explain that similarity is not a guaranteed match.
3. **Learn:** depth versus undertone; warm, cool and neutral tendencies; olive as a quality that can overlap; complementary and analogous color; practical examples for complexion, blush, lips, eyes and color correction. Include screen/lighting/formula limitations and realistic swatching advice. Do not treat vein color or jewelry preference as reliable diagnoses.
4. **Skin profile:** editable depth, undertone or “still exploring,” optional olive cast, skin type and optional concerns. Specify which fields can be skipped. Distinguish local guest data, private account data and information visible on public notes. Define how local choices transfer to an account only with clear consent.
5. **Product detail and member note:** decide how catalog products relate to multiple personal notes. Include brand, product, shade, category, experience, routine and relevant skin context. Separate verified product facts from subjective member claims. Address edits, deletion and reporting.
6. **Saved:** account gate, list, remove, revisit, loading/error/empty states and persistence across reloads and devices after cloud storage exists.
7. **Share:** validated product and shade entry, duplicate-product handling, first-person experience, optional routine, preview, publishing consent, success, editing and deletion. Avoid requiring face photos or introducing image-upload scope for the first release.
8. **Account:** Supabase email sign-in, confirmation/callback, expired or invalid links, sign-out, account switching, profile settings and account deletion. Propose recovery behavior without pretending it already exists.
9. **Safety and trust:** guidelines, report content, owner/moderator review, report privacy, resolution states, retention and privacy/terms review. An owner must have an operational way to handle reports, not just a report button.
10. **System states:** missing page, service unavailable, offline, denied permission, expired session, failed save/publish, retries and preservation of unsent form content.

## Data and permissions

Create an ownership and permissions matrix for:

- Account identity.
- Profile.
- Product/catalog record.
- Member product note.
- Save.
- Report.
- Moderation decision, if needed for the proposed first release.

For each, specify who can read, create, update and delete it. Define public versus private fields explicitly. Explain whether reports are visible to reporters and moderators, never the whole community.

Call out Supabase row-level security, grants, indexes and ownership constraints as implementation requirements, not verified facts.

Address the risk of deleting a catalog product and accidentally cascading deletion into other people's posts. Review views so they cannot bypass intended permissions. Protect user-specific state on sign-out and account switching.

Never place an admin token or service-role key in browser code. Do not include real credentials in this document.

## Launch blockers and checks

Include:

- Confirm/reconcile schema and migrations in the intended Supabase project.
- Configure email callbacks for the real website URL.
- Test permissions using two different accounts and an anonymous visitor.
- Verify create/edit/delete/save/report behavior from UI through persistence.
- Verify refresh, navigation, sign-out, account switching and another browser session.
- Test report handling by the owner.
- Review privacy, terms, data retention, account deletion and community guidelines.
- Confirm keyboard access, readable contrast, focus visibility, touch sizes, zoom/reflow and reduced motion.
- Distinguish a passing frontend build, a local Git commit, a GitHub push and publication. They are different actions.

## Future work, not automatic first-release scope

The project also has ideas for explaining undertones through shade matching, a US/India complexion-shade library and a brand database. Describe their dependencies and boundaries, but do not assume they are complete or expand the first release to implement them all.

Do not introduce shopping checkout, payments, advertising, AI matching, selfie analysis or a native app as required features.

## Output format

Organize `NEU_PRODUCT_BRIEF.md` with:

1. Product overview and first-release goals.
2. Approved decisions versus proposals.
3. User roles and end-to-end journeys.
4. Route map and desktop/mobile navigation.
5. Page-by-page specifications.
6. Shared components and content rules.
7. Data model and permissions matrix.
8. Loading, empty, error, offline and permission states.
9. Accessibility and responsive acceptance criteria.
10. Privacy, safety and moderation.
11. Current implementation versus remaining work.
12. Launch blockers.
13. Prioritized, page-sized milestones with dependencies.
14. Open decisions for me, with a recommendation and consequence for each.

Use explicit labels such as **Approved**, **Implemented frontend**, **Not connected**, **Proposed** and **Needs owner decision**. Do not invent decisions or silently convert proposals into approved requirements.

End with a practical completion table: page, current state, remaining work, dependency and definition of done. Keep it specific enough that we can finish one page at a time without redesigning the approved homepage.
