<!-- markdownlint-disable-file -->

# Task Research Notes: Anthropic control timeline sources

## Research Executed

### File Analysis

- presentations/2026-04-three-fronts-of-the-ai-race.md
  - Confirmed the published deck currently compresses the Anthropic control story into four bullets under Front 2.
- /Users/core/Library/Application Support/Code - Insiders/User/workspaceStorage/8ad7d4a0dfb669cca92dbdaf1c3963d8/GitHub.copilot-chat/transcripts/f0586511-7592-4223-9292-5ea07dbc2aef.jsonl
  - Confirmed the original research prompt asked for five Anthropic items, splitting Mythos into two claims: the initial restricted security-oriented preview and the partner-limited rollout interpretation.
- .copilot-tracking/research/20260408-ai-news-source-research.md
  - Reviewed the broader research note to avoid duplicating OpenAI, Microsoft, and Google findings and keep this note focused on Anthropic control-timeline sourcing.

### Code Search Results

- Anthropic-related|OpenClaw|Mythos Preview|adjusted Claude usage limits|Claude Code users reported
  - Found the exact five-item Anthropic research prompt in the session transcript and verified the deck language that needs backing.
- Mar. 25|Mar. 30|Apr. 3|Apr. 6|Apr. 7
  - Confirmed the date anchors in the prompt and identified that only item 1 lacks a strong first-party dated announcement.

### External Research

- #githubRepo:"N/A external article sourcing"
  - No GitHub repository research was used; the authoritative sources here are vendor help pages, official Anthropic product pages, and mainstream tech reporting.
- #fetch:https://thenewstack.io/claude-code-usage-limits/
  - Verified the exact title, date, and wording of the Mar. 31, 2026 article that says Claude Code users were hitting limits faster than normal and quotes an Anthropic staff post about reducing five-hour session quotas during peak hours.
- #fetch:https://thenewstack.io/anthropic-doubles-claude-usage-outside-peak-hours/
  - Verified the Mar. 16, 2026 article documenting Anthropic's time-windowed capacity management, including the rolling five-hour limit and explicit off-peak windows; useful context for item 1 but not a clean Mar. 25 primary announcement.
- #fetch:https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/
  - Verified the Apr. 4, 2026 TechCrunch report that Anthropic ended subscription-limit coverage for OpenClaw and other third-party harnesses and shifted that usage to separate pay-as-you-go billing.
- #fetch:https://thenewstack.io/anthropic-claude-harness-restrictions/
  - Verified the Apr. 6, 2026 follow-up coverage on harness restrictions, one-time credits, and developer concerns about portability and workflow fragmentation.
- #fetch:https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan
  - Verified Anthropic's support page stating that Claude and Claude Code share limits and that users can continue via API-credit billing after hitting included usage.
- #fetch:https://support.claude.com/en/articles/9797557-usage-limit-best-practices
  - Verified Anthropic's support page describing five-hour session and weekly usage tracking in Settings > Usage.
- #fetch:https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
  - Verified Anthropic's support page stating that all Claude product surfaces share the same usage allowance and that exact allowances vary by plan and are not fully enumerated there.
- #fetch:https://www.anthropic.com/project/glasswing
  - Verified Anthropic's Apr. 7, 2026 Project Glasswing page describing Claude Mythos Preview as a gated research preview for defensive security work, naming launch partners, and stating that more than 40 additional organizations also received access.
- #fetch:https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/
  - Verified the Apr. 7, 2026 TechCrunch article describing Mythos as a restricted preview used by a small partner set for cybersecurity work and clarifying that 12 partner organizations and 40 organizations total would receive access.
- #fetch:https://thenewstack.io/anthropic-claude-mythos-cybersecurity/
  - Verified the Apr. 7, 2026 The New Stack article stating that Mythos Preview was not broadly public, was limited to select partners and additional organizations, and was being rolled out cautiously because of security implications.

### Project Conventions

- Standards referenced: Chattanooga Generative AI Working Group deck source remains concise, research stays outside generated artifacts, and source notes should preserve date precision rather than forcing a slide-friendly phrasing that the evidence does not support.
- Instructions followed: .github/copilot-instructions.md, .github/instructions/presentation-authoring.instructions.md, marp-presentation-production skill, technical-markdown-authoring skill.

## Key Discoveries

### Project Structure

The workspace currently presents the Anthropic control story in a four-bullet deck section, but the original research request breaks that same material into five citation targets. This research note therefore tracks five items so the evidence can be attached cleanly before any future deck wording change.

### Implementation Patterns

The strongest sourcing pattern for these claims is not one article per bullet. Anthropic's own pages are strongest for mechanics and rollout scope: shared limits, five-hour sessions, API-credit fallback, Project Glasswing, and Mythos Preview access. The dated narrative of what users saw when and how the industry interpreted it is strongest in The New Stack and TechCrunch.

