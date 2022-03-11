import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {InputConfig} from './main'

// test('throws invalid number', async () => {
//   const input = parseInt('foo', 10)
//   await expect(wait(input)).rejects.toThrow('milliseconds not a number')
// })

// test('wait 500 ms', async () => {
//   const start = new Date()
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })

test('returns a missing title', () => {
  const config: InputConfig = {
    title: [
      {
        patterns: ['(PDG|PNM)-d+'],
        errorMessage: 'A Jira ticket is missing (ex: PDG-1000)'
      }
    ]
  }

  console.log(config)
  process.env['INPUT_CONFIG'] = JSON.stringify(config)
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {env: process.env}
  console.log(cp.execFileSync(np, [ip], options).toString())
})
