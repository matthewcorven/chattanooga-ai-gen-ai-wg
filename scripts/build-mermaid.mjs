import { readdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

const rootDir = process.cwd()
const presentationsDir = path.resolve(rootDir, 'presentations')
const mermaidConfigPath = path.resolve(rootDir, 'mermaid.config.json')
const cliExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx'

async function collectMermaidFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
      continue
    }

    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectMermaidFiles(entryPath)))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.mmd')) {
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

function resolveTargets(allFiles) {
  const requested = process.argv.slice(2)

  if (requested.length === 0) {
    return allFiles
  }

  const requestedSet = new Set(
    requested.map((inputPath) => path.resolve(rootDir, inputPath.replace(/\.svg$/u, '.mmd')))
  )

  return allFiles.filter((filePath) => requestedSet.has(filePath))
}

const allFiles = await collectMermaidFiles(presentationsDir)
const targets = resolveTargets(allFiles)

if (targets.length === 0) {
  console.log('No Mermaid source files found to render.')
  process.exit(0)
}

for (const inputPath of targets) {
  const outputPath = inputPath.replace(/\.mmd$/u, '.svg')

  await runCommand(cliExecutable, [
    '--no-install',
    'mmdc',
    '-i',
    inputPath,
    '-o',
    outputPath,
    '-e',
    'svg',
    '-b',
    'transparent',
    '-c',
    mermaidConfigPath,
  ])

  console.log(`Rendered ${path.relative(rootDir, outputPath)}`)
}
