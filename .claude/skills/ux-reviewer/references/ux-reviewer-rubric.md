# UX Reviewer Rubric

This rubric is based on Anne's "UX Fundamentals in an AI-Driven World" session. Use it to critique an existing experience with human judgment, not to generate generic design advice.

## Core Thesis

AI can generate many solutions quickly. UX judgment is deciding whether a solution is actually good for humans in context.

Good UX holds the user's hand through the obvious, the stressful, and the unfamiliar. Do not dismiss basic guidance as unnecessary; a road-crossing cue, a floor line to a hospital, or a clear next step can be the whole experience.

## Audit Lenses

### 0. Product Context And Design System

Before judging a local implementation, inspect the product's own visual language: CSS variables, tokens, theme files, representative components, or existing screens. Critique against the user's goal and the product's system before importing outside taste.

- Is the surface using existing components, tokens, and interaction conventions where they work?
- Are deviations intentional and useful, or just one-off drift?
- Does the critique distinguish system-level problems from local implementation mistakes?
- If there is no committed design system, does the UI make a clear choice rather than defaulting to generic AI-safe styling?

Red flags: one-off colors, random radius/shadow values, local components duplicating existing ones, new visual language for one screen only, critique that ignores the product's actual register.

### 1. Journey Continuity

Check whether the product works as one journey, not isolated screens.

- Does the user know where they are, what just happened, and what comes next?
- Does the user know their current location, available destinations, and how to return?
- Can the user recover from rejection, timeout, bad input, payment failure, or missed deadline?
- Does the experience force an unnecessary channel switch: online to paper, product to email, app to support, digital to physical?
- Is there a clear way back?

Red flags: dead ends, refund/check-style burden shifting, status hidden in transient messages, process resets, confusing deadlines, obstructive popups, icon-only navigation without tooltips or labels.

### 2. UX Pyramid

Judge lower levels before delight.

| Level | Question |
| --- | --- |
| Functional | Does it work as promised? |
| Reliable | Is it available, accurate, and resilient? |
| Usable | Can the user complete it without difficulty? |
| Convenient | Does it feel intuitive and low-effort? |
| Pleasurable | Is it polished or memorable without hurting use? |
| Meaningful | Does it respect the user's real goal and context? |

Never praise visual polish that breaks function. The classic failure mode is beautiful hardware or UI that becomes unusable at the moment the user needs it.

### 3. We Are Not Our Users

Actively look for designer-environment bias.

- non-Apple devices and visible scrollbars
- `Ctrl` patterns before `Command` assumptions
- short viewports and browser chrome reducing usable space
- users with less domain knowledge than the team
- users under stress, fatigue, low vision, or interruption
- users who do not share internal terminology

Viewport check: if only a large designer monitor was considered, assume risk. A 900px screen height can leave roughly 750px of real browser viewport.

### 4. Behavioral Quality

Ask what behavior the UI encourages.

- Does it make the desired action easier than the undesired one?
- Does it reduce cognitive memory load by keeping key information visible together?
- Does it make high-value actions easy to discover and low-risk to perform?
- Are destructive or expensive actions protected without adding ceremony everywhere?

Good behavior design changes what users do, not just what they see.

### 5. Cognitive Load

Audit the mental effort the interface imposes. Some task complexity is real, but design-created complexity is waste.

- Single focus: can the user complete the primary task without competing elements stealing attention?
- Chunking: are decisions and information grouped into digestible sets, ideally no more than about four items at once?
- Working memory: must the user remember information from another screen, modal, or earlier step?
- Visible choices: are options discoverable without hunting through hidden controls?
- Context switching: does one decision require jumping between tabs, pages, panels, or documents?
- Jargon: does terminology force translation before action?

Red flags: 5+ equally weighted choices, plan cards that require side-by-side memorization, hidden navigation, repeated back-and-forth between screens, multiple simultaneous decisions, dense copy with no chunking, technical labels on user-facing actions.

### 6. Gestalt And Scanning

Use perception laws to explain why the page feels clear or messy.

- Proximity: related things should be physically close; spacing should create hierarchy.
- Similarity: similar visual treatment should mean similar behavior or importance.
- Continuity: the eye should follow a smooth path through the flow.
- Scanning: important work should fit expected scan paths, often starting top-left.
- Von Restorff effect: the important item should stand out from peers through contrast, size, shape, label, or badge.

Red flags: unrelated controls grouped together, related controls split apart, repeated styles meaning different things, vital context below the fold, recommended or primary choices that blend into the background.

### 7. Action Mechanics

Use Fitts's Law and interaction clarity.

- Are primary targets large enough and close enough to the user's path?
- Is the primary CTA visually dominant without hiding secondary needs?
- Are icons understandable, or would text outperform them?
- Are popovers, arrows, labels, or persistent hints needed for navigation?

