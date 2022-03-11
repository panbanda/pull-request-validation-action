import {setOutput, setFailed, getInput, warning, notice} from '@actions/core'
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

  const errorMessage = errors.map(({message}) => `- ${message}`).join('\n')

  if (!success) {
    warning(`${errors.length} of the values failed the pattern checks.`)
  }

  setOutput('status', success ? 'pass' : 'fail')
  setOutput('errors', errors)
  setOutput('errorMessage', errorMessage)
}

run()
