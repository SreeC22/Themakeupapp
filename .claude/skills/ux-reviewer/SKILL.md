---
name: ux-reviewer
description: "Review an existing UX flow, screen, prototype, screenshot, or live product. Use when the user asks for a UX reviewer, UX audit, UX roast, brutal UX review, or to tear apart a flow."
---

# UX Reviewer

Run a sharp, evidence-backed UX review of an existing experience. Question the surface before judging it, then explain what works, what does not, why it matters, and what to fix first. When the user asks for a roast, use a sharper tone, but critique the experience, not the people.

## Scope Boundaries

Use this for critique of an existing experience. Route elsewhere when the request is narrower or earlier-stage:

- Copy-only writing or review: use `ux-content`.
- Data-mined quick wins from support or analytics: use `ux-quickfix`.
- Visual polish or implementation detail without journey/usability critique: use `make-interfaces-feel-better` or a visual/design review skill.
- Code architecture, PR logic, or implementation review: use a code review skill.
- New UX concepts from scratch: use a concept/design-generation skill.

## Workflow

### 1. Collect The Surface

Use the richest available artifact: live URL, app route, screenshot, video, Figma frame, PR preview, or local implementation. If the user has not provided any reviewable surface, ask once for a URL, screenshot, Figma link, or flow description.

When a live UI is available, inspect it directly. Capture the actual viewport constraints when possible; desktop screenshots alone are not enough for responsive products.

If the only artifact is a written description, continue. Label evidence as `provided description` instead of implying direct observation, and list what a live review should verify.

If reviewing a local repo or implementation, inspect at least one existing design-system surface before judging: CSS/tokens/theme, a representative component, or the page under review. Preserve the product's actual system when it works; roast deviations and gaps, not merely differences from personal taste.

### 2. Load The Rubric

Read [references/ux-reviewer-rubric.md](references/ux-reviewer-rubric.md). Use it as the audit checklist and severity guide.

### 3. Question The Surface

Before forming the verdict, challenge the artifact like a reviewer:

- What is the user trying to accomplish here?
- What does the screen assume the user already knows?
- Which primary action, status, consequence, or way back is unclear?
- Which states are missing from the evidence: empty, loading, error, permission, payment, interruption, return visit?
- Which element looks intentional but may be decorative, misleading, or unsupported by the journey?
- What evidence would change the judgment?

Answer these from the artifact when possible. Carry the most important answers into `Reviewer Questions`. If the artifact does not provide enough evidence, label the gap instead of turning it into a finding.

### 4. Build A User Journey

Identify:

- user goal
- starting context
- intended success state
- primary path
- edge states: empty, loading, error, permission, payment, interruption, return visit
- constraints the team may be ignoring: device, viewport, keyboard, scrollbars, accessibility, weak domain knowledge, stress, or time pressure
- likely user personas affected: first-timer, power user, mobile user, low-vision user, stressed or interrupted user, domain novice

State assumptions briefly. Do not pretend user research exists if you only have heuristic evidence.

### 5. Audit The Experience

Do the manual UX judgment pass first. If implementation, browser, accessibility, visual-diff, or detector evidence is available, use it after the manual pass to confirm, refute, or sharpen findings. Do not let deterministic tooling replace judgment.

Review the surface against the rubric:

- hand-holding and wayfinding
- functional, reliable, usable foundations
- convenience, pleasure, and meaning
- "we are not our users" constraints
- Gestalt grouping, similarity, and continuity
- scanning, target size, and action distance
- content hierarchy and real words
- cognitive load: single focus, chunking, memory burden, visible options, context switching
- errors, empty states, and recovery paths
- navigation, interruptions, and "way back"
- paywall or billing trust: consequences, draft safety, payment reassurance, cancellation, plan comparison, dismissal behavior
- agentic and conversational trust (apply only for AI agents, assistants, copilots, or chatbots): reliability, honesty, transparency, agency, benevolence; understanding, control, recovery, limits, data handling, and verifiable reliability over confident tone
- craft checks: contrast, typography, spacing, layout rhythm, motion purpose, interaction mechanics, responsive behavior
- generic AI-design tells: identical card grids, decorative glass/gradients, arbitrary huge radius/shadows, fake visual hierarchy, content hidden by animation
- business-impact risks