Do not worship icons. Exposed text can beat clever pictograms when the action must be unmistakable.

### 8. Usability Heuristics

Use Jakob Nielsen's heuristics as a practical foundation check, especially when a finding does not fit a narrower visual law.

- Is system status visible?
- Does the product match user language and real-world expectations?
- Can users undo, escape, and recover?
- Are labels, layouts, and behaviors consistent?
- Does the design prevent errors before it asks users to fix them?
- Are instructions and options visible instead of requiring memory?
- Are errors plain-language, specific, and solution-oriented?

Red flags: hidden progress, unclear save/publish state, irreversible actions without warning, inconsistent terms, vague errors, controls whose meaning depends on prior knowledge.

### 9. Screen States

Every important screen has multiple states. Audit the experience beyond the happy path.

- Blank: does the first-use state explain what will appear, why it is empty, and how to start?
- Loading: does progress communicate what is happening without freezing the whole interface?
- Partial: can useful content remain available when one section fails or is still loading?
- Error: does the message explain cause, responsibility, and recovery?
- Ideal: does the polished state still work with real content, not only demo data?

Red flags: full-page spinners for long operations, empty pages with no first action, one failed panel breaking the whole view, "Something went wrong" without a next step, demo-perfect layouts that collapse with real content.

### 10. Craft And Visual Hierarchy

Borrow craft checks from frontend design critique, but keep the finding tied to user comprehension or task completion.

- Contrast: body text should be comfortably readable; muted text on tinted backgrounds often fails.
- Typography: line length should stay readable; display type should not overflow or feel cramped.
- Spacing: rhythm should guide hierarchy; related items belong together and unrelated items need air.
- Layout: cards, borders, and shadows should clarify grouping, not decorate by reflex.
- Motion: animation should explain state or guide attention; reduced-motion alternatives matter.
- Interaction: dropdowns, popovers, tooltips, modals, and menus should not clip, hide, or jump away from the user's path.
- Responsive behavior: test narrow and short viewports; the viewport is part of the design.

Red flags: nested cards, identical card grids, arbitrary huge border radii, soft shadow plus border on every surface, clipped menus inside scroll containers, CTA below the fold, text overflow on mobile, motion-gated content that can render blank.

### 11. AI-Generated Design Tells

Flag AI-looking patterns only when they hurt trust, clarity, or distinctiveness. The point is not aesthetic snobbery; the point is that generic design makes products feel unowned.

- Does the UI look like the category default rather than this specific product?
- Are gradients, glass, decorative SVGs, giant rounded cards, or repeated section formulas doing actual work?
- Are badges, metrics, numbered sections, or card grids used because the content needs them, or because the design needed filler?
- Is the palette a committed product choice, or a safe monoculture default?

Red flags: gradient text, decorative glassmorphism, repeated icon-card grids, hero-metric templates, numbered eyebrows without real sequence, sketchy fallback illustrations, near-white warm-neutral palettes with no brand reason.

### 12. Content Reality

No lorem ipsum. No fake hierarchy from fake text.

- Does the page use real content that proves hierarchy and layout?
- Are terms consistent across the journey?
- Are errors meaningful and solution-oriented?
- Do labels name what users think they are doing, not what the system calls it?

If the design cannot survive real content, it is not done.

### 13. Interruption And Status

Pop-ups often create anxiety because they block content and disappear.

- Prefer persistent status when the user may need to return later.
- Use toasts only for non-blocking, low-stakes feedback.
- Avoid celebration modals that replace useful progress, next steps, or recovery.
- If users need to remember what happened, keep it visible.

### 14. Billing And Paywall Trust

Upgrade, payment, and billing surfaces need extra clarity because the user is making a money decision while often trying to complete another task.

- Explain why the paywall appeared now.
- Preserve and reassure progress: drafts, unpublished changes, selected settings, and return path.
- Make plan differences scannable without memory load.
- Keep the primary CTA visible in constrained viewports.
- Make dismissal and continuation behavior explicit.
- Show payment reassurance without visually muting trust signals that users depend on.
- Avoid gray, hidden, or tiny cues around cost, renewal, cancellation, or consequences.

Red flags: payment logos visually de-emphasized by accident, primary CTA below the fold, no explanation of what happens after close, nearly identical plans with no decision support.

### 15. Persona Red Flags

Check the roast against concrete user lenses rather than an abstract "average user."

- First-timer: can they understand where they are and what to do next?
- Power user: can they move efficiently without being trapped in hand-holding?
- Mobile or short-viewport user: can they reach the key action and context?
- Low-vision user: are cues, contrast, and focus states strong enough?
- Stressed or interrupted user: can they recover state and resume safely?
- Domain novice: does the product explain terms and consequences in user language?

