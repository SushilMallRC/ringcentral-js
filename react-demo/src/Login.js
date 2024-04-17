"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_2 = require("@ringcentral/react");
var lib_1 = require("./lib");
var Login = function (_a) {
    var authError = _a.authError, loginUrl = _a.loginUrl, authorizing = _a.authorizing;
    if (authorizing) {
        return react_1.default.createElement("div", null, "Loading...");
    }
    var login = function () { return window.location.assign(loginUrl({ implicit: true })); };
    return (react_1.default.createElement("div", null,
        authError && react_1.default.createElement("p", null,
            "Auth error: ",
            authError),
        react_1.default.createElement("button", { type: "button", onClick: login }, "Log in with RingCentral")));
};
exports.default = (0, react_2.withAuthGate)({ sdk: lib_1.sdk })(Login);
//# sourceMappingURL=Login.js.map