import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import run from '../env-req-parser'
import { WebhookPayload } from '@actions/github/lib/interfaces'

beforeEach(() => {
  jest.resetModules()

  let body = fs.readFileSync('./.github/actions/env-req-parser/__tests__/sampleIssue01.txt')

  github.context.payload = {
    action: 'labeled',
    issue: {
      number: 1,
      body: body.toString(),
      labels: [
        { name: "approved" }
      ]
    },
  } as WebhookPayload
})

afterEach(() => {
})

describe('parse environment request body', () => {
  it ('outputs entered values', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    await run()
    expect(setOutputMock).toHaveBeenCalledWith(
      'appName',
      'SuperCoolFunApp'
    )
    expect(setOutputMock).toHaveBeenCalledWith(
      'armTemplate',
      'web-app-sql-database'
    )
  })

  it ('sets approved to true', async() => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    await run()
    expect(setOutputMock).toHaveBeenCalledWith('approved', 'true')
  })

  it ('sets approved to false if no label', async() => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    github.context.payload = {
      action: 'labeled',
      issue: {
        number: 1,
        body: "Application Name: SuperCoolFunApp\r\n- [x] Web App Hosting (Azure App Service+SQL Database combination)\r\n-[x] Development",
        labels: [
          { name: "bleh" }
        ]
      },
    } as WebhookPayload
    await run()
    expect(setOutputMock).toHaveBeenCalledWith('approved', 'false')
  })

  it ('sets applyPolicy to true with policy name', async() => {
    const setOutputMock = jest.spyOn(core, 'setOutput')
    await run()
    expect(setOutputMock).toHaveBeenCalledWith('applyPolicy', 'true')
    expect(setOutputMock).toHaveBeenCalledWith('policyName', 'Audit PCI')
  })
})