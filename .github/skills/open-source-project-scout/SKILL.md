---
name: open-source-project-scout
description: 'Scan a provided set of open source project links, extract official taglines or neutral one-line summaries from front-page docs, group projects into categories, and produce a page-per-category AI Night deck with HTML and PDF artifacts.'
argument-hint: 'Project links, optional categories, audience angle, deck title, and whether categories are supplied or inferred'
---

# Open Source Project Scout

Use this skill when the user already has a set of open source software links and wants them turned into a clean, category-based showcase deck.

Unlike the AI news scout workflow, this skill does not begin with broad discovery. It begins with a bounded input set, extracts concise project positioning from each project's public landing materials, organizes the set into a usable taxonomy, and carries the workflow through deck creation plus HTML and PDF build output.

## Preferred Workflow

Work in five passes:

1. Normalize the supplied links and establish the intended audience plus deck scope.
2. Inspect each project's front page, README, or docs landing page to capture an official tagline or derive a neutral one-line summary.
3. Group projects into explicit categories, using user-provided buckets when available and inferring them when they are not.
4. Draft a Marp deck with one slide per category, keeping each project entry short, comparable, and source-grounded.
5. Build the deck to HTML and PDF, then run local validation.

This keeps the work structured, repeatable, and aligned with the repository's slide-production flow.

## Inputs

Expect some or all of the following:

- a list of project URLs
- optional category labels supplied by the user
- optional cover date if the user wants something more specific than the current month or event date
- optional audience angle such as developer tools, agent stacks, local AI, data tooling, or infrastructure
- optional cap on number of projects or number of categories

If categories are not supplied, infer them from what the software actually does, not from popularity, stars, or market narrative.

## Source Priority

For each project, inspect sources in this order and stop as soon as a clear, trustworthy summary is available.

### 1. Docs or homepage landing copy

- Prefer the product or documentation landing page hero text, intro paragraph, or getting-started summary.
- This is usually the cleanest place to find how the maintainers describe the tool.

### 2. Repository front page metadata

- Use the repository description or "About" text when it is specific and not just a fragment.
- On GitHub-like hosts, treat this as strong shorthand but not automatically better than the docs landing page.

### 3. README opening section

- Use the first short descriptive paragraph, intro bullets, or setup summary.
- Ignore badges, sponsor blocks, contributor notes, installation boilerplate, and changelog material when looking for the summary line.

### 4. Nearby official docs pages

- If the root README is sparse, inspect a linked docs intro page, quickstart, or overview page.
- Do not wander deep into implementation details unless the summary cannot be established from the front door.

## Summary Extraction Rules

- Prefer an official tagline if it is clear, short, and descriptive.
- If the official wording is vague, marketing-heavy, or incomplete, write a neutral one-line summary grounded in the visible docs.
- Keep each line to one sentence or short clause, ideally short enough to scan on a slide.
- Preserve the project's actual category and purpose; do not oversell it.
- Avoid feature laundry lists, benchmark claims, or roadmap speculation.
- If the project spans several areas, choose the primary use case the docs lead with.
- If the landing materials are ambiguous, mark the summary low confidence and note the ambiguity before slide drafting.

## Category Rules

- Use user-provided categories when they are sensible.
- If categories are missing, derive 4 to 8 categories that make sense for the set.
- Assign each project to one primary category for slide clarity.
- Merge near-duplicate categories such as "agent frameworks" and "agent orchestration" unless the distinction matters to the deck's point.
- Favor functional categories over implementation details.
- Keep category names short and slide-friendly.

## Project Intake Procedure

For each supplied URL:

1. Resolve the canonical project page if the supplied link is a redirect, docs subpage, or non-root repository URL.
2. Capture the project name as the maintainers style it.
3. Inspect the docs landing page, repo description, and README opening in source-priority order.
4. Extract either:
   - an official tagline, or
   - a synthesized one-line summary based only on the visible front-door docs
5. Record the canonical source URL used for that line.
6. Assign a primary category.
7. Flag missing, weak, or ambiguous descriptions before moving into slide production.

Do not turn this into a broad market scan. Stay bounded to the provided set unless the user explicitly asks to expand it.

## Deck Authoring Workflow

After the project list is normalized and categorized:

1. Create a Marp deck in `presentations/` using the repository's `ai-night` theme.
2. Use frontmatter with `marp: true`, `theme: ai-night`, `paginate: true`, and an explicit title.
3. Open with a lead slide that keeps a stable title and subtitle, adds an explicit date line, and leaves room for the build-generated QR block.
4. Add one slide per category.
5. On each category slide, list the projects in that category using one bullet per project.
6. Keep the slide dense enough to be useful but sparse enough to scan quickly.
7. If a category has too many items, split it across two clearly labeled slides instead of shrinking the type into noise.
8. Do not add a "how to read this set" slide, a closing synthesis slide, or appendix slides unless the user explicitly asks for them.

## Slide Pattern

Prefer a simple structure like this on category slides:

- category title
- 3 to 7 project entries
- each entry should include:
  - project name
  - one-line tagline or summary
  - a short visible link label such as `owner/repo`, linked to the canonical project URL

Keep the link visible in the bullet so the slide is self-contained.

## Build and Validation Workflow

After drafting the deck:

1. Render any required Mermaid diagrams first if the deck uses them.
2. Build targeted artifacts with:

```bash
npm run build:html -- --deck <deck>
npm run build:pdf -- --deck <deck>
```

3. Run local validation:

```bash
npm run validate:local
```

4. If the user wants full-site regeneration, use `npm run build` instead of only the targeted deck build.
5. Report the created source deck path plus the generated HTML and PDF artifact paths.

## Decision Points

- If a project exposes a strong official tagline, prefer it over a rewritten summary.
- If the tagline is catchy but unclear, keep the project name and replace the line with a clearer neutral summary.
- If categories are too broad, split them by use case.
- If categories are too thin, merge them for readability.
- If the user provides categories that conflict with the docs, preserve user intent but note the mismatch.
- If several projects are near-duplicates, keep the summary wording parallel so the slide is easy to compare.
- If a project's public front page does not clearly explain what it does, mark it as low confidence instead of inventing precision.
- If a date is needed on the cover, add it as its own line instead of changing the title or subtitle.

## Quality Bar

- Every project entry should be traceable to a visible official source.
- Summary lines should be concise, specific, and comparable across the deck.
- Categories should help the audience understand the landscape, not just alphabetize links.
- The deck should read as a curated taxonomy, not a dump of bookmarks.
- The title and subtitle should remain stable across runs unless the user explicitly requests different wording.
- HTML and PDF artifacts should be built before the task is considered complete.

## Output Expectations

When executing this skill, produce:

1. A normalized project inventory with category assignments and source URLs
2. A Marp source deck in `presentations/`
3. Built HTML and PDF artifacts
4. A short summary of any projects that remained ambiguous, weakly documented, or hard to categorize

## Companion Template

- Use [./assets/category-landscape-template.md](./assets/category-landscape-template.md) when you want a ready-to-fill Marp scaffold for this workflow.

## When to Use

- Turn a list of OSS links into a meetup-ready landscape deck
- Summarize several open source tools from their own docs without doing deep research on each codebase
- Compare a bounded set of tools across categories
- Build a category-based deck for discussion, selection, or curation
- Produce a quick showcase deck from GitHub repositories, docs sites, or project homepages

## Completion Check

The skill is complete when the repository contains a reviewable deck source plus built HTML and PDF artifacts, and each listed project has a concise line that can be traced back to its public landing materials.