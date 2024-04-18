"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdk = void 0;
var sdk_1 = __importDefault(require("@ringcentral/sdk"));
var package_json_1 = __importDefault(require("../package.json"));
var redirectUri = "".concat(window.location.origin, "/api/oauth2Callback"); // make sure you have this configured in Dev Portal
exports.sdk = new sdk_1.default({
    appName: 'ReactDemo',
    appVersion: package_json_1.default.version,
    server: process.env.REACT_APP_API_SERVER,
    clientId: process.env.REACT_APP_API_CLIENT_ID,
    redirectUri: redirectUri,
});
//# sourceMappingURL=lib.js.map