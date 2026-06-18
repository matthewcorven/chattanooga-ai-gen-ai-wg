import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import QRCode from 'qrcode'
import {
  buildPresentationManifest,
  filterPresentationManifest,
  resolveSiteBaseUrl,
  writePresentationManifest,
} from './presentation-utils.mjs'

const rootDir = process.cwd()
const presentationsDir = path.resolve(rootDir, 'presentations')
const args = process.argv.slice(2)
const format = args[0]
const cliExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function parseCliOptions(rawArgs) {
  const options = {
    deck: null,
  }

  for (let index = 1; index < rawArgs.length; index += 1) {
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

if (format !== 'html' && format !== 'pdf') {
  console.error('Usage: node ./scripts/build-marp.mjs <html|pdf> [--deck <presentation>]')
  process.exit(1)
}

const options = parseCliOptions(args)

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      env: process.env,
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`))
    })
  })
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function getRelativeOutputPath(entry, format) {
  const artifactPath = format === 'html' ? entry.html.path : entry.pdf.path
  return artifactPath.replace(new RegExp(`^${format}/`, 'u'), '')
}

function formatDeckIndexLabel(entry) {
  const relativeSourcePath = typeof entry?.relativeSourcePath === 'string' ? entry.relativeSourcePath : ''
  const title = typeof entry?.title === 'string' ? entry.title.trim() : ''
  const datePrefixMatch = path.basename(relativeSourcePath).match(/^(\d{4}-\d{2})-/u)

  if (!title) {
    return datePrefixMatch ? datePrefixMatch[1] : relativeSourcePath
  }

  return datePrefixMatch ? `${datePrefixMatch[1]} ${title}` : title
}

function compareDeckIndexEntries(left, right) {
  const leftDate = path.basename(left.relativeSourcePath).match(/^(\d{4}-\d{2})-/u)?.[1] ?? ''
  const rightDate = path.basename(right.relativeSourcePath).match(/^(\d{4}-\d{2})-/u)?.[1] ?? ''

  return rightDate.localeCompare(leftDate) || right.relativeSourcePath.localeCompare(left.relativeSourcePath)
}

function buildFormatIndexMarkup(siteBaseUrl, manifest) {
  const pageTitle = 'Published Deck Index'
  const entriesMarkup = [...manifest]
    .sort(compareDeckIndexEntries)
    .map((entry) => {
      const htmlPath = getRelativeOutputPath(entry, 'html')
      const pdfPath = getRelativeOutputPath(entry, 'pdf')
      const label = formatDeckIndexLabel(entry)
      const searchValue = `${label} ${entry.title} ${entry.relativeSourcePath}`.toLowerCase()
      const sortKey = entry.relativeSourcePath.toLowerCase()

      return [
        `      <li data-search="${escapeHtml(searchValue)}" data-sort-key="${escapeHtml(sortKey)}">`,
        `        <div class="deck-name">${escapeHtml(label)}</div>`,
        '        <div class="deck-links">',
        `          <a href="../html/${escapeHtml(htmlPath)}">HTML</a>`,
        `          <a href="../pdf/${escapeHtml(pdfPath)}">PDF</a>`,
        '        </div>',
        '</li>',
      ].join('\n')
    })
    .join('\n')

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <title>${escapeHtml(pageTitle)}</title>`,
    '  <style>',
    '    :root { color-scheme: light; }',
    '    body {',
    "      font-family: 'Avenir Next', 'Segoe UI', sans-serif;",
    '      margin: 0;',
    '      min-height: 100vh;',
    '      color: #10213a;',
    '      background:',
    '        radial-gradient(circle at top left, rgba(233, 107, 53, 0.08), transparent 28%),',
    '        radial-gradient(circle at right 10% bottom 15%, rgba(10, 125, 103, 0.08), transparent 24%),',
    '        linear-gradient(135deg, #fbfaf6 0%, #f8f5ee 100%);',
    '    }',
    '    main { max-width: 1080px; margin: 0 auto; padding: 56px 28px 72px; }',
    '    h1 { margin: 0 0 12px; font-size: clamp(2rem, 4vw, 3rem); }',
    '    p { margin: 0 0 24px; color: #52647d; font-size: 1.05rem; }',
    '    .controls { display: flex; flex-wrap: wrap; gap: 14px; align-items: end; margin-bottom: 24px; }',
    '    .search-row { flex: 1 1 360px; margin: 0; }',
    '    .search-row label { display: block; margin-bottom: 10px; color: #52647d; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.04em; text-transform: uppercase; }',
    '    .search-row input { width: min(100%, 560px); padding: 14px 16px; border: 1px solid #b8c7d8; border-radius: 14px; background: rgba(255, 255, 255, 0.92); color: #10213a; font-size: 1rem; box-sizing: border-box; }',
    '    .search-row input:focus { outline: 2px solid rgba(10, 125, 103, 0.24); outline-offset: 2px; border-color: #0a7d67; }',
    '    .sort-toggle { padding: 14px 16px; border: 1px solid #b8c7d8; border-radius: 14px; background: #ffffff; color: #10213a; font-size: 0.98rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 22px rgba(16, 33, 58, 0.08); }',
    '    .sort-toggle:hover { background: #f6fbf9; }',
    '    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }',
    '    li { background: rgba(255, 255, 255, 0.88); border: 1px solid #d5dfeb; border-radius: 18px; padding: 18px 20px; box-shadow: 0 14px 28px rgba(16, 33, 58, 0.08); display: flex; gap: 16px; align-items: center; justify-content: space-between; }',
    '    .deck-name { font-weight: 700; font-size: 1.02rem; color: #10213a; }',
    '    .deck-links { display: flex; flex-wrap: wrap; gap: 10px; }',
    '    .deck-links a { color: #10213a; font-weight: 700; text-decoration: none; border: 1px solid #b8c7d8; border-radius: 999px; padding: 8px 12px; background: #ffffff; }',
    '    .deck-links a:hover { text-decoration: underline; }',
    '    .results-meta { margin: 0 0 18px; color: #52647d; font-size: 0.96rem; }',
    '    .hidden { display: none !important; }',
    '    @media (max-width: 720px) {',
    '      .controls { align-items: stretch; }',
    '      .sort-toggle { width: 100%; }',
    '      li { align-items: flex-start; flex-direction: column; }',
    '      .deck-links { width: 100%; }',
    '    }',
    '  </style>',
    '</head>',
    '<body>',
    '  <main>',
    `    <h1>${escapeHtml(pageTitle)}</h1>`,
    '    <p>Browse the published Chattanooga Generative AI Working Group decks. Ordered by date descending by default.</p>',
    '    <div class="controls">',
    '      <div class="search-row">',
    '        <label for="deck-search">Search decks</label>',
    '        <input id="deck-search" type="search" placeholder="Type part of a title or date" autocomplete="off">',
    '      </div>',
    '      <button id="sort-toggle" class="sort-toggle" type="button" aria-pressed="false">Sort: Newest first</button>',
    '    </div>',
    '    <p class="results-meta"><span id="visible-count">0</span> decks shown</p>',
    '    <ul id="deck-list">',
    entriesMarkup,
    '    </ul>',
    '    <script>',
    '      const searchInput = document.getElementById("deck-search")',
    '      const sortToggle = document.getElementById("sort-toggle")',
    '      const deckList = document.getElementById("deck-list")',
    '      const resultItems = Array.from(document.querySelectorAll("li[data-search]"))',
    '      const visibleCount = document.getElementById("visible-count")',
    '      let currentSort = "desc"',
    '      const applySort = () => {',
    '        const sortedItems = [...resultItems].sort((left, right) => {',
    '          const comparison = (left.dataset.sortKey ?? "").localeCompare(right.dataset.sortKey ?? "")',
    '          return currentSort === "desc" ? -comparison : comparison',
    '        })',
    '        for (const item of sortedItems) {',
    '          deckList.appendChild(item)',
    '        }',
    '        sortToggle.textContent = currentSort === "desc" ? "Sort: Newest first" : "Sort: Oldest first"',
    '        sortToggle.setAttribute("aria-pressed", currentSort === "asc" ? "true" : "false")',
    '      }',
    '      const updateResults = () => {',
    '        const query = searchInput.value.trim().toLowerCase()',
    '        let visible = 0',
    '        for (const item of resultItems) {',
    '          const haystack = item.dataset.search ?? ""',
    '          const matches = query.length === 0 || haystack.includes(query)',
    '          item.classList.toggle("hidden", !matches)',
    '          if (matches) visible += 1',
    '        }',
    '        visibleCount.textContent = String(visible)',
    '      }',
    '      sortToggle.addEventListener("click", () => {',
    '        currentSort = currentSort === "desc" ? "asc" : "desc"',
    '        applySort()',
    '      })',
    '      searchInput.addEventListener("input", updateResults)',
    '      applySort()',
    '      updateResults()',
    '    </script>',
    '  </main>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}

async function writeFormatIndexPage(outputRoot, siteBaseUrl, manifest) {
  const indexPath = path.join(outputRoot, 'index.html')
  const markup = buildFormatIndexMarkup(siteBaseUrl, manifest)

  await writeFile(indexPath, markup, 'utf8')
}

function toDataUri(svgMarkup) {
  return `data:image/svg+xml;base64,${Buffer.from(svgMarkup).toString('base64')}`
}

function renderCoverLink(url, imageSource, title, subtitle) {
  const markup = [
    `<a class="cover-link" href="${escapeHtml(url)}" rel="noopener noreferrer">`,
    `  <img src="${imageSource}" alt="QR code for ${escapeHtml(title)} at ${escapeHtml(url)}">`,
    `  <span class="cover-link-title">${escapeHtml(title)}</span>`,
  ]

  if (typeof subtitle === 'string' && subtitle.trim().length > 0) {
    markup.push(`  <span class="cover-link-subtitle">${escapeHtml(subtitle)}</span>`)
  }

  markup.push('</a>')

  return markup.join('\n')
}

async function buildCoverLinksMarkup(entry) {
  const qrOptions = {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 180,
    color: {
      dark: '#10213a',
      light: '#ffffffff',
    },
  }

  const [htmlQr, pdfQr] = await Promise.all([
    QRCode.toString(entry.html.url, qrOptions),
    QRCode.toString(entry.pdf.url, qrOptions),
  ])

  return [
    '<div class="cover-links">',
    renderCoverLink(entry.html.url, toDataUri(htmlQr), 'Live HTML'),
    renderCoverLink(entry.pdf.url, toDataUri(pdfQr), 'Share PDF'),
    '</div>',
  ].join('\n')
}

function injectCoverLinks(source, coverLinksMarkup) {
  const placeholderPattern = /<!--\s*cover-links(?::auto)?\s*-->/u

  if (placeholderPattern.test(source)) {
    return source.replace(placeholderPattern, coverLinksMarkup)
  }

  const frontmatterMatch = source.match(/^---\n[\s\S]*?\n---\n?/u)
  const bodyOffset = frontmatterMatch ? frontmatterMatch[0].length : 0
  const bodySource = source.slice(bodyOffset)
  const firstSlideBreak = bodySource.match(/\n---\n/u)

  if (!firstSlideBreak || firstSlideBreak.index === undefined) {
    return `${source.trimEnd()}\n\n${coverLinksMarkup}\n`
  }

  const insertionPoint = bodyOffset + firstSlideBreak.index

  return `${source.slice(0, insertionPoint).trimEnd()}\n\n${coverLinksMarkup}\n${source.slice(insertionPoint)}`
}

async function copyStaticPresentationAssets(sourceDir, targetDir) {
  const entries = await readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue
    }

    const sourcePath = path.join(sourceDir, entry.name)
    const targetPath = path.join(targetDir, entry.name)

    if (entry.isDirectory()) {
      await copyStaticPresentationAssets(sourcePath, targetPath)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    if (entry.name.endsWith('.md') || entry.name.endsWith('.mmd')) {
      continue
    }

    await mkdir(path.dirname(targetPath), { recursive: true })
    await copyFile(sourcePath, targetPath)
  }
}

const outputRoot = path.resolve(rootDir, 'dist', format)

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })

