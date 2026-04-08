<!-- markdownlint-disable-file -->

# Task Research Notes: AI platform/news timeline sources

## Research Executed

### File Analysis

- presentations/2026-04-three-fronts-of-the-ai-race.md
  - Confirms the deck frames the disputed items as early April 2026 timeline anchors in the release-velocity section.
- handouts/2026-04-three-fronts-of-the-ai-race-briefing.md
  - Lists the three target claims verbatim and notes that exact article URLs still need to be attached before public distribution.

### Code Search Results

- timeline anchors
  - Found in the Marp deck and companion handout for the April 8, 2026 meetup.
- OpenAI funding round / MAI models / Gemma 4
  - Present in the handout as provisional dated claims requiring source verification.

### External Research

- #githubRepo:"N/A external article sourcing"
  - No GitHub repository research used for this task; authoritative sources are news publications and vendor primary announcements.
- #fetch:https://openai.com/news/rss.xml
  - Verified OpenAI's canonical Mar. 31, 2026 funding post URL and description from the company RSS feed after an initial guessed URL failed.
- #fetch:https://openai.com/index/accelerating-the-next-phase-ai/
  - Confirms OpenAI says it closed a $122 billion round on Mar. 31, 2026 and explicitly says it is "building a unified AI superapp" that brings together ChatGPT, Codex, browsing, and broader agentic capabilities.
- #fetch:https://www.wsj.com/tech/openai-plans-launch-of-desktop-superapp-to-refocus-simplify-user-experience-9e19931d
  - Confirms a Mar. 19, 2026 Wall Street Journal report that OpenAI planned to combine ChatGPT, Codex, and its browser into a desktop superapp; this is the strongest outside report on the integration claim and shows that part of the bullet predates Apr. 1.
- #fetch:https://www.cnbc.com/2026/03/19/openai-desktop-super-app-chatgpt-browser-codex.html
  - Corroborates the WSJ report and states directly that OpenAI would combine its ChatGPT app, browser, and Codex app into a singular desktop super app.
- #fetch:https://microsoft.ai/news/today-were-announcing-3-new-world-class-mai-models-available-in-foundry/
  - Primary Microsoft AI announcement on Apr. 2, 2026 for MAI-Transcribe-1, MAI-Voice-1, and MAI-Image-2, all available in Foundry and MAI Playground.
- #fetch:https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-mai-transcribe-1-mai-voice-1-and-mai-image-2-in-microsoft-foundry/4507787
  - Foundry-specific technical post confirms public preview in Microsoft Foundry, exclusive availability there, pricing, and developer use cases.
- #fetch:https://techcrunch.com/2026/04/02/microsoft-takes-on-ai-rivals-with-three-new-foundational-models/
  - Strong secondary reporting that interprets the release as Microsoft building out its own multimodal stack while remaining tied to OpenAI.
- #fetch:https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/
  - Primary Google announcement on Apr. 2, 2026 for Gemma 4, explicitly emphasizing multimodal inputs, agentic workflows, Apache 2.0 licensing, and broad developer access.
- #fetch:https://developers.googleblog.com/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/
  - Companion developer post from Apr. 2, 2026 showing Gemma 4 powering on-device, multi-step autonomous workflows and agent skills across edge devices.
- #fetch:https://cloud.google.com/blog/products/ai-machine-learning/gemma-4-available-on-google-cloud
  - Same-day Google Cloud post confirming production and enterprise access across Vertex AI, Cloud Run, GKE, TPUs, and Sovereign Cloud.

### Project Conventions

- Standards referenced: Chattanooga Generative AI Working Group presentation source rules, Marp presentation production guidance, technical markdown authoring guidance.
- Instructions followed: Keep research separate from deck content, favor concise and source-backed support, and document exact caveats where claims appear misstated.

## Key Discoveries

### Project Structure

The workspace keeps the meetup deck in presentations/ and the companion leave-behind in handouts/. The current handout explicitly says citation links were not yet attached, so this research note is the correct place to consolidate verified supporting sources before any deck edits.

### Implementation Patterns

The deck uses compressed timeline bullets rather than full citations, so the most useful research outcome is a short list of high-confidence article candidates per bullet, with explicit notes on date precision and wording drift.

The most important wording issue is item 1. The funding-round claim is best supported by an OpenAI post dated Mar. 31, 2026, while the strongest outside reporting on the "superapp" integration plan is dated Mar. 19, 2026. The handout's single Apr. 1 bullet compresses related but not same-day developments.

Item 2 is clean on the base fact pattern: Microsoft announced three MAI models on Apr. 2, 2026. The stronger "beyond OpenAI dependence" interpretation comes from secondary reporting rather than Microsoft's own announcement.

Item 3 is strongly supported by Google's own same-day materials. The Apr. 2 date, Gemma 4 name, multimodal framing, agentic positioning, and broad developer availability all line up.

### Complete Examples

```yaml
item_1:
  best_primary: https://openai.com/index/accelerating-the-next-phase-ai/
  main_caveat: funding and superapp evidence cluster in late March 2026, not a single Apr. 1 event
item_2:
  best_primary: https://microsoft.ai/news/today-were-announcing-3-new-world-class-mai-models-available-in-foundry/
  interpretation_note: dependence-on-OpenAI framing is strongest in TechCrunch and Business Insider coverage
item_3:
  best_primary: https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/
  confidence: high
```

### API and Schema Documentation

Not applicable. This task is source validation for public timeline claims, not API or schema research.

### Configuration Examples

```text
Research-only output should stay in .copilot-tracking/research/ and capture verified sources, publication dates, URLs, and wording caveats before deck content is updated.
```

### Technical Requirements

Each timeline item needs 1-3 credible published articles or primary-source announcements, plus a short explanation of why the source supports the claim. Any mismatch in date, model name, or interpretation needs to be called out directly.

For this set of bullets, the key mismatches to preserve are:

- Item 1: the funding-round evidence is Mar. 31, 2026 and the superapp reporting is Mar. 19, 2026, so Apr. 1 is only approximately right for the combined bullet.
- Item 2: the Apr. 1-Apr. 6 range is acceptable, but the underlying announcement date is Apr. 2, 2026.
- Item 3: the claim is materially accurate as written based on Apr. 2, 2026 Google sources.

## Recommended Approach

Use a primary-source-first method for each item, then pair it with one top-tier secondary report only where the interpretation goes beyond the vendor's own wording.

For this task, the selected source mix is:

- Item 1: use OpenAI's Mar. 31, 2026 funding post as the anchor, pair it with WSJ or CNBC for the superapp reporting, and explicitly note that the bullet compresses two late-March developments rather than a single Apr. 1 announcement.
- Item 2: use Microsoft's Apr. 2 primary announcement and Foundry blog as the factual base, then use TechCrunch to support the strategic interpretation about reducing dependence on OpenAI.
- Item 3: use Google's Apr. 2 Keyword post as the anchor, then use the Google for Developers and Google Cloud posts to support the agentic-workflow and broad-access framing.

## Implementation Guidance

- **Objectives**: Verify the three early-April 2026 timeline claims and produce source candidates suitable for speaker notes or handout citations.
- **Key Tasks**: Confirm exact dates, identify primary announcements, find corroborating coverage, and flag any wording or date mismatch.
- **Dependencies**: Accessible web sources, vendor announcement pages, and reputable news coverage.
- **Success Criteria**: Every item has 1-3 strong sources with title, publication, date, URL, and a concise support note, with uncertainties explicitly documented.