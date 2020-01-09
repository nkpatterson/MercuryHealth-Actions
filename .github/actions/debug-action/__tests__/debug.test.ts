import * as core from '@actions/core'
import * as github from '@actions/github'
import run from '../debug'
import fs from 'fs'
import yaml from 'js-yaml'
import { WebhookPayload } from '@actions/github/lib/interfaces'

beforeEach(() => {
  jest.resetModules()
  const doc = yaml.safeLoad(fs.readFileSync(__dirname + '/../action.yml', 'utf8'))
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`
    process.env[envVar] = doc.inputs[name]['default']
  })

  github.context.payload = {
    pusher: {
      name: 'mona'
    }
  } as WebhookPayload
})

afterEach(() => {
  delete process.env['INPUT_AMAZING-CREATURE']
})

describe('debug action debug messages', () => {
  it('outputs a debug message', async () => {
    const debugMock = jest.spyOn(core, 'debug')
    await run()
    expect(debugMock).toHaveBeenCalledWith('Hello mona! You are an amazing person!') 
  })
})

describe('debug action output', () => {
  it ('sets the action output', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    await run()
    expect(setOutputMock).toHaveBeenCalledWith(
      'amazing-message',
      'Hello mona! You are an amazing person!'
    )
  })
})