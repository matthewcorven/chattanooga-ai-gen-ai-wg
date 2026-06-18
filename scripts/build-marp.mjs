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

function formatIndexTitle(format) {
  return format === 'html' ? 'HTML Deck Index' : 'PDF Deck Index'
}

function getRelativeOutputPath(entry, format) {
  const artifactPath = format === 'html' ? entry.html.path : entry.pdf.path
  return artifactPath.replace(new RegExp(`^${format}/`, 'u'), '')
}

function buildFormatIndexMarkup(format, siteBaseUrl, manifest) {
  const pageTitle = formatIndexTitle(format)
  const siblingFormat = format === 'html' ? 'pdf' : 'html'
  const siblingTitle = siblingFormat === 'html' ? 'HTML' : 'PDF'
  const normalizedSiteBaseUrl = siteBaseUrl.replace(/\/+$/u, '')
  const entriesMarkup = manifest
    .map((entry) => {
      const primaryPath = getRelativeOutputPath(entry, format)
      const siblingPath = getRelativeOutputPath(entry, siblingFormat)
      const primaryLabel = format === 'html' ? 'Open deck' : 'Open PDF'

      return [
        '<li>',
        `  <a href="${escapeHtml(primaryPath)}">${escapeHtml(entry.title)}</a>`,
        `  <span>${escapeHtml(primaryLabel)} • <a href="../${escapeHtml(siblingFormat)}/${escapeHtml(siblingPath)}">${escapeHtml(siblingTitle)}</a></span>`,
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
    '    main { max-width: 980px; margin: 0 auto; padding: 56px 28px 72px; }',
    '    h1 { margin: 0 0 12px; font-size: clamp(2rem, 4vw, 3rem); }',
    '    p { margin: 0 0 24px; color: #52647d; font-size: 1.05rem; }',
    '    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }',
    '    li { background: rgba(255, 255, 255, 0.88); border: 1px solid #d5dfeb; border-radius: 18px; padding: 18px 20px; box-shadow: 0 14px 28px rgba(16, 33, 58, 0.08); }',
    '    li a { color: #10213a; font-weight: 700; text-decoration: none; }',
    '    li a:hover { text-decoration: underline; }',
    '    li span { display: block; margin-top: 6px; color: #52647d; font-size: 0.96rem; }',
    '    .meta { margin-bottom: 28px; display: flex; flex-wrap: wrap; gap: 14px; }',
    '    .meta a { color: #0a7d67; font-weight: 700; text-decoration: none; }',
    '    .meta a:hover { text-decoration: underline; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <main>',
    `    <h1>${escapeHtml(pageTitle)}</h1>`,
    '    <p>Browse the published Chattanooga Generative AI Working Group decks.</p>',
    '    <div class="meta">',
    `      <a href="${escapeHtml(normalizedSiteBaseUrl)}">GitHub Pages home</a>`,
    `      <a href="../${escapeHtml(siblingFormat)}/">${escapeHtml(siblingTitle)} index</a>`,
    '    </div>',
    '    <ul>',
    entriesMarkup,
    '    </ul>',
    '  </main>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}

async function writeFormatIndexPage(outputRoot, format, siteBaseUrl, manifest) {
  const indexPath = path.join(outputRoot, 'index.html')
  const markup = buildFormatIndexMarkup(format, siteBaseUrl, manifest)

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

await writeFormatIndexPage(outputRoot, format, siteBaseUrl, presentationManifest)
