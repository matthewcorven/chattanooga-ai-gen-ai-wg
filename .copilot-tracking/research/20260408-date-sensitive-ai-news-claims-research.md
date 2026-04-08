<!-- markdownlint-disable-file -->

# Task Research Notes: Date-sensitive AI news claims for meetup deck

## Research Executed

### File Analysis

- presentations/2026-04-three-fronts-of-the-ai-race.md
  - Verified the slide wording now used in the deck: "Mid-March: roundups described a rapid, continuous launch cycle, not isolated headline drops," plus dated Anthropic and OpenAI bullets that need tighter sourcing.
- handouts/2026-04-three-fronts-of-the-ai-race-briefing.md
  - Verified the companion handout uses the stronger claim wording the user asked about, including the exact Mar. 25 and Apr. 1 anchors.
- .copilot-tracking/research/20260408-ai-platform-news-timeline-sources-research.md
  - Reused verified OpenAI funding-round and superapp sourcing already captured earlier in the session.
- .copilot-tracking/research/20260408-anthropic-control-timeline-sources-research.md
  - Reused the earlier finding that the Anthropic March 25 date is only partially corroborated and is better stated as a late-March capacity-management change.
- .copilot-tracking/research/20260408-ai-news-source-research.md
  - Confirmed earlier research had already flagged the release-cycle claim as a bundle/synthesis rather than a clean one-article citation.

### Code Search Results

- Mid-March|Mar\. 25|Apr\. 1|continuous release cycle|usage limits|super app|superapp
  - Found the exact live deck and handout phrasing that needs source support in presentations/2026-04-three-fronts-of-the-ai-race.md and handouts/2026-04-three-fronts-of-the-ai-race-briefing.md.
- roundups described a rapid, continuous launch cycle
  - Found in the deck at the release-velocity section, confirming that item 1 currently appears as a synthesis claim rather than a direct factual event.
- Anthropic adjusted Claude usage limits during peak hours
  - Found as a dated slide/handout bullet, confirming that the public record must support both the capacity change and the user-visible effect.
- OpenAI was reported to have closed a very large funding round
  - Found in the handout, confirming that the funding and integrated-product claim is currently compressed into a single Apr. 1 bullet.

### External Research

- #githubRepo:"N/A external article sourcing"
  - No GitHub repository research was used. The authoritative sources here are vendor announcements, vendor support pages, and top-tier news publications.
- #fetch:https://techcrunch.com/2026/03/13/the-biggest-ai-stories-of-the-year-so-far/
  - Verified a true mid-March roundup source. TechCrunch says "The AI industry is constantly churning out news" and frames the period as a stream of major moves rather than isolated launches.
- #fetch:https://techcrunch.com/2026/02/05/openai-launches-new-agentic-coding-model-only-minutes-after-anthropic-drops-its-own/
  - Verified a concrete example of rapid competitive cadence: OpenAI shipped an agentic coding model only minutes after Anthropic released its own.
- #fetch:https://thenewstack.io/anthropic-doubles-claude-usage-outside-peak-hours/
  - Verified Mar. 16 reporting that Anthropic doubled Claude usage outside peak hours, tied usage to a rolling five-hour window, and explicitly framed the move as part of labs competing for developer attention and ecosystem lock-in.
- #fetch:https://thenewstack.io/claude-code-usage-limits/
  - Verified Mar. 31 reporting that users said Claude Code sessions were exhausting limits faster than normal and that Anthropic had reduced quotas during peak hours the prior week.
- #fetch:https://www.engadget.com/ai/anthropic-is-doubling-claudes-usage-limits-during-off-peak-hours-for-the-next-two-weeks-163645928.html
  - Verified a mainstream secondary report dated Mar. 15 stating Anthropic doubled usage limits from Mar. 13 to Mar. 27 outside weekday peak hours and within the same five-hour window mechanics.
- #fetch:https://support.claude.com/en/articles/9797557-usage-limit-best-practices
  - Verified Anthropic's help documentation describing the five-hour session usage view and how users monitor consumption.
