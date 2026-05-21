import { execFile } from 'node:child_process'
import process from 'node:process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const defaultWorkflow = 'Publish Presentations'
const defaultIntervalSeconds = 10
const defaultTimeoutSeconds = 1200
const defaultRunListLimit = 10

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

function parseCliOptions(rawArgs) {
  const options = {
    commit: 'HEAD',
    workflow: defaultWorkflow,
    intervalSeconds: defaultIntervalSeconds,
    timeoutSeconds: defaultTimeoutSeconds,
    limit: defaultRunListLimit,
  }

  for (let index = 0; index < rawArgs.length; index += 1) {
    const argument = rawArgs[index]
    const value = rawArgs[index + 1]

    if (argument === '--commit') {
      if (!value || value.startsWith('--')) {
        console.error('--commit requires a git revision, such as HEAD or a commit SHA.')
        process.exit(1)
      }

      options.commit = value
      index += 1
      continue
    }

    if (argument === '--workflow') {
      if (!value || value.startsWith('--')) {
        console.error('--workflow requires a workflow name.')
        process.exit(1)
      }

      options.workflow = value
      index += 1
      continue
    }

    if (argument === '--interval') {
      options.intervalSeconds = parsePositiveInteger(argument, value)
      index += 1
      continue
    }

    if (argument === '--timeout') {
      options.timeoutSeconds = parsePositiveInteger(argument, value)
      index += 1
      continue
    }

    if (argument === '--limit') {
      options.limit = parsePositiveInteger(argument, value)
      index += 1
      continue
    }

    console.error(`Unknown option: ${argument}`)
    process.exit(1)
  }

  return options
}

function parsePositiveInteger(flagName, rawValue) {
  if (!rawValue || rawValue.startsWith('--')) {
    console.error(`${flagName} requires a positive integer value.`)
    process.exit(1)
  }

  const parsedValue = Number.parseInt(rawValue, 10)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    console.error(`${flagName} requires a positive integer value, but got "${rawValue}".`)
    process.exit(1)
  }

  return parsedValue
}

function buildCommandEnvironment() {
  return {
    ...process.env,
    GH_FORCE_TTY: '0',
    GH_PAGER: 'cat',
    PAGER: 'cat',
  }
}

async function runCommand(command, args, label) {
  try {
    const { stdout } = await execFileAsync(command, args, {
      cwd: process.cwd(),
      env: buildCommandEnvironment(),
      maxBuffer: 10 * 1024 * 1024,
    })

    return stdout.trim()
  } catch (error) {
    const details = [error.stderr?.trim(), error.stdout?.trim(), error.message]
      .filter(Boolean)
      .join('\n')

    throw new Error(`${label} failed. ${details}`)
  }
}


  function parseJsonOutput(rawOutput, label, fallbackValue) {
    const cleanedOutput = rawOutput.replace(/^\uFEFF/u, '').replace(/\u001b\[[0-9;]*m/gu, '').trim()

    if (cleanedOutput.length === 0) {
      return fallbackValue
    }

    const objectIndex = cleanedOutput.indexOf('{')
    const arrayIndex = cleanedOutput.indexOf('[')
    const candidateIndexes = [objectIndex, arrayIndex].filter((value) => value >= 0)

    if (candidateIndexes.length === 0) {
      throw new Error(`${label} returned no JSON payload.`)
    }

    const jsonStartIndex = Math.min(...candidateIndexes)
    const jsonPayload = cleanedOutput.slice(jsonStartIndex)

    try {
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error(`${label} returned invalid JSON. ${error.message}`)
    }
  }
async function resolveCommitSha(revision) {
  return runCommand('git', ['rev-parse', '--verify', revision], `Resolve commit ${revision}`)
}

async function listWorkflowRuns(workflow, limit) {
  const output = await runCommand(
    'gh',
    [
      'run',
      'list',
      '--workflow',
      workflow,
      '--limit',
      String(limit),
      '--json',
      'databaseId,headSha,status,conclusion,displayTitle,url',
    ],
    `List runs for workflow ${workflow}`
  )

  return parseJsonOutput(output, `List runs for workflow ${workflow}`, [])
}

async function viewWorkflowRun(runId) {
  const output = await runCommand(
    'gh',
    ['run', 'view', String(runId), '--json', 'status,conclusion,displayTitle,url,jobs'],
    `View workflow run ${runId}`
  )

  return parseJsonOutput(output, `View workflow run ${runId}`)
}

function findRunByCommit(runs, commitSha) {
  return runs.find((run) => run.headSha === commitSha) ?? null
}

function formatDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) {
    return null
  }

  const startTime = Date.parse(startedAt)
  const endTime = Date.parse(completedAt)

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime < startTime) {
    return null
  }

  const totalSeconds = Math.round((endTime - startTime) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) {
    return `${seconds}s`
  }

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

