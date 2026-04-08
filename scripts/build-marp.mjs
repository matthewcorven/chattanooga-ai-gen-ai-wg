import { mkdir, readdir, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

const rootDir = process.cwd()
const presentationsDir = path.resolve(rootDir, 'presentations')
const format = process.argv[2]
const cliExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx'

if (format !== 'html' && format !== 'pdf') {
  console.error('Usage: node ./scripts/build-marp.mjs <html|pdf>')
  process.exit(1)
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

const outputRoot = path.resolve(rootDir, 'dist', format)

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })

const markdownFiles = await collectMarkdownFiles(presentationsDir)

if (markdownFiles.length === 0) {
  console.log('No Marp deck files found to build.')
  process.exit(0)
}

for (const inputPath of markdownFiles) {
  const relativePath = path.relative(presentationsDir, inputPath)
  const outputPath = path.join(
    outputRoot,
    relativePath.replace(/\.md$/u, format === 'html' ? '.html' : '.pdf')
  )

  await mkdir(path.dirname(outputPath), { recursive: true })

  const args = ['--no-install', 'marp', inputPath, '-o', outputPath]

  if (format === 'pdf') {
    args.splice(2, 0, '--pdf')
  }

  await runCommand(cliExecutable, args)
  console.log(`Built ${path.relative(rootDir, outputPath)}`)
}