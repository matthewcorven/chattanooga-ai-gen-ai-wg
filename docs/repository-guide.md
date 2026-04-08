# AI Night Repository Guide

This repository is the working studio behind AI Night decks, diagrams, and published presentation artifacts.

## What Lives Here

- Marp slide decks under `presentations/`
- Mermaid source diagrams and rendered SVG assets under nearby `assets/` folders
- Shared Copilot skills, agents, and authoring instructions under `.github/`
- Build and publish automation under `scripts/` and `.github/workflows/`

## Repository Layout

- `presentations/`: source Marp decks
- `presentations/assets/`: Mermaid source and rendered SVGs used by decks
- `themes/`: Marp theme CSS
- `scripts/`: build and validation helpers
- `.github/skills/`: shared Copilot skills for this repo
- `.github/agents/`: shared specialist Copilot agents for this repo
- `.github/instructions/`: file-specific authoring rules
- `.github/workflows/`: GitHub Pages publishing and post-push validation automation

## Commands

```bash
npm install
npm run build:mermaid
npm run build:html
npm run build:pdf
npm run build
npm run preview
npm run validate:published
npm run verify
```

## Copilot Customizations

Skills available through slash commands:

- `/technical-markdown-authoring`
- `/mermaid-technical-diagrams`
- `/marp-presentation-production`

Agents available in the agent picker:

- `Marp Deck Editor`
- `Mermaid Diagram Editor`
- `News Source Validator`
- `Presentation Build Producer`

## Working Model

1. Draft the deck in Markdown.
2. Keep Mermaid source diagrams as `.mmd` files beside the deck assets.
3. Add `<!-- cover-links -->` to the opening slide if you want to pin QR placement; otherwise the build injects the cover QR block automatically.
4. Run `npm run build:mermaid` to render slide-ready SVG assets.
5. For source-backed decks, add visible appendix links and validate them with the `News Source Validator` subagent.
6. Run `npm run build` to generate HTML, PDF, copied HTML assets, and `dist/presentation-manifest.json`.
7. Push `main` to publish the artifacts to GitHub Pages and validate the live URLs.

## Published URL Model

- QR codes target the GitHub Pages URL inferred from `origin`.
- Override the destination base with `PRESENTATION_SITE_URL` if you need a custom domain or want to validate another published environment.
- Published URLs use `/html/...` and `/pdf/...`; local builds still land in `dist/html/` and `dist/pdf/`.

## Prerequisites

- Node.js 20 or newer
- Chrome, Edge, or Firefox installed locally for Marp PDF generation
- `npx playwright install chromium` if you want to run `npm run validate:published` locally
