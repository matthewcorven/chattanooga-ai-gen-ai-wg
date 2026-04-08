import { execFile } from 'node:child_process'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import matter from 'gray-matter'

const execFileAsync = promisify(execFile)
const placeholderBaseUrl = 'https://example.invalid'

function normalizePathForUrl(value) {
  return value.split(path.sep).join('/')
}

function encodeUrlPath(value) {
  return normalizePathForUrl(value)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/u, '')
}

function getDeckTitle(frontmatter, sourcePath) {
  if (typeof frontmatter.title === 'string' && frontmatter.title.trim().length > 0) {
    return frontmatter.title.trim()
  }

  return path.parse(sourcePath).name
}

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
      continue
    }

    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(entryPath)))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath)
    }
  }

  return files
}

async function getOriginRemoteUrl(rootDir) {
  try {
    const { stdout } = await execFileAsync('git', ['-C', rootDir, 'remote', 'get-url', 'origin'])
    return stdout.trim() || null
  } catch {
    return null
  }
}

function parseGithubRemote(remoteUrl) {
  const trimmed = remoteUrl.trim()

  const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/u)

  if (sshMatch) {
    return {
      owner: sshMatch[1],
      repo: sshMatch[2],
    }
  }

  const sshUrlMatch = trimmed.match(/^ssh:\/\/git@github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/u)

  if (sshUrlMatch) {
    return {
      owner: sshUrlMatch[1],
      repo: sshUrlMatch[2],
    }
  }

  const httpsMatch = trimmed.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/u)

  if (httpsMatch) {
    return {
      owner: httpsMatch[1],
      repo: httpsMatch[2],
    }
  }

  return null
}

export function deriveSiteBaseUrlFromRemote(remoteUrl) {
  const parsed = parseGithubRemote(remoteUrl)

  if (!parsed) {
    return null
  }

  const owner = parsed.owner.trim()
  const repo = parsed.repo.trim()

  if (repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
    return `https://${owner}.github.io`
  }

  return `https://${owner}.github.io/${repo}`
}

export async function resolveSiteBaseUrl(
  rootDir,
  explicitSiteBaseUrl = process.env.PRESENTATION_SITE_URL
) {
  if (typeof explicitSiteBaseUrl === 'string' && explicitSiteBaseUrl.trim().length > 0) {
    return trimTrailingSlash(explicitSiteBaseUrl.trim())
  }

  const remoteUrl = await getOriginRemoteUrl(rootDir)
  const derivedSiteBaseUrl = remoteUrl ? deriveSiteBaseUrlFromRemote(remoteUrl) : null

  if (derivedSiteBaseUrl) {
    return trimTrailingSlash(derivedSiteBaseUrl)
  }

  const fallbackSiteBaseUrl = `${placeholderBaseUrl}/${encodeURIComponent(path.basename(rootDir))}`

  console.warn(
    `Unable to infer a GitHub Pages URL from the current Git remote. Using ${fallbackSiteBaseUrl}. Set PRESENTATION_SITE_URL to override it.`
  )

  return fallbackSiteBaseUrl
}

export function getPublishedArtifactPath(relativeSourcePath, format) {
  const extension = format === 'html' ? '.html' : '.pdf'
  const relativeOutputPath = normalizePathForUrl(relativeSourcePath).replace(/\.md$/u, extension)

  return path.posix.join(format, relativeOutputPath)
}

export async function buildPresentationManifest(
  rootDir,
  explicitSiteBaseUrl = process.env.PRESENTATION_SITE_URL
) {
  const presentationsDir = path.resolve(rootDir, 'presentations')
  const siteBaseUrl = await resolveSiteBaseUrl(rootDir, explicitSiteBaseUrl)
  const markdownFiles = await collectMarkdownFiles(presentationsDir)
  const manifest = []

  for (const sourcePath of markdownFiles) {
    const rawSource = await readFile(sourcePath, 'utf8')
    const parsedSource = matter(rawSource)

    if (parsedSource.data.marp !== true) {
      continue
    }

    const relativeSourcePath = path.relative(presentationsDir, sourcePath)
    const htmlPath = getPublishedArtifactPath(relativeSourcePath, 'html')
    const pdfPath = getPublishedArtifactPath(relativeSourcePath, 'pdf')

    manifest.push({
      sourcePath,
      relativeSourcePath,
      rawSource,
      title: getDeckTitle(parsedSource.data, sourcePath),
      html: {
        path: htmlPath,
        url: `${siteBaseUrl}/${encodeUrlPath(htmlPath)}`,
      },
      pdf: {
        path: pdfPath,
        url: `${siteBaseUrl}/${encodeUrlPath(pdfPath)}`,
      },
    })
  }

  return manifest.sort((left, right) => left.relativeSourcePath.localeCompare(right.relativeSourcePath))
}

export async function writePresentationManifest(rootDir, manifest) {
  const manifestPath = path.resolve(rootDir, 'dist', 'presentation-manifest.json')

  await mkdir(path.dirname(manifestPath), { recursive: true })

  const serializableManifest = manifest.map((entry) => ({
    source: normalizePathForUrl(path.relative(rootDir, entry.sourcePath)),
    relativeSourcePath: normalizePathForUrl(entry.relativeSourcePath),
    title: entry.title,
    htmlPath: entry.html.path,
    htmlUrl: entry.html.url,
    pdfPath: entry.pdf.path,
    pdfUrl: entry.pdf.url,
  }))

  await writeFile(manifestPath, `${JSON.stringify(serializableManifest, null, 2)}\n`, 'utf8')

  return manifestPath
}
