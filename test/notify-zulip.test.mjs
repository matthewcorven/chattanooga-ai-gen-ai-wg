import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildWorkflowRunUrl,
  composeZulipPublishMessage,
  formatDeckLabel,
  selectDecksForNotification,
} from '../scripts/notify-zulip.mjs'

function createManifestEntry(relativeSourcePath, title) {
  return {
    relativeSourcePath,
    title,
    html: {
      url: `https://example.com/html/${relativeSourcePath.replace(/\.md$/u, '.html')}`,
    },
    pdf: {
      url: `https://example.com/pdf/${relativeSourcePath.replace(/\.md$/u, '.pdf')}`,
    },
  }
}

test('selectDecksForNotification returns matching changed deck entries', () => {
  const manifest = [
    createManifestEntry('2026-06-agents-local-ai-and-the-cost-reality.md', 'Agents, Local AI, and the Cost Reality'),
    createManifestEntry('2026-06-open-source-ai-builder-landscape.md', 'Open Source AI Builder Landscape'),
  ]

  const selected = selectDecksForNotification(manifest, [
    'README.md',
    'presentations/2026-06-open-source-ai-builder-landscape.md',
  ])

  assert.deepEqual(selected, [manifest[1]])
})

test('selectDecksForNotification falls back to the full manifest when no deck files changed', () => {
  const manifest = [
    createManifestEntry('2026-06-agents-local-ai-and-the-cost-reality.md', 'Agents, Local AI, and the Cost Reality'),
    createManifestEntry('2026-06-open-source-ai-builder-landscape.md', 'Open Source AI Builder Landscape'),
  ]

  const selected = selectDecksForNotification(manifest, ['themes/ai-night.css', 'scripts/build-marp.mjs'])

  assert.deepEqual(selected, manifest)
})

test('buildWorkflowRunUrl returns the GitHub Actions run URL when context is complete', () => {
  assert.equal(
    buildWorkflowRunUrl({
      serverUrl: 'https://github.com',
      repository: 'matthewcorven/chattanooga-ai-gen-ai-wg',
      runId: '123456789',
    }),
    'https://github.com/matthewcorven/chattanooga-ai-gen-ai-wg/actions/runs/123456789'
  )
})

test('formatDeckLabel prefixes the title with the YYYY-MM date from the deck filename', () => {
  assert.equal(
    formatDeckLabel(
      createManifestEntry('2026-06-open-source-ai-builder-landscape.md', 'Open Source AI Builder Landscape')
    ),
    '2026-06 Open Source AI Builder Landscape'
  )
})

test('composeZulipPublishMessage includes base URL, per-deck links, and workflow run link', () => {
  const message = composeZulipPublishMessage({
    siteBaseUrl: 'https://matthewcorven.github.io/chattanooga-ai-gen-ai-wg/',
    decks: [createManifestEntry('2026-06-open-source-ai-builder-landscape.md', 'Open Source AI Builder Landscape')],
    totalDeckCount: 8,
    workflowRunUrl: 'https://github.com/matthewcorven/chattanooga-ai-gen-ai-wg/actions/runs/123456789',
  })

  assert.match(message, /Published Chattanooga Generative AI Working Group presentations to \[GitHub Pages\]\(https:\/\/matthewcorven\.github\.io\/chattanooga-ai-gen-ai-wg\)\./u)
  assert.match(message, /Decks changed in this publish \(1 of 8 total\):/u)
  assert.match(message, /\[2026-06 Open Source AI Builder Landscape\]\(https:\/\/example\.com\/html\/2026-06-open-source-ai-builder-landscape\.html\) \| \[PDF\]\(https:\/\/example\.com\/pdf\/2026-06-open-source-ai-builder-landscape\.pdf\)/u)
  assert.match(message, /Workflow run: \[GitHub Actions\]\(https:\/\/github\.com\/matthewcorven\/chattanooga-ai-gen-ai-wg\/actions\/runs\/123456789\)/u)
})