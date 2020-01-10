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
        const creature = core.getInput('amazing-creature');
        if (creature === 'mosquito') {
            core.setFailed('Sorry, mosquitos are not amazing');
            return;
        }
        const pusherName = github.context.payload.pusher.name;
        const message = `Hello ${pusherName}! You are an amazing ${creature}!`;
        core.debug(message);
        core.setOutput('amazing-message', message);
    }
    catch (error) {
        core.setFailed(`Debug-action failure: ${error}`);
    }
};
run();
exports.default = run;
