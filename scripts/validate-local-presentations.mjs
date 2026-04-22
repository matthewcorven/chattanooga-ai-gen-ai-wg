import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { filterPresentationManifest } from './presentation-utils.mjs'

const rootDir = process.cwd()
const distManifestPath = path.resolve(rootDir, 'dist', 'presentation-manifest.json')

function parseCliOptions(rawArgs) {
  const options = {
    deck: null,
  }

  for (let index = 0; index < rawArgs.length; index += 1) {
    const argument = rawArgs[index]

    if (argument === '--deck') {
      const value = rawArgs[index + 1]

      if (!value || value.startsWith('--')) {
        console.error('--deck requires a presentation path or basename.')
        process.exit(1)
      }

      options.deck = value
      index += 1
      continue
    }

    console.error(`Unknown option: ${argument}`)
    process.exit(1)
  }

  return options
}

async function loadBuiltManifest() {
  try {
    const rawManifest = await readFile(distManifestPath, 'utf8')
    const parsedManifest = JSON.parse(rawManifest)

    return parsedManifest.map((entry) => ({
      ...entry,
      sourcePath: path.resolve(rootDir, entry.source),
    }))
  } catch (error) {
    throw new Error(
      `Unable to read ${path.relative(rootDir, distManifestPath)}. Run a presentation build before validate:local. ${error.message}`
    )
  }
}

async function validateLocalPresentation(browserContext, entry) {
  const page = await browserContext.newPage()
  const localHtmlUrl = pathToFileURL(path.resolve(rootDir, 'dist', entry.htmlPath)).href

  try {
    await page.goto(localHtmlUrl, {
      waitUntil: 'load',
      timeout: 15000,
    })

    await page.waitForSelector('section.lead .cover-links', { timeout: 5000 })

    const actualTitle = await page.title()

    if (actualTitle !== entry.title) {
      throw new Error(`expected title "${entry.title}" but got "${actualTitle}"`)
    }

    const layout = await page.evaluate(() => {
      const leadSection = document.querySelector('section.lead')

      if (!leadSection) {
        throw new Error('missing lead slide section')
      }

      const coverLinks = leadSection.querySelector('.cover-links')

      if (!coverLinks) {
        throw new Error('missing QR cover links block')
      }

      const labels = Array.from(leadSection.querySelectorAll('.cover-link-title')).map((node) =>
        node.textContent?.trim() ?? ''
      )
      const subtitle = leadSection.querySelector('p')
      const coverLinksRect = coverLinks.getBoundingClientRect()
      const subtitleRect = subtitle?.getBoundingClientRect() ?? null

      return {
        labels,
        coverLinksTop: coverLinksRect.top,
        subtitleBottom: subtitleRect?.bottom ?? null,
      }
    })

    const expectedLabels = ['Live HTML', 'Share PDF']

    if (layout.labels.length !== expectedLabels.length) {
      throw new Error(`expected ${expectedLabels.length} QR labels but found ${layout.labels.length}`)
    }

    for (let index = 0; index < expectedLabels.length; index += 1) {
      if (layout.labels[index] !== expectedLabels[index]) {
        throw new Error(
          `expected QR label ${index + 1} to be "${expectedLabels[index]}" but got "${layout.labels[index]}"`
        )
      }
    }

    if (
      typeof layout.subtitleBottom === 'number' &&
      layout.coverLinksTop + 0.5 < layout.subtitleBottom
    ) {
      throw new Error(
        `QR block overlaps lead subtitle (cover top ${layout.coverLinksTop.toFixed(2)} < subtitle bottom ${layout.subtitleBottom.toFixed(2)})`
      )
    }

    console.log(`Validated local deck layout for ${entry.title}: ${localHtmlUrl}`)
  } finally {
    await page.close()
  }
}

const options = parseCliOptions(process.argv.slice(2))
const builtManifest = filterPresentationManifest(await loadBuiltManifest(), options.deck)

if (builtManifest.length === 0) {
  console.log('No built presentations found to validate locally.')
  process.exit(0)
}

const browser = await chromium.launch({ headless: true })
const browserContext = await browser.newContext()

try {
  for (const entry of builtManifest) {
    await validateLocalPresentation(browserContext, entry)
  }
} finally {
  await browserContext.close()
  await browser.close()
}