# Diagram Guidance

## Type selection

- `flowchart`: process, decision points, dependency flow, delivery pipelines
- `sequenceDiagram`: time-ordered interaction, request paths, protocol or agent exchanges
- `erDiagram`: relational data modeling and ownership
- `architecture-beta` or C4-style flowchart: system boundaries and components
- `stateDiagram-v2`: lifecycle transitions and control logic

## Slide-fit rules

- Use one diagram per point.
- Avoid more than two layers of nesting.
- If labels exceed a short phrase, the diagram probably wants to be split or supported by speaker notes or a brief.
- Prefer stable nouns for nodes and active verbs for edges.

## Layout rules

- Left to right for pipelines and transformations.
- Top to bottom for decision trees.
- Keep external actors at the edge of the diagram, not in the middle.
- Group infrastructure, services, and users into distinct visual regions.

## Export rules

- Render to SVG for crisp scaling in Marp and GitHub preview.
- Keep the `.mmd` source under version control next to the deck or doc that uses it.
- Re-render after structural edits so the SVG stays current.
