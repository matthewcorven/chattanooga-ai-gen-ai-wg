import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { buildPresentationManifest } from './presentation-utils.mjs'

function trimTrailingSlash(value) {
  return value.replace(/\/+$/u, '')
}

export function normalizeRepoPath(value) {
  return value.split(path.sep).join('/').replace(/^\.\//u, '')
}

export function selectDecksForNotification(manifest, changedFiles) {
  if (!Array.isArray(changedFiles) || changedFiles.length === 0) {
    return manifest
  }

  const changedDeckPaths = new Set(
    changedFiles
      .map((filePath) => normalizeRepoPath(filePath.trim()))
      .filter((filePath) => filePath.startsWith('presentations/') && filePath.endsWith('.md'))
      .map((filePath) => filePath.replace(/^presentations\//u, ''))
  )

  if (changedDeckPaths.size === 0) {
    return manifest
  }

  const changedDecks = manifest.filter((entry) => changedDeckPaths.has(normalizeRepoPath(entry.relativeSourcePath)))

  return changedDecks.length > 0 ? changedDecks : manifest
}

export function buildWorkflowRunUrl({ serverUrl, repository, runId }) {
  if (
    typeof serverUrl !== 'string' ||
    serverUrl.trim().length === 0 ||
    typeof repository !== 'string' ||
    repository.trim().length === 0 ||
    typeof runId !== 'string' ||
    runId.trim().length === 0
  ) {
    return null
  }

  return `${trimTrailingSlash(serverUrl.trim())}/${repository.trim()}/actions/runs/${runId.trim()}`
}

export function formatDeckLabel(entry) {
  const relativeSourcePath = typeof entry?.relativeSourcePath === 'string' ? entry.relativeSourcePath : ''
  const title = typeof entry?.title === 'string' ? entry.title.trim() : ''
  const datePrefixMatch = path.basename(relativeSourcePath).match(/^(\d{4}-\d{2})-/u)

  if (!title) {
    return datePrefixMatch ? datePrefixMatch[1] : relativeSourcePath
  }

  if (!datePrefixMatch) {
    return title
  }

  return title.startsWith(`${datePrefixMatch[1]} `) || title.startsWith(`${datePrefixMatch[1]}:`)
    ? title
    : `${datePrefixMatch[1]} ${title}`
}

export function composeZulipPublishMessage({ siteBaseUrl, decks, totalDeckCount, workflowRunUrl }) {
  const normalizedSiteBaseUrl = trimTrailingSlash(siteBaseUrl)
  const includesAllDecks = decks.length === totalDeckCount
  const heading = includesAllDecks
    ? 'Published decks:'
    : `Decks changed in this publish (${decks.length} of ${totalDeckCount} total):`

  const lines = [
    `Published Chattanooga Generative AI Working Group presentations to [GitHub Pages](${normalizedSiteBaseUrl}).`,
    '',
    heading,
    ...decks.map((entry) => `- [${formatDeckLabel(entry)}](${entry.html.url}) | [PDF](${entry.pdf.url})`),
    '',
    `Browse all decks: [HTML](${normalizedSiteBaseUrl}/html/) | [PDF](${normalizedSiteBaseUrl}/pdf/)`,
  ]

  if (workflowRunUrl) {
    lines.push(`Workflow run: [GitHub Actions](${workflowRunUrl})`)
  }

  return `${lines.join('\n')}\n`
}

async function sendZulipStreamMessage({ orgUrl, botEmail, botApiKey, stream, topic, content }) {
  const endpoint = `${trimTrailingSlash(orgUrl)}/api/v1/messages`
  const requestBody = new URLSearchParams({
    type: 'stream',
    to: stream,
    topic,
    content,
  })

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${botEmail}:${botApiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.result !== 'success') {
    const detail = payload?.msg ?? `${response.status} ${response.statusText}`
    throw new Error(`Zulip notification failed: ${detail}`)
  }

  return payload
}

async function main() {
  const {
    CHATTAIPUBLISHINGBOTEMAIL,
    CHATTAIPUBLISHINGBOTKEY,
    GITHUB_REPOSITORY,
    GITHUB_RUN_ID,
    GITHUB_SERVER_URL,
    PRESENTATION_SITE_URL,
    ZULIP_CHANGED_FILES,
    ZULIP_MESSAGE_OUTPUT_PATH,
    ZULIP_ORG_URL,
    ZULIP_STREAM = 'general',
    ZULIP_TOPIC = 'Meet Presentation Decks',
  } = process.env

  if (typeof ZULIP_ORG_URL !== 'string' || ZULIP_ORG_URL.trim().length === 0) {
    throw new Error('ZULIP_ORG_URL is required.')
  }

  if (
    typeof CHATTAIPUBLISHINGBOTEMAIL !== 'string' ||
    CHATTAIPUBLISHINGBOTEMAIL.trim().length === 0 ||
    typeof CHATTAIPUBLISHINGBOTKEY !== 'string' ||
    CHATTAIPUBLISHINGBOTKEY.trim().length === 0
  ) {
    throw new Error('CHATTAIPUBLISHINGBOTEMAIL and CHATTAIPUBLISHINGBOTKEY are required.')
  }

  const manifest = await buildPresentationManifest(process.cwd(), PRESENTATION_SITE_URL)
  const changedFiles = typeof ZULIP_CHANGED_FILES === 'string'
    ? ZULIP_CHANGED_FILES.split(/\r?\n/u).filter((value) => value.trim().length > 0)
    : []

  const decks = selectDecksForNotification(manifest, changedFiles)
  const workflowRunUrl = buildWorkflowRunUrl({
    serverUrl: GITHUB_SERVER_URL,
    repository: GITHUB_REPOSITORY,
    runId: GITHUB_RUN_ID,
  })
  const message = composeZulipPublishMessage({
    siteBaseUrl: PRESENTATION_SITE_URL,
    decks,
    totalDeckCount: manifest.length,
    workflowRunUrl,
  })

  if (typeof ZULIP_MESSAGE_OUTPUT_PATH === 'string' && ZULIP_MESSAGE_OUTPUT_PATH.trim().length > 0) {
    await writeFile(ZULIP_MESSAGE_OUTPUT_PATH, message, 'utf8')
  }

  process.stdout.write(message)

  await sendZulipStreamMessage({
    orgUrl: ZULIP_ORG_URL,
    botEmail: CHATTAIPUBLISHINGBOTEMAIL,
    botApiKey: CHATTAIPUBLISHINGBOTKEY,
    stream: ZULIP_STREAM,
    topic: ZULIP_TOPIC,
    content: message,
  })
}

const entryPoint = process.argv[1] ? path.resolve(process.argv[1]) : null
const modulePath = fileURLToPath(import.meta.url)

if (entryPoint === modulePath) {
  await main()
}