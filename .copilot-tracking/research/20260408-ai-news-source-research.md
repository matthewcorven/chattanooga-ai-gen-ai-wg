<!-- markdownlint-disable-file -->

# Task Research Notes: AI News Source Research

## Research Executed

### File Analysis

- presentations/2026-04-three-fronts-of-the-ai-race.md
  - Confirmed the five timeline bullets appear in the deck as claims that need article backing, with exact dates and wording that constrain source selection.
- handouts/2026-04-three-fronts-of-the-ai-race-briefing.md
  - Confirmed the same five bullets are repeated in the handout's Timeline Anchors section and should use precise source support before public distribution.
- presentations/assets/three-fronts-of-the-ai-race.mmd
  - Confirmed the deck's narrative groups the claims under release velocity and infrastructure pressure, so sourcing should preserve those two themes rather than introduce new framing.

### Code Search Results

- Jensen Huang|Anthropic|DeepSeek V4|release cycle|infrastructure
  - Found in the April 2026 deck and companion handout as the target claims to source.
- three fronts of the ai race
  - Files discovered: presentations/2026-04-three-fronts-of-the-ai-race.md, handouts/2026-04-three-fronts-of-the-ai-race-briefing.md, presentations/assets/three-fronts-of-the-ai-race.mmd
- Reuters|TechCrunch|CNBC|TechNode|Claude
  - External article discovery converged on strong support for items 1, 2, 3, and 4; item 1 is now backed by an exact-match Bloomberg article; item 5 was best supported by a bundle of contemporaneous articles rather than one exact roundup.

### External Research

- #fetch:https://techcrunch.com/2026/02/05/anthropic-releases-opus-4-6-with-new-agent-teams/
  - Verified a strong exact-date match for the Feb. 5 Anthropic item. TechCrunch confirms Opus 4.6 shipped on Feb. 5, 2026 with "agent teams," a 1 million-token context window, and broader usage for Claude Code and knowledge work.
- #fetch:https://techcrunch.com/2026/02/05/openai-launches-new-agentic-coding-model-only-minutes-after-anthropic-drops-its-own/
  - Verified same-day corroboration that Anthropic had just released a competing agentic coding model before OpenAI shipped its own, which strongly supports the "release velocity" framing.
- #fetch:https://www.cnbc.com/2026/03/13/ai-data-centers-electricity-prices-backlash-ratepayer-protection.html
  - Verified mainstream business coverage that AI data-center expansion was creating power-grid strain, local backlash, cost pressure, and multi-year grid-connection delays by mid-March.
- #fetch:https://technode.com/2026/03/02/deepseek-plans-v4-multimodal-model-release-this-week-sources-say/
  - Verified March 2 reporting that DeepSeek V4 was expected as a multimodal model capable of generating text, images, and video; the article attributes the report to the Financial Times.
- #fetch:https://www.ft.com/content/e3366881-0622-40a7-9c34-a0d82e3d573e
  - Verified the paywalled Financial Times headline "DeepSeek to release long-awaited AI model in new challenge to US rivals," which is strong mainstream support for the V4 buzz, though the fetch did not expose the publication date cleanly.
- #fetch:https://claude.com/blog/dispatch-and-computer-use
  - Verified March 23 Claude product coverage showing active shipping on computer use, coding workflows, and longer-running delegated work, useful as part of the item 5 release-cycle bundle.
- Bing News RSS queries for Reuters and other outlets
  - Verified article titles, publication dates, and canonical Reuters URLs for the infrastructure and DeepSeek items when direct Reuters fetches returned 401. This was the only reliable way to retain precise Reuters metadata in this session.

### Project Conventions

- Standards referenced: Chattanooga Generative AI Working Group Markdown-first workflow, concise companion material, research recorded outside slide source.
- Instructions followed: .github/copilot-instructions.md, .github/instructions/presentation-authoring.instructions.md, technical-markdown-authoring skill, marp-presentation-production skill.

## Key Discoveries

### Project Structure

The deck and handout already encode the exact wording of the five timeline claims. Source selection therefore has to prioritize date precision first, and only then thematic fit. The research materially supports items 1, 2, 3, and 4. Item 5 is better treated as a pattern claim supported by a bundle of contemporaneous articles rather than a single exact roundup.

### Implementation Patterns

The workspace keeps audience-facing claims in Marp and Markdown sources, with supporting materials expected to live alongside the content rather than inside generated `dist/` outputs. For this task, the strongest pattern was:

1. Prefer a direct exact-date mainstream or company-published article when available.
2. Add one corroborating article when the deck claim compresses multiple related capabilities.
3. If a claim cannot be matched cleanly, record that uncertainty rather than forcing a weak citation.
4. When direct page fetches fail, preserve Reuters evidence using Bing News RSS title, date, and canonical URL data.

### Complete Examples

