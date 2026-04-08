# Presentation Standards

## Slide density

- One major idea per slide.
- Aim for 3 to 5 bullets when bullets are needed.
- Prefer diagrams, screenshots, and simple tables over long explanations.

## Narrative flow

- Title and promise
- Context and stakes
- Core explanation or demo path
- Evidence, lessons, or decision criteria
- Takeaway and next step

## Technical talk guidance

- Show the architecture before the implementation detail.
- Use code only when it teaches a pattern or a failure mode.
- Reserve one slide for tradeoffs or operational concerns.
- If a live demo exists, include a fallback slide with the result or architecture snapshot.

## Marp conventions

- Use `<!-- _class: lead -->` for the opening slide.
- Use `theme: ai-night` and `paginate: true` in frontmatter.
- Prefer local assets that can travel with HTML and PDF export.
- Use SVG diagrams where possible for clarity at projector scale.

## Final review checklist

- Does the title slide make the value of the talk obvious?
- Can each slide be explained in under two minutes?
- Are diagrams legible from the back of a room?
- Is the closing slide actionable rather than generic?
