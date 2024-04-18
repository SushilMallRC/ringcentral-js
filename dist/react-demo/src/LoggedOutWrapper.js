"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var react_2 = require("@ringcentral/react");
var OauthRedirect_1 = __importDefault(require("./OauthRedirect"));
var Login_1 = __importDefault(require("./Login"));
var lib_1 = require("./lib");
var LoggedOutWrapper = function (_a) {
    var isAuthorized = _a.isAuthorized, authorizing = _a.authorizing, authError = _a.authError, match = _a.match, location = _a.location;
    if (authorizing) {
        return react_1.default.createElement("div", null, "Loading");
    }
    if (isAuthorized) {
        var from = (location.state || { from: { pathname: '/' } }).from;
        console.log('Redirecting to', from); //eslint-disable-line
        return react_1.default.createElement(react_router_dom_1.Redirect, { to: from });
    }
    return (react_1.default.createElement(react_router_dom_1.Switch, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "".concat(match.url, "/login"), exact: true, component: Login_1.default }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "".concat(match.url, "/oauth2Callback"), exact: true, component: OauthRedirect_1.default })));
};
exports.default = (0, react_2.withAuthGate)({ sdk: lib_1.sdk, ensure: true })(LoggedOutWrapper);
//# sourceMappingURL=LoggedOutWrapper.js.map