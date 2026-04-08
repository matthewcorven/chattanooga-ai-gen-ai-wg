import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import QRCode from 'qrcode'
import {
  buildPresentationManifest,
  resolveSiteBaseUrl,
  writePresentationManifest,
} from './presentation-utils.mjs'

const rootDir = process.cwd()
const presentationsDir = path.resolve(rootDir, 'presentations')
const format = process.argv[2]
const cliExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx'

if (format !== 'html' && format !== 'pdf') {
  console.error('Usage: node ./scripts/build-marp.mjs <html|pdf>')
  process.exit(1)
}

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

function toDataUri(svgMarkup) {
  return `data:image/svg+xml;base64,${Buffer.from(svgMarkup).toString('base64')}`
}

function renderCoverLink(url, imageSource, title, subtitle) {
  return [
    `<a class="cover-link" href="${escapeHtml(url)}" rel="noopener noreferrer">`,
    `  <img src="${imageSource}" alt="QR code for ${escapeHtml(title)} at ${escapeHtml(url)}">`,
    `  <span class="cover-link-title">${escapeHtml(title)}</span>`,
    `  <span class="cover-link-subtitle">${escapeHtml(subtitle)}</span>`,
    '</a>',
  ].join('\n')
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
    renderCoverLink(entry.html.url, toDataUri(htmlQr), 'Live HTML', 'Open the browser deck'),
    renderCoverLink(entry.pdf.url, toDataUri(pdfQr), 'Share PDF', 'Download the PDF export'),
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
const presentationManifest = await buildPresentationManifest(rootDir, siteBaseUrl)

await writePresentationManifest(rootDir, presentationManifest)

if (format === 'html') {
  await copyStaticPresentationAssets(presentationsDir, outputRoot)
}

if (presentationManifest.length === 0) {
  console.log('No Marp deck files found to build.')
  process.exit(0)
}

console.log(`Using ${siteBaseUrl} for generated QR destinations.`)

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
