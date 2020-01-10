"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const run = async () => {
    try {
        // Limit only to when issues are opened (not edited, closed, etc.)
        if (github.context.payload.action !== 'opened')
            return;
        // Check the payload
        const issue = github.context.payload.issue;
        if (!issue)
            return;
        if (!issue.body)
            return;
        let appName = "", armTemplate = "", environmentType = "Development";
        const lines = issue.body.match(/[^\r\n]+/g);
        if (!lines)
            return;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("Application Name:"))
                appName = lines[i].substring(17, lines[i].length).trim();
            if (lines[i].startsWith("- [x] General"))
                armTemplate = "vmss-windows-nat";
            if (lines[i].startsWith("- [x] Web"))
                armTemplate = "web-app-sql-database";
            if (lines[i].startsWith("- [x] Serverless"))
                armTemplate = "function-app";
        }
        core.setOutput('appName', appName);
        core.setOutput('armTemplate', armTemplate);
        core.setOutput('environmentType', environmentType); // TODO
    }
    catch (error) {
        console.error(error.message);
        core.setFailed(`Thanks-action failure: ${error}`);
    }
};
run();
exports.default = run;
