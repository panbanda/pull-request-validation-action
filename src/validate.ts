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