function formatJobSummary(job) {
  const outcome = job.conclusion || job.status
  const duration = formatDuration(job.startedAt, job.completedAt)

  if (duration) {
    return `- ${job.name}: ${outcome} (${duration})`
  }

  return `- ${job.name}: ${outcome}`
}

function collectFailingSteps(jobs) {
  const failingLines = []

  for (const job of jobs) {
    const failedSteps = (job.steps ?? []).filter(
      (step) => step.conclusion && !['success', 'skipped', 'neutral'].includes(step.conclusion)
    )

    if (failedSteps.length === 0 && ['failure', 'cancelled', 'timed_out', 'startup_failure'].includes(job.conclusion)) {
      failingLines.push(`- ${job.name}: ${job.conclusion}`)
      continue
    }

    for (const step of failedSteps) {
      failingLines.push(`- ${job.name} > ${step.name}: ${step.conclusion}`)
    }
  }

  return failingLines
}

function logRunSummary(run, commitSha) {
  const completedJobs = (run.jobs ?? []).map(formatJobSummary)

  console.log(`Workflow: ${run.displayTitle}`)
  console.log(`Run URL: ${run.url}`)
  console.log(`Commit: ${commitSha}`)
  console.log(`Status: ${run.status}`)
  console.log(`Conclusion: ${run.conclusion}`)

  if (completedJobs.length > 0) {
    console.log('Jobs:')
    for (const line of completedJobs) {
      console.log(line)
    }
  }
}

async function waitForPublishWorkflow(options) {
  const commitSha = await resolveCommitSha(options.commit)
  const deadline = Date.now() + options.timeoutSeconds * 1000
  let matchedRun = null

  console.log(`Waiting for workflow "${options.workflow}" for commit ${commitSha}...`)

  while (Date.now() <= deadline) {
    const runs = await listWorkflowRuns(options.workflow, options.limit)
    matchedRun = findRunByCommit(runs, commitSha)

    if (matchedRun) {
      break
    }

    await wait(options.intervalSeconds * 1000)
  }

  if (!matchedRun) {
    throw new Error(
      `Timed out waiting for a workflow run for commit ${commitSha}. Increase --timeout if GitHub Actions is slow to enqueue the run.`
    )
  }

  console.log(`Found run ${matchedRun.databaseId}: ${matchedRun.url}`)

  while (Date.now() <= deadline) {
    const run = await viewWorkflowRun(matchedRun.databaseId)

    if (run.status === 'completed') {
      logRunSummary(run, commitSha)

      if (run.conclusion !== 'success') {
        const failingSteps = collectFailingSteps(run.jobs ?? [])

        if (failingSteps.length > 0) {
          console.error('Failures:')
          for (const line of failingSteps) {
            console.error(line)
          }
        }

        throw new Error(`Workflow run ${matchedRun.databaseId} finished with conclusion ${run.conclusion}.`)
      }

      return
    }

    await wait(options.intervalSeconds * 1000)
  }

  throw new Error(
    `Timed out waiting for workflow run ${matchedRun.databaseId} to finish. Increase --timeout if the pipeline usually takes longer.`
  )
}

const options = parseCliOptions(process.argv.slice(2))

try {
  await waitForPublishWorkflow(options)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}