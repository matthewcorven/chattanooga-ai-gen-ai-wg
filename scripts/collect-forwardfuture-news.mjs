import process from 'node:process'

const ARCHIVE_URL = 'https://forwardfuture.ai/newsletter-archive'
const ISSUE_BASE_URL = 'https://briefing.forwardfuture.ai'
const DEFAULT_DAYS = 14
const DEFAULT_LIMIT_ITEMS = 8

const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const IGNORED_SECTION_PATTERNS = [
  /^POWERED BY/u,
  /^VIDEO$/u,
  /^TFT POLL$/u,
  /^INTERVIEW$/u,
  /^MONETIZATION$/u,
  /^ADVERTISEMENT$/u,
  /^SPONSORED$/u,
]

const IGNORED_STORY_HOST_SUFFIXES = [
  'forwardfuture.ai',
  'briefing.forwardfuture.ai',
  'youtube.com',
  'x.com',
  'twitter.com',
  'salesforce.com',
  'box.com',
  'accio.com',
  'recall.it',
  'recraft.ai',
]

const MULTI_STORY_HEADING_PATTERNS = [/^Top Stories\b/iu, /^What Else is Happening$/iu]

function printUsage() {
  console.log(`Forward Future archive collector

Usage:
  node ./scripts/collect-forwardfuture-news.mjs [options]

Options:
  --days <n>           Rolling window ending today or --end. Default: 14
  --start <date>      Inclusive start date in YYYY-MM-DD
  --end <date>        Inclusive end date in YYYY-MM-DD
  --limit-issues <n>  Maximum number of issues to emit
  --limit-items <n>   Maximum linked stories per issue when --with-items is set. Default: 8
  --with-items        Fetch each issue page and extract linked story items
  --format <type>     markdown or json. Default: markdown
  --help              Show this message

Examples:
  node ./scripts/collect-forwardfuture-news.mjs --days 14 --with-items
  node ./scripts/collect-forwardfuture-news.mjs --start 2026-04-08 --end 2026-04-22 --format json
  npm run --silent scout:forwardfuture -- --days 14 --with-items --format json

Automation note:
  Plain \`npm run scout:forwardfuture\` prepends npm banner lines before stdout.
  For jq or other machine parsing, prefer invoking this script directly or use
  \`npm run --silent scout:forwardfuture -- ...\`.
`)
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

function parsePositiveInteger(rawValue, optionName) {
  const value = Number.parseInt(rawValue, 10)

  if (!Number.isInteger(value) || value <= 0) {
    fail(`${optionName} must be a positive integer.`)
  }

  return value
}

function parseIsoDate(rawValue, optionName) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(rawValue)

  if (!match) {
    fail(`${optionName} must use YYYY-MM-DD.`)
  }

  const year = Number.parseInt(match[1], 10)
  const month = Number.parseInt(match[2], 10) - 1
  const day = Number.parseInt(match[3], 10)
  const date = new Date(Date.UTC(year, month, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    fail(`${optionName} is not a valid date.`)
  }

  return date
}

function formatIsoDate(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date, dayCount) {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + dayCount)
  return next
}

function compareDatesDescending(left, right) {
  return right.publishedDate.getTime() - left.publishedDate.getTime()
}

function decodeHtmlEntities(value) {
  if (!value) {
    return ''
  }

  const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    hellip: '...',
    nbsp: ' ',
    ndash: '-',
    mdash: '-',
    lsquo: "'",
    rsquo: "'",
    ldquo: '"',
    rdquo: '"',
    lt: '<',
    quot: '"',
  }

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/gu, (match, entity) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
    }

    if (entity.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))
    }

    return namedEntities[entity] ?? match
  })
}

function stripTags(value) {
  return value.replace(/<[^>]+>/gu, ' ')
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/gu, ' ').trim()
}

function toPlainText(value) {
  return normalizeWhitespace(decodeHtmlEntities(stripTags(value)))
}

function parseDisplayDate(rawValue) {
  const match = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/u.exec(rawValue)

  if (!match) {
    return null
  }

  const month = MONTH_INDEX[match[1]]
  const day = Number.parseInt(match[2], 10)
  const year = Number.parseInt(match[3], 10)

  if (month === undefined) {
    return null
  }

  return new Date(Date.UTC(year, month, day))
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'ai-night-forwardfuture-scout/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`)
  }

  return response.text()
}

function buildIssueRecord(card) {
  const publishedDate = parseDisplayDate(card.displayDate)

  if (!publishedDate) {
    return null
  }

  return {
    slug: card.slug,
    url: `${ISSUE_BASE_URL}/p/${card.slug}`,
    title: card.title,
    summary: card.summary,
    displayDate: card.displayDate,
    publishedDate,
    publishedAt: formatIsoDate(publishedDate),
    readTimeText: null,
    readTimeMinutes: null,
  }
}

