import process from 'node:process'
import { execFile } from 'node:child_process'
import { basename } from 'node:path'
import { promisify } from 'node:util'

const rootDir = process.cwd()
const maxAttempts = 8
const retryDelayMs = 5000
const execFileAsync = promisify(execFile)

function trimTrailingSlash(value) {
  return value.replace(/\/+$/u, '')
}

function deriveSiteBaseUrlFromRemote(remoteUrl) {
  const trimmed = remoteUrl.trim()
  const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/u)

  if (sshMatch) {
    const [, owner, repo] = sshMatch
    return repo.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? `https://${owner}.github.io`
      : `https://${owner}.github.io/${repo}`
  }

  const httpsMatch = trimmed.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/u)

  if (httpsMatch) {
    const [, owner, repo] = httpsMatch
    return repo.toLowerCase() === `${owner.toLowerCase()}.github.io`
      ? `https://${owner}.github.io`
      : `https://${owner}.github.io/${repo}`
  }

  return null
}

async function resolveSiteBaseUrl() {
  const explicitSiteBaseUrl = process.env.PRESENTATION_SITE_URL

  if (typeof explicitSiteBaseUrl === 'string' && explicitSiteBaseUrl.trim().length > 0) {
    return trimTrailingSlash(explicitSiteBaseUrl.trim())
  }

  try {
    const { stdout } = await execFileAsync('git', ['-C', rootDir, 'remote', 'get-url', 'origin'])
    const derivedSiteBaseUrl = deriveSiteBaseUrlFromRemote(stdout.trim())

    if (derivedSiteBaseUrl) {
      return trimTrailingSlash(derivedSiteBaseUrl)
    }
  } catch {
    // Fall through to the final explicit failure below.
  }

  throw new Error(
    `Unable to resolve a published site URL. Set PRESENTATION_SITE_URL or configure a GitHub origin remote for ${basename(rootDir)}.`
  )
}

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

async function withRetry(label, action) {
  let lastError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await action(attempt)
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts) {
        break
      }

      console.log(`${label} is not ready yet (${error.message}). Retrying ${attempt + 1}/${maxAttempts}...`)
      await wait(retryDelayMs)
    }
  }

  throw lastError
}

function decodeHtmlEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

function extractHtmlTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)

  if (!titleMatch) {
    throw new Error('missing <title> element')
  }

  return decodeHtmlEntities(titleMatch[1]).replace(/\s+/gu, ' ').trim()
}

async function loadPublishedManifest(siteBaseUrl) {
  const manifestUrl = `${trimTrailingSlash(siteBaseUrl)}/presentation-manifest.json`

  return await withRetry('Published manifest', async () => {
    const response = await fetch(manifestUrl, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`received ${response.status()} from ${manifestUrl}`)
    }

    const payload = await response.json()

    if (!Array.isArray(payload)) {
      throw new Error(`expected an array manifest at ${manifestUrl}`)
    }

    return payload.map((entry) => ({
      title: entry.title,
      html: {
        url: entry.htmlUrl,
      },
      pdf: {
        url: entry.pdfUrl,
      },
    }))
  })
}

async function validateHtmlTitle(entry) {
  await withRetry(`HTML validation for ${entry.title}`, async () => {
    const response = await fetch(entry.html.url, {
      headers: {
        Accept: 'text/html',
      },
    })

    if (!response.ok) {
      throw new Error(`received ${response.status()} from ${entry.html.url}`)
    }

    const html = await response.text()
    const actualTitle = extractHtmlTitle(html)

    if (actualTitle !== entry.title) {
      throw new Error(`expected title "${entry.title}" but got "${actualTitle}"`)
    }

    console.log(`Validated HTML title for ${entry.title}: ${entry.html.url}`)
  })
}

async function validatePdfUrl(entry) {
  await withRetry(`PDF validation for ${entry.title}`, async () => {
    const response = await fetch(entry.pdf.url, {
      headers: {
        Accept: 'application/pdf',
      },
    })

    if (!response.ok) {
      throw new Error(`received ${response.status()} from ${entry.pdf.url}`)
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (!contentType.toLowerCase().includes('application/pdf')) {
      throw new Error(`expected a PDF response but got content-type "${contentType}"`)
    }

    console.log(`Validated PDF URL for ${entry.title}: ${entry.pdf.url}`)
  })
}

const siteBaseUrl = await resolveSiteBaseUrl()
const manifest = await loadPublishedManifest(siteBaseUrl)

if (manifest.length === 0) {
  console.log('No Marp decks found to validate.')
  process.exit(0)
}

console.log(`Validating published presentation URLs under ${siteBaseUrl}`)

for (const entry of manifest) {
  await validateHtmlTitle(entry)
  await validatePdfUrl(entry)
}
