# Steps

Two tracks. Pick by mode (see SKILL.md). Both end in the same brief.

A note on rhythm: grilling is conversational — ask one question at a time and follow the weak parts of the decision. The **brief is the running state**, not a one-shot dump. On each turn, lead with the single highest-leverage open question (and your recommended answer); update the brief as decisions resolve; finalize it only when the decision clears the build bar. In a single non-interactive turn, present the analysis, the brief-so-far, and the top unresolved question — do not fake closure.

Escape hatch: if the user pushes back on the one-at-a-time style or says "just give me the answer," switch to direct mode — present all findings and the brief at once, recommendations included. The grill serves the decision, not the format.

Evidence levels: tag every finding and analysis claim as one of:

- **verified** — read directly from a primary source: code, the live product, real data the user pointed to, or a subagent that opened the source and returned a verbatim quote with its URL. Source-backed, not memory.
- **provided** — stated by the user or a document, not independently confirmed.
- **assumed** — inferred. Flag it, and don't present it as fact; if an assumption would change the decision, ask.

Source precedence when they conflict: source/code/data > user-provided context > docs > inference.

Question format: ask one question at a time, each in this shape —

> **Question:** <one concrete decision question>
> **Why it matters:** <what downstream depends on it>
> **Recommended:** <best answer from current evidence> · <verified | provided | assumed>

Concentrate pressure on the weakest part of the decision; do not grill every corner with equal force.

---

## Track A — Existing Product (analyze, then grill)

The order matters: understand before you challenge.

### A1. Analyze first

Understand the product before challenging it. Quality of the grill depends entirely on quality of this read.

1. **Resolve sources.** Use the richest available: repo/code, the live product, PRD/spec, analytics or support data the user points to, the web. Note what you could and could not reach.
2. **Scope it.** If the product is large, agree on the area under grill (a feature, a flow, a tier) rather than boiling the ocean. Grill the part that matters now.
2a. **Gather outside voices.** Fan out subagents to collect real external evidence — user sentiment, requests, competitor moves, market view (see [outside-voices.md](outside-voices.md)). Do this before challenging tradeoffs or GTM.
3. **Write the current read** — in plain business language, not implementation detail:
   - **What it does** and the capability it gives the user.
   - **Who it is for** — which segment, in which reality (see frameworks.md, Name The Segment).
   - **Where value is reached, lost, or delayed** across discover → understand → experience → trust → pay (see frameworks.md, Value & GTM Funnel).
   - **Its current shape** — Guided, Suggested, or Open — and whether that looks deliberate or accidental.
   - **The signals around it** — classify them (see frameworks.md, Signal Taxonomy).
4. **Tag every claim** verified / provided / assumed (see Evidence levels above).
5. **Name the core assumption** — the single belief that, if false, sinks the product or the investment. One sentence, not a list. If you can't compress it to one, the decision is bundled; separate it first. Everything downstream pressure-tests this.

**Checkpoint:** present the current read briefly and invite correction before challenging. Grilling a wrong picture wastes the session. In a non-interactive turn, state the read and flag the assumptions a wrong read would hinge on, then proceed.

### A2. Route to lenses

Classify what is weakest in the analysis and pick the lenses that fit (lenses.md). Common existing-product entries:

- Value reached late or unreliably → Signal Reading, First Experience.
- Feature sprawl, unclear bar, no defended tradeoffs → Tradeoffs & Shape.
- Growth or monetization stalling → GTM & Pricing.
- "We keep adding things users asked for" → Signal Reading, Framing.

### A2.5. Steelman before challenging

State the product's thesis in its strongest form — the best case for why it is built the way it is — before attacking it. Challenges aimed at the strongest version are the ones worth defending against; straw-manning produces cheap findings the team will rightly ignore.

### A3. Grill, challenge, push back

Now apply pressure, aimed at improvement:

- Challenge the strongest assumption the product is built on. Is it still true?
- Find the faster-horse: which built feature answers what users said rather than what they need?
- Force the tradeoffs the product never made explicit — and whether they are still the right ones.
- Name what should be cut, not only what to add. Strategy is the tradeoffs you defend, not the list of everything shipped.
- Test the current shape (Guided/Suggested/Open): is it the product's opinion, or an accident?

