# AI Night Repository Guidance

- Treat this repository as a Markdown-first publishing workspace for meetup decks, handouts, and diagram assets.
- Keep source Marp decks in `presentations/` and Mermaid source diagrams in nearby `assets/` folders as `.mmd` files.
- Prefer concise slides: one major point per slide, a maximum of roughly five bullets, and diagrams over dense prose.
- For news or source-backed decks, every factual bullet should carry a superscript appendix link to a source slide, and the appendix should list the linked sources for that bullet or bullet cluster.
- Before final export of a source-backed deck, use a subagent such as `News Source Validator` to verify that each bullet's wording accurately matches the linked material.
- Use the `ai-night` Marp theme unless a task explicitly requires a different visual treatment.
- Do not hand-edit generated `dist/` output files unless the task explicitly asks for generated artifacts to be committed.
- When a deck uses Mermaid, render the sibling `.svg` asset before building HTML or PDF output.
