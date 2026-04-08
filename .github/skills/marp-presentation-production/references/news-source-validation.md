# News Source Validation Workflow

Use this workflow for decks built from articles, announcements, interviews, roundups, or market-news timelines.

## Required pattern

1. Assign a stable appendix id for each factual bullet or tightly scoped bullet cluster, such as `A01`, `A02`, and so on.
2. Append a superscript link directly to the bullet text, for example `<sup><a href="#appendix-a01">A01</a></sup>`.
3. Create an appendix slide with a matching anchor id and a short claim statement.
4. List the supporting sources on that appendix slide as linked titles, not raw pasted URLs.
5. If the claim is a synthesis rather than a literal source statement, say so in the appendix slide.

## Validation step

Before final export, invoke the `News Source Validator` subagent.

Give it:

- The bullet text
- The appendix slide text
- The linked source material or article URLs

Ask it to verify:

- The date is accurate
- The source really supports the wording
- The certainty level matches the claim
- The appendix link points to the right source page

## Verdicts

- `exact`: the source directly supports the bullet as written
- `acceptable with softer wording`: the core idea is supported but the wording or date should be tightened
- `unsupported`: the source does not justify the bullet and should be replaced or removed

## Build rule

Do not ship a source-backed deck until every factual bullet has:

- A superscript appendix link
- A populated appendix page
- A validation pass from the subagent or equivalent manual review
