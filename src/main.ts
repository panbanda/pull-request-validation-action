import {
  setOutput,
  setFailed,
  getInput,
  warning,
  notice,
  error
} from '@actions/core'
import {validate, ValidationConfig, ValidationError} from './validate'

export async function run(): Promise<void> {
  let config: ValidationConfig[] = []
  let errors: ValidationError[] = []

  try {
    config = JSON.parse(getInput('validations'))
  } catch (err) {
    if (err instanceof Error) setFailed(err.message)
    return
  }

  notice(`Starting validation of ${config.length} entries...`)

  errors = validate(config)
  const success = errors.length === 0

  if (!success) {
    error(`${errors.length} of the values failed the pattern checks.`)
  }

  const errorMessage = errors.map(({message}) => `- ${message}`).join('\n')

  setOutput('success', success)
  setOutput('errors', errors)
  setOutput('errorMessage', errorMessage)
}

run()