- #fetch:https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
  - Verified Anthropic's help documentation stating that usage across Claude surfaces counts toward the same usage limit and that longer, more complex conversations reduce how far sessions go.
- #fetch:https://openai.com/index/accelerating-the-next-phase-ai/
  - Verified OpenAI's Mar. 31, 2026 company post stating it closed a $122 billion funding round and is "building a unified AI superapp" that brings together ChatGPT, Codex, browsing, and broader agentic capabilities.
- #fetch:https://www.cnbc.com/2026/03/31/openai-funding-round-ipo.html
  - Verified CNBC's Mar. 31 report that OpenAI closed a record-breaking $122 billion round at an $852 billion post-money valuation.
- #fetch:https://www.wsj.com/tech/openai-plans-launch-of-desktop-superapp-to-refocus-simplify-user-experience-9e19931d
  - Verified WSJ's Mar. 19 report that OpenAI planned to combine ChatGPT, Codex, and browser capabilities into a desktop "superapp," showing the integration reporting predates Apr. 1.

### Project Conventions

- Standards referenced: Chattanooga Generative AI Working Group presentation source rules, Marp presentation production guidance, technical markdown authoring guidance.
- Instructions followed: Keep research in .copilot-tracking/research, prefer concise source-backed wording, and preserve date precision rather than forcing a slide-friendly claim the evidence does not fully support.

## Key Discoveries

### Project Structure

The deck and handout currently present these claims as short dated bullets, which means citation reliability depends on exact date discipline more than on thematic fit. The OpenAI and Anthropic bullets compress related developments into single dates; the release-cycle bullet is not a discrete event at all, but a synthesized reading of mid-March coverage.

### Implementation Patterns

The strongest citation pattern here is:

1. Use a primary source when the company itself published the claim.
2. Add one top-tier secondary source when the bullet relies on interpretation or earlier reporting.
3. Rewrite any synthesis claim so it describes what the sources actually say, rather than overcommitting to a single date or article.

Applied to these three items:

- Item 1 is not cleanly supportable as written. The best evidence shows mid-March roundup coverage and concrete competitive release races, but not a single definitive "industry roundups emphasized a continuous release cycle across major labs" article with that exact framing.
- Item 2 is directionally right but too precise on date. Public evidence supports mid- to late-March time-windowed limit changes and late-March user complaints, not a clean first-party Mar. 25 announcement.
- Item 3 is strongly supportable, but the exact date should be Mar. 31 for the funding close. The superapp reporting begins Mar. 19 and is reaffirmed by OpenAI's own Mar. 31 post.

### Complete Examples

```yaml
item_1:
  supportable_exactly_as_written: false
  recommended_slide_wording: "Mid-March: roundup coverage increasingly described AI as a constant churn of launches, ecosystem moves, and competitive reactions rather than isolated headline drops."
  best_sources:
    - title: "The biggest AI stories of the year (so far)"
      publication: "TechCrunch"
      date: "2026-03-13"
      url: "https://techcrunch.com/2026/03/13/the-biggest-ai-stories-of-the-year-so-far/"
    - title: "Anthropic doubles Claude usage outside peak hours — but it won't last forever"
      publication: "The New Stack"
      date: "2026-03-16"
      url: "https://thenewstack.io/anthropic-doubles-claude-usage-outside-peak-hours/"
    - title: "OpenAI launches new agentic coding model only minutes after Anthropic drops its own"
      publication: "TechCrunch"
      date: "2026-02-05"
      url: "https://techcrunch.com/2026/02/05/openai-launches-new-agentic-coding-model-only-minutes-after-anthropic-drops-its-own/"

item_2:
  supportable_exactly_as_written: false
  recommended_slide_wording: "Late March: Anthropic confirmed it had been adjusting Claude's five-hour limits during peak hours, and by Mar. 31 users were reporting that Claude Code sessions were running out much faster than expected."
  best_sources:
    - title: "Claude Code users say they're hitting usage limits faster than normal"
      publication: "The New Stack"
      date: "2026-03-31"
      url: "https://thenewstack.io/claude-code-usage-limits/"
    - title: "Anthropic is doubling Claude's usage limits during off-peak hours for the next two weeks"
      publication: "Engadget"
      date: "2026-03-15"
      url: "https://www.engadget.com/ai/anthropic-is-doubling-claudes-usage-limits-during-off-peak-hours-for-the-next-two-weeks-163645928.html"
    - title: "How do usage and length limits work?"
      publication: "Anthropic Support"
      date: "updated over 3 weeks ago as fetched on 2026-04-08"
      url: "https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work"

item_3:
  supportable_exactly_as_written: false
  recommended_slide_wording: "Mar. 31: OpenAI said it had closed a $122 billion funding round and said it is building a unified AI superapp; reporting on the ChatGPT-Codex-browser integration plan had already surfaced on Mar. 19."
  best_sources:
    - title: "OpenAI raises $122 billion to accelerate the next phase of AI"
      publication: "OpenAI"
      date: "2026-03-31"
      url: "https://openai.com/index/accelerating-the-next-phase-ai/"
    - title: "OpenAI closes record-breaking $122 billion funding round as anticipation builds for IPO"
      publication: "CNBC"
      date: "2026-03-31"
      url: "https://www.cnbc.com/2026/03/31/openai-funding-round-ipo.html"
    - title: "OpenAI Plans Launch of Desktop 'Superapp' to Refocus, Simplify User Experience"
      publication: "The Wall Street Journal"
      date: "2026-03-19"
      url: "https://www.wsj.com/tech/openai-plans-launch-of-desktop-superapp-to-refocus-simplify-user-experience-9e19931d"
```