```markdown
Item 1
- "Nvidia CEO Says AI Build-Out Will Eventually Lower Energy Costs" — Bloomberg — Feb. 3, 2026
  https://www.bloomberg.com/news/articles/2026-02-03/nvidia-ceo-says-ai-build-out-will-eventually-lower-energy-costs
- Closest primary-source context, but not an exact substitute:
  - "Everything Will Be Represented in a Virtual Twin, NVIDIA CEO Jensen Huang Says at 3DEXPERIENCE World" — NVIDIA Blog — Feb. 3, 2026
    https://blogs.nvidia.com/blog/huang-3dexperience-2026/
  - "‘Largest Infrastructure Buildout in Human History’: Jensen Huang on AI’s ‘Five-Layer Cake’ at Davos" — NVIDIA Blog — Jan. 21, 2026
    https://blogs.nvidia.com/blog/davos-wef-blackrock-ceo-larry-fink-jensen-huang/

Item 2
- "Anthropic releases Opus 4.6 with new 'agent teams'" — TechCrunch — Feb. 5, 2026
  https://techcrunch.com/2026/02/05/anthropic-releases-opus-4-6-with-new-agent-teams/
- "OpenAI launches new agentic coding model only minutes after Anthropic drops its own" — TechCrunch — Feb. 5, 2026
  https://techcrunch.com/2026/02/05/openai-launches-new-agentic-coding-model-only-minutes-after-anthropic-drops-its-own/

Item 3
- "Who is really footing the AI energy bill? Inside the debate about data center electricity costs" — CNBC — Mar. 13, 2026
  https://www.cnbc.com/2026/03/13/ai-data-centers-electricity-prices-backlash-ratepayer-protection.html
- "AI power dash transforms clean energy offtake market" — Reuters — Mar. 17, 2026
  https://www.reuters.com/business/energy/ai-power-dash-transforms-clean-energy-offtake-market--reeii-2026-03-17/
- "Soaring AI demand spurs roll-out of long duration energy storage" — Reuters — Mar. 26, 2026
  https://www.reuters.com/business/energy/soaring-ai-demand-spurs-roll-out-long-duration-energy-storage--reeii-2026-03-24/

Item 4
- "A mystery AI model has developers buzzing: Is this DeepSeek's latest blockbuster?" — Reuters — Mar. 17-18, 2026 RSS-indexed publication
  https://www.reuters.com/business/media-telecom/mystery-ai-model-has-developers-buzzing-is-this-deepseeks-latest-blockbuster-2026-03-18/
- "DeepSeek plans V4 multimodal model release this week, sources say" — TechNode — Mar. 2, 2026
  https://technode.com/2026/03/02/deepseek-plans-v4-multimodal-model-release-this-week-sources-say/
- "DeepSeek to release long-awaited AI model in new challenge to US rivals" — Financial Times — paywalled, date not recovered cleanly in fetch
  https://www.ft.com/content/e3366881-0622-40a7-9c34-a0d82e3d573e

Item 5
- No single strong mainstream roundup was verified with the exact "continuous release cycle" framing.
- Best support comes from a bundle of contemporaneous articles showing fast shipping across coding, memory, and enterprise workflows:
  - "Dispatch and computer use" — Claude blog — Mar. 23, 2026
    https://claude.com/blog/dispatch-and-computer-use
  - "Google is making it easier to import another AI's memory into Gemini" — The Verge — Mar. 26, 2026
    https://www.theverge.com/ai-artificial-intelligence/902085/google-gemini-import-memory-chat-history
  - "Microsoft unveils AI upgrades, rolls out Copilot Cowork to early-access customers" — Reuters — Mar. 30, 2026
    https://www.reuters.com/business/microsoft-unveils-ai-upgrades-rolls-out-copilot-cowork-early-access-customers-2026-03-30/
```

### API and Schema Documentation

Not applicable. The task is source verification for published AI news claims.

### Configuration Examples

```text
Research notes path: .copilot-tracking/research/20260408-ai-news-source-research.md
Primary deck path: presentations/2026-04-three-fronts-of-the-ai-race.md
Primary handout path: handouts/2026-04-three-fronts-of-the-ai-race-briefing.md
```

### Technical Requirements

Each item needs 1-3 credible published article candidates with exact publication details, URL when available, and a short note explaining why the article supports the claim. Precision takes priority over quantity. The research outcome shows that exact-match discipline matters more than forcing symmetry across all five bullets.

## Recommended Approach

Use the following single approach for deck citations:

1. Treat items 1, 2, 3, and 4 as citation-ready using the exact articles identified above.
2. Treat item 5 as a pattern claim, and only cite it if the deck or handout is comfortable using a three-article bundle rather than a single roundup.
3. Keep item 1's wording close to Bloomberg's mechanism. If a primary-source-only citation is required, soften the wording rather than stretching Nvidia primary materials into an exact substitute.

This is the cleanest evidence-based path because it preserves the strongest parts of the timeline without smuggling in weak support for the weakest remaining bullet.

## Implementation Guidance

- **Objectives**: Use high-confidence citations for the timeline without overstating what the reporting actually proves.
- **Key Tasks**: Attach the item 1-4 sources directly, decide whether item 5 should remain a pattern claim, and keep item 1 phrased close to Bloomberg unless switching to a broader Nvidia-primary wording.
- **Dependencies**: Public web access, TechCrunch/CNBC/TechNode/Claude pages, Reuters URLs recovered via RSS metadata, and optional FT access if a paywalled citation is acceptable.
- **Success Criteria**: The deck can cite items 1-4 confidently, item 5 is clearly labeled as pattern support if used, and item 1 is either kept close to Bloomberg's wording or deliberately broadened for a primary-source-only version.