function extractArchiveIssuesFromHtml(html) {
  const slugPattern = /href="https:\/\/briefing\.forwardfuture\.ai\/p\/(?<slug>[a-z0-9-]+)"/gu
  const issues = []
  const seenSlugs = new Set()

  for (const match of html.matchAll(slugPattern)) {
    const slug = match.groups?.slug

    if (!slug || seenSlugs.has(slug)) {
      continue
    }

    const startIndex = match.index ?? 0
    const nextListItemIndex = html.indexOf('</a></li>', startIndex)
    const snippetEnd = nextListItemIndex >= 0 ? nextListItemIndex : startIndex + 6000
    const snippet = html.slice(startIndex, Math.min(html.length, snippetEnd + 8))

    const spanTexts = [...snippet.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/giu)]
      .map((spanMatch) => toPlainText(spanMatch[1] ?? ''))
      .filter(Boolean)

    const displayDate = spanTexts.find((text) => /^([A-Z][a-z]{2}) \d{1,2}, \d{4}$/u.test(text)) ?? ''
    const dateIndex = spanTexts.indexOf(displayDate)
    const title = dateIndex > 0 ? spanTexts[dateIndex - 1] : ''
    const summary = dateIndex >= 0 ? spanTexts[dateIndex + 1] ?? '' : ''

    const issue = buildIssueRecord({
      slug,
      title,
      displayDate,
      summary,
    })

    if (!issue) {
      continue
    }

    issues.push(issue)
    seenSlugs.add(slug)
  }

  return issues.sort(compareDatesDescending)
}

function dedupeIssues(issues) {
  const seen = new Set()
  const deduped = []

  for (const issue of issues) {
    if (seen.has(issue.slug)) {
      continue
    }

    seen.add(issue.slug)
    deduped.push(issue)
  }

  return deduped.sort(compareDatesDescending)
}

function filterIssuesByWindow(issues, startDate, endDate, limitIssues) {
  return dedupeIssues(
    issues.filter((issue) => {
      const timestamp = issue.publishedDate.getTime()
      return timestamp >= startDate.getTime() && timestamp <= endDate.getTime()
    })
  ).slice(0, limitIssues)
}

function shouldIgnoreStoryUrl(href) {
  if (!href || !href.startsWith('http')) {
    return true
  }

  const url = new URL(href)
  const hostname = url.hostname.replace(/^www\./u, '')

  return IGNORED_STORY_HOST_SUFFIXES.some(
    (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
  )
}

function trimStorySummary(text, headline) {
  let summary = text.trim()

  if (headline && summary.startsWith(headline)) {
    summary = summary.slice(headline.length).trim().replace(/^:/u, '').trim()
  }

  return summary
    .replace(/→\s*Read the full (article|paper) here\.?$/iu, '')
    .replace(/\s*\([Pp]aywall\)$/u, '')
    .replace(/\s*First time reading\?.*$/iu, '')
    .trim()
}

function isMeaningfulParagraph(text) {
  if (!text || text.length < 30) {
    return false
  }

  return ![
    /share it with a friend/iu,
    /First time reading/iu,
    /Login or Subscribe/iu,
    /Start creating with/iu,
    /^Thanks for reading/iu,
    /^We read every response/iu,
    /^Good morning\./iu,
    /^Posts\s+/iu,
  ].some((pattern) => pattern.test(text))
}

function collectParagraphTexts(html) {
  return [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/giu)]
    .map((paragraphMatch) => toPlainText(paragraphMatch[1] ?? ''))
    .filter(Boolean)
}

function collectParagraphs(html) {
  return [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/giu)]
    .map((paragraphMatch) => ({
      html: paragraphMatch[1] ?? '',
      text: toPlainText(paragraphMatch[1] ?? ''),
    }))
    .filter((paragraph) => Boolean(paragraph.text))
}

