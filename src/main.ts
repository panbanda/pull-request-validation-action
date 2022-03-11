import * as core from '@actions/core'

export interface ValidationConfig {
  value: string
  patterns: string[]
  errorMessage?: string
}

export interface ValidationError {
  value: string
  message?: string
}

export const validate = (config: ValidationConfig[]): ValidationError[] => {
  const errors: ValidationError[] = []
  for (const entry of config) {
    const {value, patterns, errorMessage} = entry

    const passing = patterns.some(pattern => new RegExp(pattern).test(value))

    if (!passing) {
      const matchError = `"${value}" does not match any of the patterns.`
      console.log(matchError)

      errors.push({
        value,
        message: errorMessage || matchError
      })
    }
  }

  return errors
}

export async function run(): Promise<void> {
  try {
    const config: ValidationConfig[] = JSON.parse(core.getInput('validations'))
    console.log(`Starting validation of ${config.length} entries...`)

    const errors = validate(config)
    if (errors.length > 0) {
      core.setFailed(
        `${errors.length} of the values failed the pattern checks.`
      )
    }

    const success = errors.length === 0
    const errorMessage = errors.map(({message}) => `- ${message}`).join('\n')

    const output = {success, errors, errorMessage}
    console.log(output)

    core.setOutput('success', success)
    core.setOutput('errors', errors)
    core.setOutput('errorMessage', errorMessage)
  } catch (err) {
    if (err instanceof Error) core.setFailed(err.message)
  }
}
