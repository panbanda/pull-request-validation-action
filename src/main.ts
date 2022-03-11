import * as core from '@actions/core'

export interface ValidationConfig {
  patterns?: string[]
  errorMessage?: string
}

export interface InputConfig {
  title?: ValidationConfig[]
}

export async function run(): Promise<void> {
  try {
    const config: InputConfig = JSON.parse(core.getInput('config'))
    core.info(`Starting validation of pull request`)

    console.log(config)
    // core.info(title)
    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
