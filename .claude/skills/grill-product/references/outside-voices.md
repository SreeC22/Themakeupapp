# Outside Voices

Ground the grill in real external evidence, not just the room's assumptions. Outside voices are how you keep the product's context alive — what users actually do and say, what competitors change, how the market moves. The goal is not more information; it is sharper judgment.

Gather them with tools, and fan the work out to subagents so the main thread stays focused on the grill.

## When to gather

- During Track A analysis (A1) and before challenging tradeoffs or GTM.
- During Track B framing, to test whether the problem is real for anyone but you.
- Skip or trim when the user explicitly wants a fast, internal-only sanity grill, or when the product is confidential and external lookup would leak it. Say what you skipped.

## Channels and tools

Pick the channels that fit the product. Use whatever is available; degrade gracefully when a tool is missing.

- **User sentiment** — web search for reviews and discussion: review sites (G2, Capterra, Trustpilot, app stores), Reddit, Hacker News, YouTube, niche forums. A social/X MCP if connected, for live sentiment. Use **site-scoped queries** to reach primary threads, not aggregators — e.g. `site:news.ycombinator.com <product>`, `site:reddit.com <product> pricing`. A bounded generic search lands on second-hand summaries; tag those `provided`, not `verified`.
- **Requests and bugs** — `gh` on the product's own repo and competitors' open-source repos. To rank by community demand you need reaction counts, which `gh issue list` does not expose; use the search API and sort by reactions:
  - `gh api -X GET search/issues -f q='repo:OWNER/REPO is:issue is:open' -f sort=reactions -f order=desc --jq '.items[] | {reactions: .reactions.total_count, title, url}'`
  - also `gh search issues`, discussions, and PRs labeled feature-request / bug. Real issues are strong, behavior-backed signals.
- **Competitor moves** — web search for changelogs, pricing pages, launch/announcement posts, docs. `context7` MCP for library/API/SDK docs when the product is developer-facing.
- **Market and expert view** — analyst notes, expert essays, published frameworks; recent (prefer last 1–2 years), exact quotes over paraphrase.

## Fan out with subagents

Pick the 2–3 channels most likely to hold signal for this product, and dispatch one subagent per chosen channel, in parallel, in a single message — that is the `standard` "one sweep." Go wider only at `deep` effort. This keeps tool output and large dumps out of the main context, and leaves budget for spot-checking.

- Give each subagent a tight brief: the product, the question, the channel, and the return shape below. Do **not** tell it the conclusion you expect — let the evidence land.
- Each subagent returns a compact digest, not raw pages:

  ```md
  - **Signal:** <one line> | **Type:** <Signal Taxonomy type> | **Strength:** <volume × recency × effort>
    **Source:** <url or `gh` ref> | **Quote:** "<short verbatim>" | **Confidence:** verified | provided
  ```

- The main thread then **dedups across channels, weights by strength and recency, and separates observed quotes from your interpretation.** Tag everything carried into the brief per the evidence levels.

## Vet before you grill

Subagents over-report, so a finding is only `verified` when it carries a **primary source plus a verbatim quote** (a subagent that opened the page and quoted it qualifies — see Evidence levels). A digest with no source or only a paraphrase is `provided`, not `verified`.

Don't try to re-open every URL — that burns the budget the fan-out already spent. Instead, **spot-check the load-bearing findings** (the few the decision actually hinges on): re-open those yourself and confirm the quote is real, current, and says what the digest claims. Expect three failure classes — **fabricated** quotes, **outdated** information, **misattributed** sentiment. A load-bearing finding you cannot confirm drops to `provided` and becomes an open risk.

When channels **contradict** (users praise a feature on one channel, issues show it broken on another), do not silently pick a side — surface the contradiction in the brief. It usually means two segments living different realities, which feeds straight into Name The Segment.

## Use the results

- Feed user sentiment and requests into **Signal Reading** — classify each (see Signal Taxonomy) before acting; watch for faster-horses in the loud feature requests.
- Feed competitor moves into **Tradeoffs & Shape** and **GTM & Pricing** — separate table stakes from differentiator (see Competitor Landscape).
- Cite sources in the brief. When a channel returns nothing useful, say so — silence is also a finding. Never fabricate a quote or a source.
