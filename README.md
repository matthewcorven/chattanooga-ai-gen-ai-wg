# AI Night Content Studio

This workspace is set up for Markdown-first authoring of AI Night material: Marp slide decks, Mermaid diagrams, technical handouts, and exported HTML/PDF artifacts.

## Included workflow

- Workspace-local Copilot skills for technical Markdown, Mermaid diagramming, and Marp presentation production
- Specialist Copilot agents for slide editing, diagram editing, and release-style build/export work
- A repo theme for consistent AI Night branding across decks
- Build scripts that render Mermaid `.mmd` files into sibling `.svg` assets and publish Marp decks into `dist/html` and `dist/pdf`
- A source-backed news workflow that requires superscript appendix links and a validation pass for factual bullets

## Repository layout

- `presentations/`: source Marp decks
- `presentations/assets/`: source Mermaid diagrams and rendered SVG assets used by decks
- `themes/`: Marp theme CSS
- `scripts/`: build helpers
- `.github/skills/`: shared Copilot skills for this repo
- `.github/agents/`: shared specialist Copilot agents for this repo
- `.github/instructions/`: file-specific authoring rules

## Commands

```bash
npm install
npm run build:mermaid
npm run build:html
npm run build:pdf
npm run build
npm run preview
npm run verify
```

## Copilot customizations

Skills available through slash commands:

- `/technical-markdown-authoring`
- `/mermaid-technical-diagrams`
- `/marp-presentation-production`

Agents available in the agent picker:

- `Marp Deck Editor`
- `Mermaid Diagram Editor`
- `News Source Validator`
- `Presentation Build Producer`

## Working model

1. Draft the deck or handout in Markdown.
2. Keep Mermaid source diagrams as `.mmd` files beside the deck assets.
3. Run `npm run build:mermaid` to render slide-ready SVG assets.
4. For source-backed decks, add visible appendix links and validate them with the `News Source Validator` subagent.
5. Run `npm run build:html` for live presentation output.
6. Run `npm run build:pdf` for a shareable artifact.

## Prerequisites

- Node.js 20 or newer
- Chrome, Edge, or Firefox installed locally for Marp PDF generation
