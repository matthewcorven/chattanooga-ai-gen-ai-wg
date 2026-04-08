---
name: mermaid-technical-diagrams
description: 'Professional Mermaid authoring for architecture diagrams, flowcharts, sequence diagrams, C4 views, ERDs, and slide-ready SVG visuals. Use when creating or refining Mermaid diagrams for AI Night Markdown or Marp decks.'
argument-hint: 'Diagram goal, audience, diagram type, and systems involved'
---

# Mermaid Technical Diagrams

Use this skill when the fastest path to clarity is a diagram instead of another paragraph.

## When to Use

- Architecture overviews for a talk or companion brief
- Process and workflow visualizations
- Sequence diagrams for request or tool flows
- Lightweight C4 or system boundary diagrams
- Data or dependency relationships that need slide-friendly structure

## Procedure

1. Choose the diagram type that best expresses the relationship or flow.
2. Reduce the diagram to the smallest credible set of nodes, lanes, and labels.
3. Organize left-to-right or top-to-bottom so it reads cleanly in a slide.
4. Save the Mermaid source as a `.mmd` file in a presentation asset folder.
5. Run `npm run build:mermaid` to generate the sibling `.svg` asset.
6. Embed the rendered SVG into the deck or Markdown artifact.

## Diagram quality rules

- Prefer 5 to 9 primary nodes on a slide-facing diagram.
- Keep edge labels short and specific.
- Split overview diagrams from detail diagrams instead of overloading one file.
- Use grouping only when it clarifies ownership or boundaries.

## References

- [Diagram guidance](./references/diagram-guidance.md)
- [Architecture template](./assets/architecture-template.mmd)
