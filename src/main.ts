import {setOutput, setFailed, getInput, info} from '@actions/core'
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

  info(`Starting validation of ${config.length} entries...`)

  errors = validate(config)

  const success = errors.length === 0
  const errorMessage = errors.map(({message}) => `- ${message}`).join('\n')

  info(`status: ${success ? 'pass' : 'fail'}`)
  info(`errors: ${JSON.stringify(errors)}`)

  setOutput('status', success ? 'pass' : 'fail')
  setOutput('errors', errors)
  setOutput('errorMessage', errorMessage)

  if (!success) {
    setFailed(`${errors.length} of the values failed the pattern checks.`)
  }
}

run()
