---
description: "Use when authoring AI Night Marp decks, Mermaid diagrams, or Markdown handouts. Covers slide density, source-backed bullet linking, validation workflow, Marp frontmatter, diagram placement, and HTML/PDF export conventions."
applyTo:
  - "presentations/**/*.md"
  - "presentations/**/*.mmd"
---
# AI Night Presentation Source Rules

- Marp decks should start with frontmatter that includes `marp: true`, `theme: ai-night`, `paginate: true`, and an explicit `title`.
- Default to 16:9 decks, concise headings, and one major takeaway per slide.
- For news or source-backed decks, every factual bullet should end with a superscript appendix link such as `A01` that points to an appendix slide containing the supporting sources.
- Appendix slides should include the exact claim or a short paraphrase plus linked source titles for that bullet or tightly scoped bullet cluster.
- Before export, use the `News Source Validator` subagent to compare the bullet text, appendix links, and the linked source material; soften wording or adjust dates where the source is weaker than the claim.
- Use Mermaid for architecture, process, sequence, and system relationship diagrams. Keep `.mmd` source next to the deck assets and render a sibling `.svg` for slide inclusion.
- Prefer SVG diagrams and local assets that can be bundled into HTML and PDF output.
- If a slide is becoming dense, move explanation into a companion Markdown handout instead of turning the slide into prose.
- Final presentation output belongs in `dist/html` for browser delivery and `dist/pdf` for shareable leave-behinds.
