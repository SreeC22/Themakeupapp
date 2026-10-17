# Neu: design, user-flow and content review

Review date: October 17, 2026

## Verdict

Neu has a coherent visual direction and a sensible guest-first product idea. The current prototype is not yet a consistently low-friction journey. Keep the approved design; refine the interactions instead of redesigning the brand.

The strongest next change is to shorten the first quiz step and protect progress when someone needs help. Improving those behaviors matters more than adding more pages, illustrations or decoration.

This is a heuristic review, not a usability study or an accessibility certification.

## Scope and evidence

- Reviewed the selected complete-website prototype, not a published community.
- Examined the desktop homepage and a full-page phone capture of the existing-shade step.
- Read navigation, quiz, routing, account-return, education and custom-dialog source.
- Used the design-thinking approach to frame user needs and evaluate friction.
- Used the GEO content scorecard to assess answer clarity and education structure.
- Consulted W3C multi-page-form and modal-dialog guidance.
- Did not change website or prototype code.
- Did not conduct interviews, an interactive browser test, contrast measurements, a production crawl, performance benchmarks or real account tests.

## The user need

Working hypothesis, based on the owner's stated audience:

When someone arrives from a makeup chat, they want to find useful product experiences from people with relevant skin context, without needing to understand every makeup term or create an account first.

How might we help that person find a useful starting point while letting them remain unsure, explore freely and control what they share?

Framework: a compact JTBD-informed review of an existing prototype. This is not a switch-interview study; no research participants were interviewed.

### Adoption forces

- Push: comparing shade experiences across scattered conversations is inconvenient. This comes from the owner's product intent, not measured research.
- Pull: one place for exploration, understandable education and personally relevant notes.
- Anxiety: getting labeled incorrectly, receiving an unreliable match, losing answers or sharing private information.
- Habit: people already browse familiar makeup chats without another account or quiz.
- Implication: deliver browsing value early, ask for less information, and explain uncertainty at the point of use.

Confidence is medium for the interaction recommendations and low for any claim about actual adoption. Real visitor behavior could change the priorities.

## What is working

### Visual identity

Cream, mauve and plum feel consistent with the approved makeup direction. The serif headline and embedded texture image give the homepage personality without requiring more visual elements. Keep these.

### Navigation

The visible desktop navigation is now focused on Home, Discover and Learn, with sign-in and a compact menu. That is a good fit for the request for less clutter.

Saved, sharing and profile controls can stay in the secondary menu. Keep essential browsing and public learning outside an account gate.

### Inclusion and uncertainty

The flow offers unsure answers, treats olive cast separately from undertone, and avoids promising an exact shade match. The swatches also have textual labels. These are important strengths.

### Honesty

The preview notice and sample-data disclosures distinguish examples from real community content. Keep this distinction until real data and accounts exist. Do not mistake the design walkthrough for a working security or persistence system.

### Familiar input controls

Cascading brand, product, formula and shade selectors reduce recall effort. Resetting dependent choices when the parent choice changes prevents stale combinations.

## Priority findings

### 1. High: protect unfinished quiz answers when opening help

Evidence: QuizFlow keeps answers and the current step in its own React state. WebsiteJourney replaces QuizFlow with Learn when the help action navigates there. Reopening the quiz mounts a new instance rather than restoring the unfinished answers.

Impact: a person who needs education can lose their progress precisely when the product should support them.

Recommendation: keep quiz state in the parent journey, or open contextual help without leaving the quiz. Offer an explicit return to the same question. For production, define consent, expiry and deletion before persisting drafts in browser storage.

Acceptance check: enter a product and select a depth, visit Learn, return, and find the same answers and step. Refresh behavior should match a plainly stated policy.

Verification status: source-inspected risk, not reproduced through a browser interaction in this review.

### 2. High: reduce the first question's mobile workload

Evidence: the phone capture shows seven match-experience choices followed by a disclosure and four selectors. Continue appears well below the first viewport. This is more than one simple question.

Recommendation: begin with a short choice: "I know a product I wear" or "Start without one." Reveal the product selectors only for the relevant path. Put match-quality detail after selecting the product, or under optional additional detail. Keep manual entry.

