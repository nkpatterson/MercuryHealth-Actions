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
        // Limit only to when issues are labeled (not edited, closed, etc.)
        if (github.context.payload.action !== 'labeled')
            return;
        // Check the payload
        const issue = github.context.payload.issue;
        if (!issue)
            return;
        if (!issue.body)
            return;
        if (!issue.labels)
            return;
        let approved = false;
        for (var i = 0; i < issue.labels.length; i++) {
            if (issue.labels[i].name == "approved") {
                approved = true;
                break;
            }
        }
        if (!approved) {
            console.log("Issue is not approved.");
            core.setOutput('approved', 'false');
            return;
        }
        let appName = "", armTemplate = "", applyPolicy = false, policyToApply = "";
        console.log(issue.body);
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
            if (lines[i].startsWith("- [x] PCI")) {
                applyPolicy = true;
                policyToApply = "Audit PCI";
            }
            if (lines[i].startsWith("- [x] HIPAA")) {
                applyPolicy = true;
                policyToApply = "Audit HITRUST/HIPAA";
            }
        }
        core.setOutput('appName', appName);
        core.setOutput('armTemplate', armTemplate);
        core.setOutput('approved', 'true');
        core.setOutput('applyPolicy', applyPolicy ? 'true' : 'false');
        core.setOutput('policyToApply', policyToApply);
    }
    catch (error) {
        console.error(error.message);
        core.setFailed(`Thanks-action failure: ${error}`);
    }
};
run();
exports.default = run;
