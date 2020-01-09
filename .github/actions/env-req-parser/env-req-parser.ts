import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async (): Promise<void> => {
    try {
        // Limit only to when issues are opened (not edited, closed, etc.)
        if (github.context.payload.action !== 'opened') return
    
        // Check the payload
        const issue = github.context.payload.issue
        if (!issue) return
        if (!issue.body) return

        let appName = "", armTemplate = "", environmentType = "Development"

        const lines = issue.body.match(/[^\r\n]+/g);
        if (!lines) return

        for (var i=0;i<lines.length;i++) {
            if (lines[i].startsWith("Application Name:"))
                appName = lines[i].substring(17,lines[i].length).trim()
            if (lines[i].startsWith("- [x] General"))
                armTemplate = "vmss-windows-nat"
            if (lines[i].startsWith("- [x] Web"))
                armTemplate = "web-app-sql-database"
            if (lines[i].startsWith("- [x] Serverless"))
                armTemplate = "function-app"
        }

        core.setOutput('appName', appName)
        core.setOutput('armTemplate', armTemplate)
        core.setOutput('environmentType', environmentType) // TODO
    } catch (error) {
        console.error(error.message)
        core.setFailed(`Thanks-action failure: ${error}`)
    }
}

run()

export default run