Do not solve this by shrinking text or hiding necessary disclosures. Reduce competing decisions instead.

Acceptance check: the person can immediately identify how to skip product entry. The first meaningful decision does not require scrolling through all match-quality choices.

### 3. High: finish the keyboard and focus behavior

Evidence: custom report, delete and sign-out dialogs declare modal roles, but focus containment, Escape handling and focus restoration are not visible in the inspected implementations. Route changes scroll the window but do not visibly move keyboard focus to the new page heading.

Recommendation: use a proven accessible dialog primitive, set appropriate initial focus, contain Tab navigation, support Escape, and return focus to the trigger. On page changes, update the page title and move focus to the main heading when appropriate. Add a skip-to-content link.

Acceptance check: complete reporting, cancel deletion and navigate between pages using only the keyboard. Focus must remain visible and predictable.

Verification status: code-review finding. A screen-reader and keyboard pass is still required; this is not a WCAG conformance verdict.

### 4. Medium: return people to the task that triggered sign-in

Evidence: a pending Save is preserved, but the simulated account-completion handler routes to Saved. A person who started on a product does not return to that product.

Recommendation: remember the product and originating destination. After the account/security flow, complete the intended save and return to the original detail page with a clear Saved state and a link to the collection.

Acceptance check: Save from product A, complete the account preview, and return to product A. Share should likewise return to the intended draft.

### 5. Medium: make optional questions genuinely skippable

Evidence: continuing from the undertone step requires both an undertone answer and an olive-cast answer. Unsure exists, but selecting two uncertainty responses is still work.

Recommendation: label optional steps explicitly and provide one clear "Skip for now" action that preserves unknown values. Never silently substitute Neutral or a default depth for an unknown answer.

Acceptance check: a novice can reach useful browsing without knowing their product, depth, undertone or olive cast. Required category selection is clearly explained.

### 6. Medium: state the practical benefit sooner

Evidence: the expressive homepage headline is strong, but the supporting text emphasizes exploration without immediately explaining the similar-skin-context benefit.

Recommendation: keep "Makeup is a way to be more you." Add a concrete supporting sentence, such as:

"Neu helps you explore makeup and shade experiences from people with similar skin depth and undertone, with clear guides when you are still figuring things out."

This is proposed copy, not an approved replacement.

Use one consistent primary-action label across the hero, menu and quiz welcome. Keep "starting point, not a guaranteed match" close to the explanation.

### 7. Medium: distinguish a working selector design from a useful catalog

Evidence: formula and shade options are explicitly illustrative, including example A/B labels. That is honest, but it cannot validate whether people can find their actual products.

Recommendation: retain the fixture labels for design review only. Before testing catalog usability, load a small, sourced set of exact products, formulations and shades. Provide searchable selectors and a visible "Can't find mine" path.

Acceptance check: users can distinguish two versions of the same product and understand whether their typed shade is verified or unverified.

## Recommended simplified journeys

### First-time visitor

Home -> Browse products OR optional skin setup -> useful results -> product/shade detail -> Save only when needed -> account/security -> original product.

Learn remains public throughout.

### Unsure visitor

Home -> optional setup -> skip unknowns -> contextual help without losing answers -> editable starting profile -> browsing with uncertainty disclosed.

### Contributor

Product -> Share experience -> account/security if needed -> text-first draft -> visibility review -> publish confirmation -> own note with edit/delete.

Photo publication should remain a separately reviewed later feature, not a prerequisite to contributing.

### Returning member

Sign in/security -> relevant destination or Saved -> product -> optional profile edit. Do not make returning people repeat the quiz.

## GEO review: understandable content for AI search

GEO means generative-engine optimization, not geographic targeting. Here it is useful for evaluating whether Neu's educational content gives clear, attributable answers. It does not determine whether the navigation is usable.

Overall production GEO readiness cannot be established from a canvas prototype. No published domain, indexability, crawler access, search-console data or citation behavior was audited.

### Editorial scorecard

These are subjective checklist scores, not measured search performance.