function collectAnchors(html) {
  return [...html.matchAll(/<a href="(?<url>https:\/\/[^"#]+)"[^>]*>(?<content>[\s\S]*?)<\/a>/giu)]
    .map((anchorMatch) => ({
      url: decodeHtmlEntities(anchorMatch.groups?.url ?? ''),
      text: toPlainText(anchorMatch.groups?.content ?? ''),
    }))
    .filter((anchor) => anchor.url)
}

function getFirstEligibleAnchor(html) {
  return collectAnchors(html).find((anchor) => !shouldIgnoreStoryUrl(anchor.url)) ?? null
}

function extractReadMoreUrl(content) {
  const readMoreMatch = content.match(
    /<a href="(?<url>https:\/\/[^"#]+)"[^>]*>[\s\S]*?Read the full (article|paper) here[\s\S]*?<\/a>/iu
  )

  return decodeHtmlEntities(readMoreMatch?.groups?.url ?? '')
}

function splitParagraphHtmlAtBreak(paragraphHtml) {
  const breakMatch = /<br\s*\/?>/iu.exec(paragraphHtml)

  if (!breakMatch) {
    return null
  }

  return {
    before: paragraphHtml.slice(0, breakMatch.index),
    after: paragraphHtml.slice(breakMatch.index + breakMatch[0].length),
  }
}

function isMultiStoryHeading(heading) {
  return MULTI_STORY_HEADING_PATTERNS.some((pattern) => pattern.test(heading))
}

function extractSectionSlices(html) {
  const h5Pattern = /<h5[^>]*>(?<section>[\s\S]*?)<\/h5>/giu
  const h1Pattern = /<h1[^>]*>(?<heading>[\s\S]*?)<\/h1>/giu
  const headers = []

  for (const h5Match of html.matchAll(h5Pattern)) {
    const start = h5Match.index ?? 0
    h1Pattern.lastIndex = start + h5Match[0].length
    const h1Match = h1Pattern.exec(html)

    if (!h1Match) {
      continue
    }

    headers.push({
      section: toPlainText(h5Match.groups?.section ?? ''),
      heading: toPlainText(h1Match.groups?.heading ?? ''),
      start,
      contentStart: (h1Match.index ?? 0) + h1Match[0].length,
    })
  }

  return headers.map((header, index) => ({
    ...header,
    content: html.slice(header.contentStart, headers[index + 1]?.start ?? html.length),
  }))
}

function extractIssueSummaryFromHtml(html) {
  const headingMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)

  if (!headingMatch) {
    return ''
  }

  const afterHeading = html.slice(headingMatch.index + headingMatch[0].length)
  const beforeFirstSection = afterHeading.split(/<h5[^>]*>/iu)[0]

  return collectParagraphTexts(beforeFirstSection).find((text) => isMeaningfulParagraph(text)) ?? ''
}

function extractMultiStoryItem(section, group, paragraph) {
  const firstAnchor = getFirstEligibleAnchor(paragraph.html)

  if (!firstAnchor) {
    return null
  }

  const splitParagraph = splitParagraphHtmlAtBreak(paragraph.html)
  let headline = ''
  let summary = ''

  if (splitParagraph) {
    headline = toPlainText(splitParagraph.before).replace(/:$/u, '').trim()
    summary = trimStorySummary(toPlainText(splitParagraph.after), '')
  } else if (paragraph.text.includes(' : ')) {
    const [headlinePart, ...summaryParts] = paragraph.text.split(' : ')
    headline = headlinePart.trim()
    summary = trimStorySummary(summaryParts.join(' : '), '')
  } else {
    headline = firstAnchor.text.replace(/:$/u, '').trim()
    summary = trimStorySummary(paragraph.text, headline)
  }

  if (!headline) {
    headline = firstAnchor.text.replace(/:$/u, '').trim()
  }

  if (!headline || !summary || !isMeaningfulParagraph(summary)) {
    return null
  }

  return {
    section,
    group,
    headline,
    summary,
    url: firstAnchor.url,
  }
}

function extractStoriesFromSection(sectionBlock) {
  const { section, heading, content } = sectionBlock

  if (!section || !heading) {
    return []
  }

  if (IGNORED_SECTION_PATTERNS.some((pattern) => pattern.test(section))) {
    return []
  }

  const paragraphs = collectParagraphs(content)

  if (isMultiStoryHeading(heading)) {
    return paragraphs
      .map((paragraph) => extractMultiStoryItem(section, heading, paragraph))
      .filter(Boolean)
  }

  const url = extractReadMoreUrl(content) || getFirstEligibleAnchor(content)?.url || ''

  if (shouldIgnoreStoryUrl(url)) {
    return []
  }

  const summary = normalizeWhitespace(
    paragraphs
      .map((paragraph) => paragraph.text)
      .filter((text) => isMeaningfulParagraph(text))
      .filter((text) => !/Read the full (article|paper) here/iu.test(text))
      .slice(0, 2)
      .join(' ')
  )

  if (!summary) {
    return []
  }

  return [
    {
      section,
      group: heading,
      headline: heading,
      summary,
      url,
    },
  ]
}

function extractSectionStories(html) {
  return extractSectionSlices(html).flatMap((sectionBlock) => extractStoriesFromSection(sectionBlock))
}

function dedupeStoryItems(items, limitItems) {
  const seen = new Set()
  const deduped = []

  for (const item of items) {
    if (seen.has(item.url)) {
      continue
    }

    seen.add(item.url)
    deduped.push(item)

    if (deduped.length >= limitItems) {
      break
    }
  }

  return deduped
}

function extractIssueStoriesFromHtml(html, limitItems) {
  return {
    issueSummary: extractIssueSummaryFromHtml(html),
    items: dedupeStoryItems(extractSectionStories(html).filter((item) => item.headline && item.url), limitItems),
  }
}

function formatIssueMarkdown(issue, includeItems) {
  const lines = []
  const heading = `- [${issue.title}](${issue.url})`
  const meta = [issue.displayDate]

  lines.push(`${heading} — ${meta.join(' • ')}`)

  if (issue.summary) {
    lines.push(`  Summary: ${issue.summary}`)
  }

  if (includeItems && issue.items?.length) {
    lines.push('  Linked stories:')

    for (const item of issue.items) {
      const sectionPrefix = item.section ? `${item.section}: ` : ''
      const summarySuffix = item.summary ? ` — ${item.summary}` : ''
      lines.push(`  - ${sectionPrefix}[${item.headline}](${item.url})${summarySuffix}`)
    }
  }

  return lines.join('\n')
}

function renderMarkdown(report, includeItems) {
  const lines = []

  lines.push('# Forward Future News Window')
  lines.push('')
  lines.push(`- Window: ${report.window.start} to ${report.window.end}`)
  lines.push(`- Source: ${report.source.name}`)
  lines.push(`- Archive: ${report.source.archiveUrl}`)
  lines.push(`- Issues: ${report.issues.length}`)

  if (includeItems) {
    lines.push('- Mode: issue cards plus linked stories')
  }

  for (const issue of report.issues) {
    lines.push('')
    lines.push(formatIssueMarkdown(issue, includeItems))
  }

  return `${lines.join('\n')}\n`
}

function parseArgs(argv) {
  const today = new Date()
  const options = {
    days: DEFAULT_DAYS,
    endDate: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())),
    format: 'markdown',
    includeItems: false,
    limitIssues: Number.POSITIVE_INFINITY,
    limitItems: DEFAULT_LIMIT_ITEMS,
    startDate: null,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    switch (argument) {
      case '--days':
        options.days = parsePositiveInteger(argv[index + 1], '--days')
        index += 1
        break
      case '--start':
        options.startDate = parseIsoDate(argv[index + 1], '--start')
        index += 1
        break
      case '--end':
        options.endDate = parseIsoDate(argv[index + 1], '--end')
        index += 1
        break
      case '--limit-issues':
        options.limitIssues = parsePositiveInteger(argv[index + 1], '--limit-issues')
        index += 1
        break
      case '--limit-items':
        options.limitItems = parsePositiveInteger(argv[index + 1], '--limit-items')
        index += 1
        break
      case '--format':
        options.format = argv[index + 1]
        index += 1
        break
      case '--with-items':
        options.includeItems = true
        break
      case '--help':
        printUsage()
        process.exit(0)
        break
      default:
        fail(`Unknown option: ${argument}`)
    }
  }

  if (!['json', 'markdown'].includes(options.format)) {
    fail('--format must be either json or markdown.')
  }

  if (!options.startDate) {
    options.startDate = addDays(options.endDate, -(options.days - 1))
  }

  if (options.startDate.getTime() > options.endDate.getTime()) {
    fail('--start must be on or before --end.')
  }

  return options
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const archiveHtml = await fetchText(ARCHIVE_URL)
  const archiveIssues = extractArchiveIssuesFromHtml(archiveHtml)
  const selectedIssues = filterIssuesByWindow(
    archiveIssues,
    options.startDate,
    options.endDate,
    options.limitIssues
  )

  if (options.includeItems) {
    for (const issue of selectedIssues) {
      const issueHtml = await fetchText(issue.url)
      const details = extractIssueStoriesFromHtml(issueHtml, options.limitItems)
      issue.summary = issue.summary || details.issueSummary
      issue.items = details.items
    }
  }

  const report = {
    source: {
      name: 'Forward Future',
      archiveUrl: ARCHIVE_URL,
      issueBaseUrl: ISSUE_BASE_URL,
    },
    window: {
      start: formatIsoDate(options.startDate),
      end: formatIsoDate(options.endDate),
      days: options.days,
    },
    issues: selectedIssues.map((issue) => ({
      slug: issue.slug,
      url: issue.url,
      title: issue.title,
      summary: issue.summary,
      displayDate: issue.displayDate,
      publishedAt: issue.publishedAt,
      readTimeText: issue.readTimeText,
      readTimeMinutes: issue.readTimeMinutes,
      items: issue.items ?? [],
    })),
  }

  if (options.format === 'json') {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  process.stdout.write(renderMarkdown(report, options.includeItems))
}

await main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})