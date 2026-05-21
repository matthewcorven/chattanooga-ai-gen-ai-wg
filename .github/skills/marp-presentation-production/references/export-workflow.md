# Export Workflow

## Commands

```bash
npm install
npm run build:mermaid
npm run build
npm run validate:local
npm run publish:wait -- --commit HEAD
```

Focused deck examples:

```bash
npm run build:html -- --deck 2026-04-the-end-of-flat-fee-ai
npm run build:pdf -- --deck presentations/2026-04-the-end-of-flat-fee-ai.md
```

## Output locations

- HTML decks: `dist/html/`
- PDF decks: `dist/pdf/`
- Build manifest: `dist/presentation-manifest.json`
- Rendered Mermaid SVG assets: sibling `.svg` files beside `.mmd` sources in `presentations/`

## Operational notes

- Marp PDF export requires a locally installed browser such as Chrome, Edge, or Firefox.
- Local assets are enabled for this repository because decks are expected to use nearby images and rendered SVG diagrams.
- HTML builds copy presentation-local static assets into `dist/html/` so published decks keep their diagrams and screenshots.
- Build Mermaid diagrams before HTML or PDF export so the deck has concrete assets to embed.
- The build injects lead-slide QR codes that point to the published HTML and PDF URLs derived from `origin` or `PRESENTATION_SITE_URL`.
- `npm run build:html -- --deck <deck>` and `npm run build:pdf -- --deck <deck>` limit output to one deck for faster iteration.
- `npm run validate:local` checks built HTML decks for the expected QR card labels and verifies the QR block does not overlap the lead-slide subtitle.
- `npm run publish:wait -- --commit HEAD` waits for the `Publish Presentations` workflow for the pushed commit and reports the final build, deploy, and validation job results in one response.
- Pushing `main` still publishes `dist/` to GitHub Pages and then validates the live HTML title and PDF URL with Playwright.

## Validation

- Run `npm run verify` before sharing a deck.
- Run `npm run validate:local` before push when QR placement, cover layout, or other build-time HTML details changed.
- After push, run `npm run publish:wait -- --commit HEAD` instead of manually polling `gh run` commands.
- Inspect the HTML output for layout or overflow issues that do not show up in raw Markdown.
- Inspect the PDF output for cropped code blocks, oversized tables, or diagrams with unreadable labels.
- If you need to validate another published environment, set `PRESENTATION_SITE_URL` before running `npm run validate:published`.