### API and Schema Documentation

Not applicable. This task is source verification and wording guidance for public AI news claims, not API or schema research.

### Configuration Examples

```text
Research note path: .copilot-tracking/research/20260408-date-sensitive-ai-news-claims-research.md
Deck file using the claims: presentations/2026-04-three-fronts-of-the-ai-race.md
Handout file using the claims: handouts/2026-04-three-fronts-of-the-ai-race-briefing.md
```

### Technical Requirements

For slide-citation reliability, each bullet should use at most 1 to 3 sources, favor primary or top-tier reporting, and avoid dates that merge separate developments into one event.

The specific reliability constraints for these three items are:

- Item 1 should be presented as a synthesis of coverage, not as a single dated event or a quote-worthy consensus line.
- Item 2 should not pin the entire claim to Mar. 25 unless the deck is comfortable relying on retrospective reporting rather than a same-day public announcement.
- Item 3 should not use Apr. 1 as the main date anchor because the funding close is publicly dated Mar. 31 and the superapp reporting begins Mar. 19.

## Recommended Approach

Use a primary-source-first citation strategy, but rewrite the slide text to match what the sources actually establish.

For these three bullets, the selected approach is:

- Keep item 1 as a high-level interpretation, but rewrite it to say that mid-March roundup coverage described a constant churn of launches and ecosystem competition, rather than claiming an exact cross-lab consensus on a "continuous release cycle."
- Rewrite item 2 to late March, using The New Stack as the strongest dated report for both the peak-hour adjustment and the user-visible impact, with Engadget and Anthropic help documentation supporting the mechanics.
- Rewrite item 3 to Mar. 31, with OpenAI's own post as the anchor because it uniquely supports both the funding close and the superapp language in one source; keep CNBC and WSJ only as corroboration.

This is the most reliable slide-citation path because it minimizes the number of sources per bullet, uses first-party or top-tier reporting where available, and avoids overclaiming on dates the public record does not cleanly support.

## Implementation Guidance

- **Objectives**: Give the deck short, citation-ready wording that can survive scrutiny on title, publication, date, and source quality.
- **Key Tasks**: Replace the current Mar. 25 and Apr. 1 wording with tighter date anchors, soften the item 1 synthesis language, and attach only the strongest 1 to 3 sources per bullet.
- **Dependencies**: TechCrunch, The New Stack, Engadget, Anthropic support pages, OpenAI company post, CNBC, and WSJ access for the integration report.
- **Success Criteria**: Each bullet has a defensible wording/date pair, no bullet depends on a weak or invented exact-date match, and every recommended source directly supports the text that appears on the slide.