const siteBaseUrl = await resolveSiteBaseUrl(rootDir)
const presentationManifest = filterPresentationManifest(
  await buildPresentationManifest(rootDir, siteBaseUrl),
  options.deck
)

await writePresentationManifest(rootDir, presentationManifest)

if (format === 'html') {
  await copyStaticPresentationAssets(presentationsDir, outputRoot)
}

if (presentationManifest.length === 0) {
  console.log('No Marp deck files found to build.')
  process.exit(0)
}

console.log(`Using ${siteBaseUrl} for generated QR destinations.`)

if (options.deck) {
  console.log(
    `Building ${presentationManifest.length} presentation for selector "${options.deck}": ${presentationManifest[0].relativeSourcePath}`
  )
}

for (const entry of presentationManifest) {
  const outputPath = path.resolve(rootDir, 'dist', format === 'html' ? entry.html.path : entry.pdf.path)
  const tempInputPath = path.join(
    path.dirname(entry.sourcePath),
    `.${path.basename(entry.sourcePath, '.md')}.build.${format}.md`
  )

  await mkdir(path.dirname(outputPath), { recursive: true })

  const coverLinksMarkup = await buildCoverLinksMarkup(entry)
  const preparedSource = injectCoverLinks(entry.rawSource, coverLinksMarkup)

  await writeFile(tempInputPath, preparedSource, 'utf8')

  const args = ['--no-install', 'marp', tempInputPath, '-o', outputPath]

  if (format === 'pdf') {
    args.splice(2, 0, '--pdf')
  }

  try {
    await runCommand(cliExecutable, args)
    console.log(`Built ${path.relative(rootDir, outputPath)}`)
  } finally {
    await rm(tempInputPath, { force: true })
  }
}

await writeFormatIndexPage(outputRoot, siteBaseUrl, presentationManifest)
