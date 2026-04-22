---
name: ai-related-news-scout
description: 'Research recent AI news and propose source-backed story candidates for AI Night decks. Use when scanning the past weeks (default 2 weeks) of AI news, grouping themes, choosing meetup-worthy items, or building a builder-focused shortlist before deck drafting.'
argument-hint: 'Time window, audience angle, and desired number of candidate stories'
---

# AI-Related News Scout

Use this skill to turn a recent AI news window into a shortlist of meetup-worthy, source-backed story candidates before drafting a deck.

## Preferred Workflow

Work in two passes:

1. Use a fast discovery layer to surface candidate stories across the requested window.
2. Re-check the strongest candidates against primary or near-primary sources before recommending them for slides.

This keeps the first pass broad and efficient, while preserving the source quality needed for AI Night decks.

## Discovery Sources

Use these sources in this order unless the user asks for something narrower.

### 1. Forward Future archive for rapid time-window discovery

- Use `https://forwardfuture.ai/newsletter-archive` as the default index for date-bounded scouting.
- Do not rely on `https://briefing.forwardfuture.ai/archive` for automation-first intake. In practice it exposes only a short slice and depends on login state plus `Load more`, which makes it weaker for repeatable scripted collection.
- Use issue pages at `https://briefing.forwardfuture.ai/p/<slug>` after finding matching archive cards.
- Treat Forward Future as a discovery layer, not a final citation layer.

### 2. Primary company sources for confirmation

- OpenAI: `https://openai.com/index/...`
- Anthropic announcements: `https://www.anthropic.com/news/...`
- Anthropic engineering and systems posts: `https://www.anthropic.com/engineering/...`
- Anthropic security-specific material when relevant: `https://www.anthropic.com/glasswing`
- Google AI and product launches: `https://blog.google/innovation-and-ai/...`
- Google Cloud enterprise AI launches when relevant: `https://cloud.google.com/blog/...`

### 3. High-quality secondary framing

- Reuters for market, enterprise, and infrastructure framing
- TechCrunch for product and startup context
- CNBC, AP, Bloomberg, Axios, MIT Technology Review, The Information, NYT, and similar outlets when they materially sharpen the story

### 4. Product docs and support pages for pricing or access changes

- For pricing, entitlement, rate-limit, plan, or rollout changes, treat vendor pricing pages, docs, and support articles as primary sources.
- Do not assume launch blogs reflect the current access matrix; docs and support pages often update first.

## Automation

The repository includes a scripted Forward Future intake step:

```bash
npm run scout:forwardfuture -- --days 14 --with-items
```

Useful variants:

```bash
npm run scout:forwardfuture -- --start 2026-04-09 --end 2026-04-22 --with-items
npm run scout:forwardfuture -- --days 14 --with-items --format json
node ./scripts/collect-forwardfuture-news.mjs --days 14 --with-items --format json
```

Machine parsing tip:

- For `jq`, saved artifacts, or any downstream automation, prefer `node ./scripts/collect-forwardfuture-news.mjs ... --format json` or `npm run --silent scout:forwardfuture -- ... --format json`.
- Plain `npm run scout:forwardfuture` prepends npm banner lines before stdout, which makes the JSON awkward to pipe directly.

What the script does:

- reads `https://forwardfuture.ai/newsletter-archive`
- extracts issue cards for the requested date window
- fetches matching `https://briefing.forwardfuture.ai/p/<slug>` issue pages
- parses section-scoped story blocks instead of scanning the whole page loosely
- filters obvious sponsor, social, and self-referential links
- returns issue summaries plus linked external stories that are good enough for a first-pass shortlist

Use this script first when a less-capable subagent needs a reliable discovery path.

## Source Handling Rules

- Prefer official launch or engineering posts when they exist.
- Use Forward Future to discover stories, not to support factual claims on slides.
- Skip sponsor blocks, poll blocks, embedded social posts, and newsletter house ads.
- Merge duplicate signals across Forward Future and primary sources into one story candidate.
- If a story remains supported only by a newsletter summary and cannot be validated elsewhere, keep it out of the recommended shortlist or mark it low confidence.
- For pricing and access stories, check the current plan matrix in docs/support pages before trusting summaries from blogs, newsletters, or social posts.

## Procedure

1. Establish the research window, defaulting to the last 14 days unless the user gives a different period.
2. Use a technical, product-and-programming-oriented lens aimed at builders, developers, product people, and technically curious attendees.
3. Run the Forward Future collector for the requested window when broad discovery is needed.
4. Pull the strongest candidate items from the collector output.
5. Validate those items against primary sources first, then use quality secondary reporting for context.
6. Filter for stories that matter to practitioners, not just general-interest attention.
7. Cluster the strongest items into 2 to 4 possible through-lines or deck theses.
8. Build a shortlist of 6 to 10 candidate stories with date, source bundle, and why-it-matters notes.
9. Recommend the strongest subset for a talk and stop for user review before drafting any deck.
10. After approval, hand off to the existing source-backed deck workflow: create the deck, add appendix links, run the `News Source Validator`, build artifacts, and publish.

## When to Use

- Research AI-related news from the last two weeks (default) or a custom  period
- Propose candidate stories for an AI Night meetup
- Find a theme that connects multiple recent AI developments
- Build a builder-focused shortlist before creating slides
- Separate strong source-backed items from weaker speculation

## Source Selection Rules

- Prefer primary sources when available: company blogs, launch posts, official docs, product announcements, support notes, or filings.
- Use high-quality reporting to add context, competition framing, user impact, or independent confirmation.
- Treat rumors, leaked claims, and partial screenshots as low-confidence unless backed by reporting strong enough to survive slide scrutiny.
- If a story depends mainly on interpretation, label it clearly as synthesis rather than fact.

## Decision Points

- If the window is too dense, prioritize by builder impact, novelty, discussion value, and source quality.
- If the window is too thin, widen by a few days and state that adjustment explicitly.
- If several items are really one story, merge them into one candidate instead of repeating the same signal.
- If the strongest material points to a theme, propose the theme instead of returning a flat list of disconnected headlines.
- If an item lacks strong support, either exclude it or keep it in a clearly marked low-confidence section.
- If the user already has a preferred angle, bias the shortlist toward that angle while still surfacing the strongest alternative thesis.

## Quality Bar

- Every proposed item should have at least one dated source and a concise explanation of why it matters.
- Confirmed facts and synthesis claims should be separated clearly.
- Candidate items should be distinct rather than overlapping variants of the same story.
- The shortlist should favor stories with real deck potential: clear stakes, evidence, and discussion value.
- The proposal phase should not jump straight into slide drafting unless the user asks.

## Output Format

Return the proposal in this structure:

1. Coverage window and audience lens
2. Two to four candidate themes
3. Six to ten candidate stories, each with:
   - headline or claim
   - why it matters for this meetup
   - date or date range
   - linked source bundle
   - source quality note: exact, solid, or speculative
4. Recommended shortlist for the next deck
5. Open questions or places where user direction would sharpen the final selection

## Completion Check

The skill is complete when the user has a review-ready shortlist with enough source support to choose a direction for a deck, but before deck files or artifacts are generated.
