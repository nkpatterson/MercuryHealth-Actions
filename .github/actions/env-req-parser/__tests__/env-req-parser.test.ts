import * as core from '@actions/core'
import * as github from '@actions/github'
import run from '../env-req-parser'
import { WebhookPayload } from '@actions/github/lib/interfaces'

beforeEach(() => {
  jest.resetModules()

  github.context.payload = {
    action: 'opened',
    issue: {
      number: 1,
      body: "Application Name: SuperCoolFunApp\r\n- [x] Web App Hosting (Azure App Service+SQL Database combination)"
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
})