### A4. Resolve and brief

Drive each thread to a decision or a labeled open risk. Stop at the build bar (below). Output the brief, end with a verdict, and push for one committed action with a date — don't let it end as insight theatre.

---

## Track B — New Product (from scratch)

### B1. Find the target

Identify the idea or problem. If nothing concrete is given, ask once for it. Treat the request as a claim to interpret. Name the **core assumption** — the one belief that, if false, kills the idea (one sentence) — before going further.

### B2. Route to lenses

Greenfield usually starts with **Signal Reading** (is the problem real and correctly read?) and **Framing** (does it deserve to exist, what is it). Add Tradeoffs & Shape, GTM & Pricing, First Experience as the decision matures.

Before committing to the problem, gather outside voices (see [outside-voices.md](outside-voices.md)) to test whether it is real for anyone but you, and how others already solve it.

### B3. Grill into shape

Walk the decision tree one question at a time, recommended answer each, self-answering where you can. Drill dependencies before moving sideways.

### B4. Resolve and brief

Stop at the build bar. Output the brief, end with a verdict, and push for one committed action with a date.

---

## Build Bar

A decision is sharp enough to build when:

- the real problem is named (signal interpreted, not just restated),
- the core assumption is named and survives scrutiny,
- scope in and out is defined,
- success and the quality bar are set,
- the tradeoffs are explicit and defensible,
- what must never happen is stated.

**Stop** when any holds: the bar above is cleared, the user says stop or asks for the brief, all high-risk unknowns are resolved (remaining ones are low-risk and tagged `assumed`), or the decision is clearly not ready and you can hand back a short blocker list. Name what is still unresolved rather than forcing false closure.

**Deal-breakers (recommend against building, regardless of polish):** no identifiable user segment; the core assumption is false or unverifiable and load-bearing; the value metric fails all three tests; the product has no defended opinion (shape is purely accidental); it is a vitamin sold as a painkiller with nothing that would change that. Surface these instead of sharpening a fundamentally flawed decision.

End with a one-line **verdict:** ready · ready with assumptions · not ready.

---

## Output — Sharpened Brief

```md
## Product Grill — Sharpened Brief

**Status:** in progress | final
**Verdict:** ready | ready with assumptions | not ready
**Mode:** existing | new
**Decision / product:** <what was grilled>
**Lenses run:** <which of the five>
**Evidence mode:** <repo-backed | data-backed | live-product | web-backed | assumptions>

### Core Assumption
<the one belief that, if false, sinks this — and whether it survived scrutiny>

### Current Read   (existing mode only)
<what it does, who for, where value is lost; observed vs assumption>

### Real Problem
<signal observed → interpreted need; flag if it is a "faster horse">

### Why It Deserves To Exist / Keep Investing
<the problem worth solving, or why it should be cut or reshaped>

### What We're Building / Changing
- In scope: <…>
- Out of scope / cut: <…>
- Success looks like: <…>
- Quality bar: <…>
- Must never happen: <…>

### Tradeoffs Defended
- <axis (e.g. Speed↔Quality)>: <choice and why>

### Product Shape
<Guided / Suggested / Open — and why; applies to AI products too>

### GTM & Pricing        (omit if lens not run)
<MOAT fit, selling motion, value metric>

### First-Value Moment   (omit if lens not run)
<how a user reaches value fast, clearly, confidently>

### How To Validate
- <key metric or signal that proves the change worked, and the data source to check>
- <an `assumed` claim above and the cheapest way to confirm it>

### Open Risks & Assumptions To Verify
- <unresolved decision or labeled assumption> · severity: <deal-breaker | major | minor>

### What This Grill Likely Missed
<one category of risk this session did not cover well — regulatory, operational, second-order, a segment not heard from>

### Committed Action
<the one change the user will act on first, with a date — or their reasoned refusal. Don't accept "all of them.">
```

Omit sections whose lens you did not run. Keep it tight; it is a decision record, not a report.
