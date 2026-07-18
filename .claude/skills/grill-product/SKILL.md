---
name: grill-product
description: "Analyze an existing product, then grill, challenge, and push back on it to make it sharper — or shape a new product idea from scratch. Use when the user wants to pressure-test, improve, or stress-test a product, decision, feature, spec, or PRD, or asks to grill a product."
---

# Grill Product

Make an existing product sharp enough to win, and a new product decision sharp enough to build. The goal is improvement, not interrogation for its own sake: when AI makes execution cheap, *what to fix* and *what to build* is the decision that matters.

Optimized for brownfield — analyzing and improving real, built products. It also shapes new ideas from scratch when there is no product yet.

## Pick The Mode

- **Existing product (primary)** — there is a built product, feature, spec, PRD, repo, or live experience. **Analyze it first, then grill, challenge, and push back to improve it.** Do not critique before you understand what it does, who it serves, and where value is reached or lost.
- **New product** — only an idea or a problem. **Start from scratch** and grill the decision into shape.

Default to the existing-product track unless the user clearly has only an idea. When unsure, ask once.

## How To Run It

1. Read [references/steps.md](references/steps.md) and run the track for the detected mode.
2. Pull questions from [references/lenses.md](references/lenses.md) — only the lenses that fit the decision, not all five.
3. Consult [references/frameworks.md](references/frameworks.md) when a lens needs a named framework (MOAT, selling motion, value metric, product shape, tradeoff axes).

Core rules:

- Grill one question at a time, each with your recommended answer.
- Self-answer from the product, repo, data, or web when you can. Tag every finding verified / provided / assumed (see steps.md).
- Gather real outside voices — users, market, competitors — via web search, `gh`, and other tools, fanned out to subagents (see [references/outside-voices.md](references/outside-voices.md)). Don't grill on assumptions when evidence is reachable.
- Ask the user only when a missing input would change the decision.
- Treat what users and stakeholders say as a signal to interpret, not an answer to accept.
- In a single non-interactive turn, lead with the analysis, the brief-so-far, and the top unresolved question — do not fake closure (see steps.md rhythm).

## Effort Levels

Scale the grill to the ask. Default to `standard`.

| Level | Lenses | Outside voices | Depth | Output |
|-------|--------|----------------|-------|--------|
| `quick` | 1–2 highest-risk | skip | a few questions | findings inline, no brief |
| `standard` | 2–3 by weakness | one sweep | full grill | Sharpened Brief |
| `deep` | all relevant | full fan-out + vet | exhaustive, iterate | Sharpened Brief + evidence |

## Common Mistakes

- Grilling before understanding the product (skip analysis in Track A).
- Accepting the user's framing instead of interpreting the signal behind it.
- Running all five lenses by default instead of the ones that fit.
- Producing a long report instead of one-question-at-a-time pressure.
- Spreading pressure evenly instead of hitting the weakest part.
- Going through the motions — ending with "looks good" and no committed action.
- Faking closure instead of naming open risks and a verdict.

## Scope Boundaries

Use this to analyze and improve a product decision, or to shape a new one. Route elsewhere when the request is different:

- Critique of an existing built UX surface only: use `ux-reviewer`.
- Copy-only writing or review: use `ux-content` or `copywriting`.
- Code, PR logic, or implementation review: use a code review skill.
- Generic plan or design grilling not specific to product: use `grill-me`.
- Generating new UX concepts from scratch: use a concept/design skill.
