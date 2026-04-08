---
name: marp-presentation-production
description: 'Professional Marp deck authoring, technical presentation editing, narrative polishing, and HTML/PDF artifact generation. Use when creating or revising AI Night slide decks for live presentation or sharing.'
argument-hint: 'Topic, audience, talk length, desired outputs, and visual tone'
---

# Marp Presentation Production

Use this skill for slide decks that need to be technically strong, visually controlled, and ready to export.

## When to Use

- Technical talks and meetup decks
- Lightning talks and sponsor-safe short presentations
- Deck polishing before an event
- HTML presentation output for delivery in a browser
- PDF output for post-event sharing

## Workflow

1. Start from a Marp deck structure sized to the talk length.
2. State the audience, outcome, and time budget in the deck plan before writing deep content.
3. Build one clear idea per slide and push overflow into speaker notes or a repo brief instead of bloating the deck.
4. Use rendered Mermaid SVGs when a diagram is needed.
5. For news or source-backed decks, add a superscript appendix link to every factual bullet and create appendix slides that hold the supporting sources.
6. Invoke the `News Source Validator` subagent to confirm that each bullet, appendix page, and linked material match in wording, date, and level of certainty.
7. Apply the repository theme and keep slide typography and spacing consistent.
8. Leave room for the build-generated lead-slide QR block or place `<!-- cover-links -->` where the QR cards should land.
9. Run `npm run build` or the focused build commands to produce HTML and PDF artifacts.
10. After push, rely on the publish workflow to validate the live HTML title and PDF URL.

## Deck Standard

- Open with a lead slide that establishes the promise of the talk.
- The lead slide should leave a clean zone for the HTML and PDF QR cards.
- Use section slides to reset attention during longer decks.
- Keep code and tables rare and purposeful.
- In source-backed decks, use visible appendix links instead of hiding all sourcing in notes.
- Close with a concrete takeaway, next step, or discussion prompt.

## References

- [Presentation standards](./references/presentation-standards.md)
- [News sourcing workflow](./references/news-source-validation.md)
- [Export workflow](./references/export-workflow.md)
- [News talk template](./assets/news-source-talk-template.md)
- [Technical talk template](./assets/technical-talk-template.md)
- [Lightning talk template](./assets/lightning-talk-template.md)
