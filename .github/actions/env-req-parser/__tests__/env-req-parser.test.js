"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const env_req_parser_1 = __importDefault(require("../env-req-parser"));
beforeEach(() => {
    jest.resetModules();
    github.context.payload = {
        action: 'labeled',
        issue: {
            number: 1,
            body: "Application Name: SuperCoolFunApp\r\n- [x] Web App Hosting (Azure App Service+SQL Database combination)\r\n-[x] Development",
            labels: [
                { name: "approved" }
            ]
        },
    };
});
afterEach(() => {
});
describe('parse environment request body', () => {
    it('outputs entered values', async () => {
        const setOutputMock = jest.spyOn(core, 'setOutput');
        await env_req_parser_1.default();
        expect(setOutputMock).toHaveBeenCalledWith('appName', 'SuperCoolFunApp');
        expect(setOutputMock).toHaveBeenCalledWith('armTemplate', 'web-app-sql-database');
        expect(setOutputMock).toHaveBeenCalledWith('environmentType', 'Dev');
    });
});