Red flags: onboarding that blocks experts, expert shortcuts that hide basics, mobile CTAs below the fold, state lost after interruption, jargon-heavy errors, critical cues conveyed only by low-contrast color.

### 16. Business Impact

Small UX details can carry real money.

- Color contrast can redirect attention or damage conversion.
- Splitting a complex choice into focused steps can lift completion.
- Replacing an ambiguous icon with explicit text can unlock feature usage.
- Navigation affordances can affect premium conversion and readiness metrics.

When business impact is plausible, recommend the metric to measure instead of inventing numbers.

### 17. Agentic And Conversational Trust

Apply when the surface is an AI agent, assistant, copilot, chatbot, or any probabilistic feature that acts or advises on the user's behalf. For these, usability is the baseline and trust is the bar. Usability asks "can the user complete this?"; trust asks "should the user rely on this output?". A usable agent that produces unverifiable or wrong results is a liability, not a feature.

Judge the trust pyramid bottom-up; a higher level cannot compensate for a missing lower one.

| Level | Question | Failure if missing |
| --- | --- | --- |
| Reliability | Does it work consistently and predictably? | random results erase all higher trust |
| Honesty | Does it tell the truth, including "I don't know"? | a reliable liar is a reliable source of misinformation |
| Transparency | Can the user see what it did and why? | black-box output the user cannot validate |
| Agency | Can the user steer, edit, undo, or stop it? | a runaway process with no exit |
| Benevolence | Does it act in the user's interest? | optimizes for the system, not the user |

Six conversational checkpoints:

- Understanding: can the user tell what the agent is doing and saying without decoding jargon or guessing state?
- Control: can the user steer, pause, correct, or override before and during an action?
- Recovery: can the user undo or recover from the agent's mistakes and their own, especially on high-stakes actions?
- Limits: does the product state what the agent can and cannot do before the user hits the wall?
- Data handling: is it clear what data is collected, sent, stored, and used to act?
- Reliability evidence: is there visible proof of accuracy (citations, sources, confidence, verifiable steps) rather than a confident tone alone?

Map intent to outcome across the loop: Goal (was intent captured, or did it drift?), Interface (were the agent's affordances and boundaries visible?), Attempt (was the action precise?), Outcome (was success or failure reported honestly and immediately?). Friction usually appears where the agent's internal logic diverges from the user's mental model.

Red flags: confident answers with no source or way to verify, no undo on agent-taken actions, no stop or pause on long autonomous runs, hidden or silent data use, no statement of limits so users discover them by failure, "thinking" with no visible progress or reasoning, hallucinated certainty, irreversible actions taken without confirmation, tone that implies human reliability the system has not earned.

## Finding Calibration

Use the strongest applicable evidence:

- observed: visible in the UI, screenshot, prototype, or recording
- code-backed: confirmed in implementation
- data-backed: confirmed by analytics, support tickets, or experiment result
- inferred: plausible from heuristics, needs validation

Do not mix these together. A sharp review is stronger when it is true.

## Common Finding Types

| Type | What to look for | Fix direction |
| --- | --- | --- |
| Missing hand-holding | user must infer a basic next step | add persistent cue, label, guide line, stepper, or default |
| Fragmented journey | flow jumps channels or loses state | keep status in-product, preserve progress, simplify handoff |
| Designer bias | assumes large Mac viewport or expert knowledge | test constrained viewport, adjust shortcuts, expose scroll/state |
| Visual over function | polish blocks use | prioritize operability over visual purity |
| Memory load | user must remember facts across panels | keep needed context visible together |
| Cognitive overload | too many equal choices or simultaneous decisions | group, sequence, recommend, or progressively disclose |
| Fake content | layout only works with placeholders | use real content and revise hierarchy |
| Weak recovery | error states blame or dead-end | explain cause, next step, and recovery path |
| Pop-up anxiety | blocking modal with no durable record | use persistent status or inline feedback |
| Invisible priority | important choice does not stand out | add contrast, badge, copy, placement, or hierarchy |
| Craft slop | visual treatment distracts from the task | simplify, align to tokens, improve hierarchy, remove decoration |
| Missing state | happy path exists but blank/loading/error states do not | design the missing state with guidance and recovery |
| Trust black box | agent output with no visible logic or source | expose reasoning, citations, or steps the user can inspect |
| No agency | user cannot stop, undo, or override an agent action | add stop/pause, edit, undo, and confirmation on high-stakes steps |
| Confident hallucination | wrong or unverifiable output delivered with certainty | show uncertainty, cite sources, and let the user verify |
| Undeclared limits | user discovers what the agent cannot do by failing | state capabilities and boundaries up front |
| Silent data use | unclear what data is collected or sent | disclose collection, storage, and usage in context |
