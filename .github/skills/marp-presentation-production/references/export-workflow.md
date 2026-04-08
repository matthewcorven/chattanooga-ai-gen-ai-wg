# Export Workflow

## Commands

```bash
npm install
npm run build:mermaid
npm run build:html
npm run build:pdf
```

## Output locations

- HTML decks: `dist/html/`
- PDF decks: `dist/pdf/`
- Rendered Mermaid SVG assets: sibling `.svg` files beside `.mmd` sources in `presentations/`

## Operational notes

- Marp PDF export requires a locally installed browser such as Chrome, Edge, or Firefox.
- Local assets are enabled for this repository because decks are expected to use nearby images and rendered SVG diagrams.
- Build Mermaid diagrams before HTML or PDF export so the deck has concrete assets to embed.

## Validation

- Run `npm run verify` before sharing a deck.
- Inspect the HTML output for layout or overflow issues that do not show up in raw Markdown.
- Inspect the PDF output for cropped code blocks, oversized tables, or diagrams with unreadable labels.
