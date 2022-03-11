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
      const matchError = `"${value}" does not match any of the patterns.`;
      core.info(matchError)

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
    core.info(`Starting validation of ${config.length} entries...`)

    const errors = validate(config)
    if (errors.length > 0) {
      core.setFailed(
        `${errors.length} of the values failed the pattern checks.`
      )
    }

    core.setOutput('errors', errors)
  } catch (err) {
    if (err instanceof Error) core.setFailed(err.message)
  }
}