- Direct answerability: 12/20. Useful explanations exist, but expressive headings often precede the plain definition.
- Authority and citations: 1/20. The inspected Learn component does not provide named sources, expert attribution or a reviewed date.
- Structure and formatting: 16/20. Sections, brief explanations and an interactive lab are easy to scan.
- Topical depth: 13/20. Depth, undertone, olive, color harmony and real-world caveats are covered; dedicated answers and sourced detail are still thin.
- Editorial subtotal: 42/80.
- Technical optimization: not scored. This sandbox intentionally uses preview URLs and JavaScript page switching. Production metadata, schema, performance and crawlability need a separate audit.

Do not convert 42/80 into a citation probability or a claim about rankings.

### Recommended education structure

Keep the expressive Learn introduction, then provide short, self-contained answers under plain questions:

1. What is the difference between skin depth and undertone?
2. Can olive skin be warm, cool or neutral?
3. Why do the same foundation shades look different on different people?
4. How can I compare shades in daylight?
5. How do complementary and analogous colors work in makeup?
6. Why do formulas and oxidation change the result?

Add named, verified sources and a real editorial owner or reviewer where available. Include a reviewed date only when someone actually reviews the content. Do not invent credentials, expert quotes, statistics or product claims to improve a score.

### Production requirements, not prototype clutter

- Give public education topics stable, distinct URLs.
- Use real links for page navigation, not only onClick handlers.
- Publish accessible HTML with readable headings and descriptive titles.
- Verify canonical URLs and sitemap against the actual published domain.
- Add accurate Article or Organization structured data only where it matches visible content.
- Do not attach fabricated offers, ratings or reviews to example products.
- Do not promise AI citations or search enhancements from schema.
- Do not index draft account, moderation or sample-content preview screens as finished public resources.

## Design standards: what is and is not established

Established through this review: a consistent brand direction, reduced top-level navigation, readable main mobile copy in the inspected screen, clearly labeled examples, and useful uncertainty choices.

Not established: WCAG AA contrast throughout, focus-order correctness, screen-reader usability, narrow-screen behavior on every page, production performance, or end-to-end account and data safety.

Some small utility labels still look faint and small. Check their computed styles and contrast before approving the full design. Do not shrink reading text to fit more controls.

## Proposed next pass

1. Protect unfinished quiz progress and make help return to the same step.
2. Shorten the existing-product step using progressive disclosure.
3. Correct dialog/page focus and the sign-in return destination.
4. Standardize action labels and clarify the homepage benefit.
5. Add sourced, answer-first Learn sections during public-site implementation.

No visual rebrand is recommended.

## Small validation plan

Recruit a small mix of makeup beginners and experienced users, including people unsure of their undertone and people across the depth range. Five initial sessions are a practical starting point, not proof of population-wide usability.

Ask participants to:

1. Explain what Neu does after viewing the homepage briefly.
2. Find a product without creating an account.
3. Complete setup while unsure of undertone.
4. Open Learn midway and resume without losing answers.
5. Save a product and identify where they return.

Proposed success threshold: at least four of five complete each core task without coaching, with no lost answers or mistaken belief that a sample is a verified recommendation. This is a proposed test criterion, not a result.

Record completion, wrong turns, requests for help, lost-input events and descriptions of what users think "match" means. Do not log unnecessary personal skin notes or security codes.

## Sources and implementation evidence

External guidance:

- W3C WAI, Multi-page Forms: https://www.w3.org/WAI/tutorials/forms/multi-page/
- W3C ARIA APG, Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Nielsen Norman Group, Four Principles to Reduce Cognitive Load in Forms: https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/

Local source evidence:

- `SiteChrome.tsx`: primary navigation, menu and preview notice.
- `QuizFlow.tsx`: local answer state, validation, selector reset behavior and step navigation.
- `WebsiteJourney.tsx`: page switching, scroll behavior, deferred save/share handling and simulated account return.
- `LearnProfilePages.tsx`: definitions, color lab, uncertainty and real-world caveats.
- `AccountSafetyPages.tsx` and `MemberPages.tsx`: inspected custom modal implementations.
- All source paths above are under `artifacts/mockup-sandbox/src/components/mockups/neu-website-journey/`.