Only make findings you can point to in the artifact. If the issue is inferred, label it as inferred and name what would verify it.

### 6. Craft Detail Pass

When reviewing a live UI, screenshot, or implementation, run a small craft pass after the journey/usability review. Use it to sharpen findings, not to turn UX Reviewer into a visual polish skill.

Check for:

- nested surfaces with non-concentric border radius
- icons or icon buttons that look geometrically centered but optically off
- border/shadow choices that add noise instead of clarifying surface depth
- interactive animation that is not interruptible or uses `transition: all`
- entrance or exit motion that hides content, steals focus, or lacks reduced-motion care
- tiny controls below a 40x40px hit area or overlapping hit targets
- dynamic numbers without tabular numerals when layout shift matters
- headings or short body copy with awkward wrapping or orphaned words
- images/media without subtle separation from the background
- visible first-frame stutter from transform, opacity, or filter animation

For visual-only or code-polish tasks, route to `make-interfaces-feel-better`. If UX findings include concrete implementation changes, summarize them in `Craft Diffs`.

### 7. Review Then Repair

Use a blunt but constructive tone. Good review:

- cites the exact screen, element, step, or observed behavior
- explains the user harm
- names what works when the artifact earns it
- gives one concrete fix direction
- keeps any roast-style jokes short enough that the finding remains the point

Avoid vague judgment like "confusing" unless followed by the specific cognitive load, missing cue, false affordance, or dead end.

### 8. Output Format

Use this structure:

```md
## UX Review

**Verdict:** PASS / NEEDS WORK / PAINFUL / USER-HOSTILE
**Surface reviewed:** <URL, file, screenshot, flow, or description>
**Coverage checked:** <journey, hierarchy, states, responsive, accessibility-adjacent, content, craft, billing trust, agent trust if applicable>
**Evidence mode:** <provided description | screenshot | live browser | code-backed | detector-backed>
**Assumptions:** <short, omit if none>

### Reviewer Questions
- **<question that shaped the review>** <answer, observed evidence, or gap>
- **<question that shaped the review>** <answer, observed evidence, or gap>

### Top Findings
1. **<finding title>** — <screen/element/step>
   - Read: <one sharp sentence explaining the issue>
   - Evidence: <what you observed>
   - User harm: <why this hurts>
   - Fix: <specific direction>

### What Works
- <1-3 real strengths, if any>

### Craft Diffs
| Principle | Before | After |
| --- | --- | --- |
| <craft principle, omit table if no implementation-backed changes> | <observed issue> | <specific fix direction or changed property> |

### Persona Red Flags
- <1-3 concrete persona failures, omit if none>

### Fix Order
1. <highest leverage fix>
2. <next fix>
3. <next fix>

### What To Measure
- <metric, support signal, or usability test prompt>

### Run Notes
- <what was inspected, what could not be verified, and any detector/browser limits>
```

If there are no meaningful issues, say so plainly and still name the constraints checked.

Omit `Craft Diffs` when the review is not implementation-backed or when craft details did not materially affect the UX judgment.

Keep `Top Findings` to 3-7 findings. If more issues exist, group related ones instead of turning the review into a warehouse inventory.

## Severity

- `USER-HOSTILE`: blocks completion, hides money/legal consequences, traps the user, or makes recovery impossible.
- `PAINFUL`: completion is possible but requires guesswork, memory load, repeated correction, or unnecessary mode switches.
- `NEEDS WORK`: understandable but cluttered, weakly prioritized, inconsistent, or missing reassurance.
- `PASS`: clear path, good recovery, strong hierarchy, and suitable constraints coverage.

For billing or paywall reviews, use `USER-HOSTILE` only when the artifact shows or strongly implies trapped completion, hidden or misleading money consequences, lost work, or impossible recovery. Use `PAINFUL` when the main issue is uncertainty, weak reassurance, poor plan comparison, or constrained-viewport friction.

For agentic or conversational reviews, use `USER-HOSTILE` when the agent takes irreversible action with no stop or undo, hides money, legal, or data consequences, or presents unverifiable output as certain on a high-stakes task. Use `PAINFUL` when the main issue is opacity, weak control, missing limits, or no way to verify a result the user must rely on.
