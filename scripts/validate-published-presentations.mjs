import process from 'node:process'
import { chromium, request } from 'playwright'
import { buildPresentationManifest, resolveSiteBaseUrl } from './presentation-utils.mjs'

const rootDir = process.cwd()
const maxAttempts = 8
const retryDelayMs = 5000

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

async function validateHtmlTitle(browser, entry) {
  await withRetry(`HTML validation for ${entry.title}`, async () => {
    const page = await browser.newPage()

    try {
      const response = await page.goto(entry.html.url, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      })

      if (!response || !response.ok()) {
        const status = response ? response.status() : 'no-response'
        throw new Error(`received ${status} from ${entry.html.url}`)
      }

      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})

      const actualTitle = await page.title()

      if (actualTitle !== entry.title) {
        throw new Error(`expected title "${entry.title}" but got "${actualTitle}"`)
      }

      console.log(`Validated HTML title for ${entry.title}: ${entry.html.url}`)
    } finally {
      await page.close()
    }
  })
}

async function validatePdfUrl(requestContext, entry) {
  await withRetry(`PDF validation for ${entry.title}`, async () => {
    const response = await requestContext.get(entry.pdf.url, {
      timeout: 15000,
    })

    if (!response.ok()) {
      throw new Error(`received ${response.status()} from ${entry.pdf.url}`)
    }

    const contentType = response.headers()['content-type'] ?? ''

    if (!contentType.toLowerCase().includes('application/pdf')) {
      throw new Error(`expected a PDF response but got content-type "${contentType}"`)
    }

    console.log(`Validated PDF URL for ${entry.title}: ${entry.pdf.url}`)
  })
}

const siteBaseUrl = await resolveSiteBaseUrl(rootDir)
const manifest = await buildPresentationManifest(rootDir, siteBaseUrl)

if (manifest.length === 0) {
  console.log('No Marp decks found to validate.')
  process.exit(0)
}

console.log(`Validating published presentation URLs under ${siteBaseUrl}`)

const browser = await chromium.launch({ headless: true })
const browserContext = await browser.newContext()
const requestContext = await request.newContext()

try {
  for (const entry of manifest) {
    await validateHtmlTitle(browserContext, entry)
    await validatePdfUrl(requestContext, entry)
  }
} finally {
  await requestContext.dispose()
  await browserContext.close()
  await browser.close()
}
