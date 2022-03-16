import * as process from 'process'
import cp, {ExecFileSyncOptions} from 'child_process'
import * as path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function runAction(env: any) {
  const node = process.execPath
  const entry = path.join(__dirname, '..', 'lib', 'main.js')
  const options: ExecFileSyncOptions = {env}
  cp.execFileSync(node, [entry], options)
}

test('successfully runs the github action', () => {
  process.env['INPUT_VALIDATIONS'] = JSON.stringify([
    {
      value: 'feature: cool new feature',
      patterns: ['^(feature|hotfix):'],
      errorMessage: 'Invalid pull request name'
    }
  ])

  expect(() => runAction(process.env)).not.toThrowError()
})

test('does not fail when invalid and failures are not enabled', () => {
  process.env['INPUT_VALIDATIONS'] = JSON.stringify([
    {
      value: 'not valid',
      patterns: ['^(feature|hotfix):'],
      errorMessage: 'Invalid pull request name'
    }
  ])

  expect(() => runAction(process.env)).not.toThrowError()
})

test('fails when invalid and failures are enabled', () => {
  process.env['INPUT_FAIL_ON_ERROR'] = 'true'
  process.env['INPUT_VALIDATIONS'] = JSON.stringify([
    {
      value: 'not valid',
      patterns: ['^(feature|hotfix):'],
      errorMessage: 'Invalid pull request name'
    }
  ])

  expect(() => runAction(process.env)).toThrowError()
})