Item 1 is the weak point. The best public evidence is retrospective: The New Stack's Mar. 31 article says Anthropic had reduced peak-hour quotas "last week" and quotes an Anthropic staff explanation on X. I did not find a canonical Anthropic news post or a clean mainstream article dated exactly Mar. 25 announcing that adjustment, so the claim is only partially corroborated at that level of date precision.

Items 3 through 5 are well supported. The OpenClaw change is directly covered by TechCrunch and The New Stack, while the Mythos/Glasswing items have both an Anthropic primary page and strong same-day secondary reporting.

### Complete Examples

```yaml
item_1:
  confidence: partial
  best_secondary: https://thenewstack.io/claude-code-usage-limits/
  contextual_support: https://thenewstack.io/anthropic-doubles-claude-usage-outside-peak-hours/
  caveat: no strong first-party Mar. 25 announcement found

item_2:
  confidence: high
  best_secondary: https://thenewstack.io/claude-code-usage-limits/
  primary_context:
    - https://support.claude.com/en/articles/9797557-usage-limit-best-practices
    - https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work

item_3:
  confidence: high
  best_secondary:
    - https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/
    - https://thenewstack.io/anthropic-claude-harness-restrictions/
  primary_context: https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan

item_4:
  confidence: high
  best_primary: https://www.anthropic.com/project/glasswing
  best_secondary:
    - https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/
    - https://thenewstack.io/anthropic-claude-mythos-cybersecurity/

item_5:
  confidence: high
  best_primary: https://www.anthropic.com/project/glasswing
  best_secondary:
    - https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/
    - https://thenewstack.io/anthropic-claude-mythos-cybersecurity/
```

### API and Schema Documentation

Not applicable. This task is evidence gathering for deck timeline claims, not API or schema research.

### Configuration Examples

```text
Research note: .copilot-tracking/research/20260408-anthropic-control-timeline-sources-research.md
Deck section using these claims: presentations/2026-04-three-fronts-of-the-ai-race.md
Anthropic primary anchors:
- https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan
- https://support.claude.com/en/articles/9797557-usage-limit-best-practices
- https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
- https://www.anthropic.com/project/glasswing
```

### Technical Requirements

Each of the five items needs 1 to 3 citation candidates with a title, publication, date, URL, and a short explanation of what the source actually proves. For this Anthropic set, the main accuracy constraints are:

- Item 1 should be labeled partial or uncertain if the deck keeps the exact Mar. 25 wording.
- Support pages are useful primary sources for mechanics, but some only expose a relative update marker such as "Updated over 3 weeks ago," not an exact public timestamp.
- Items 4 and 5 should stay distinct in notes even though they share source material: one is about Mythos Preview being aimed at security-sensitive/high-stakes uses, the other is about partner-limited rollout as evidence of selective control.

## Recommended Approach

Use a primary-source-first citation set, then pair each item with the strongest dated secondary coverage from The New Stack or TechCrunch only where the primary page does not itself establish public timing or interpretation.

For this specific Anthropic timeline, the selected citation strategy is:

- Item 1: cite The New Stack's Mar. 31 limits article as the best retrospective evidence, use the Mar. 16 off-peak article and Anthropic usage-help pages only as supporting context, and explicitly flag the exact Mar. 25 dating as only partially corroborated.
- Item 2: anchor on The New Stack's Mar. 31 reporting and use Anthropic support pages for the shared five-hour/session-limit mechanics users were complaining about.
- Item 3: anchor on TechCrunch Apr. 4 and The New Stack Apr. 6, with Anthropic's plan-usage help page as primary context for the subscription-versus-API-credit billing model.
- Item 4: anchor on Anthropic's Project Glasswing page and pair with TechCrunch or The New Stack for same-day interpretation that Mythos Preview was security-oriented and not a broad public launch.
- Item 5: reuse Project Glasswing plus TechCrunch or The New Stack, but emphasize the partner-limited access and deliberate gating rather than the model's capability profile.

## Implementation Guidance

- **Objectives**: Produce presentation-ready source candidates for the five Anthropic control-timeline items without overstating what the public record proves.
- **Key Tasks**: Attach 1 to 3 citations per item, separate direct evidence from contextual support, and soften or annotate item 1 if strict date accuracy matters.
- **Dependencies**: Anthropic help center pages, Anthropic Project Glasswing page, The New Stack coverage, TechCrunch coverage, and the existing deck wording in presentations/2026-04-three-fronts-of-the-ai-race.md.
- **Success Criteria**: Every item has a clean citation set with an explicit confidence level, and the March 25 usage-limit claim is not presented as more definitive than the available evidence supports.