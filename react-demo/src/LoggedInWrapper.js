"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var react_2 = require("@ringcentral/react");
var Dashboard_1 = __importDefault(require("./Dashboard"));
var lib_1 = require("./lib");
var LoggedInWrapper = function (_a) {
    var isAuthorized = _a.isAuthorized, authorizing = _a.authorizing, logout = _a.logout, match = _a.match, location = _a.location;
    if (authorizing) {
        return react_1.default.createElement("div", null, "Loading...");
    }
    if (!isAuthorized) {
        return (react_1.default.createElement(react_router_dom_1.Redirect, { to: {
                pathname: '/api/login',
                state: {
                    from: location,
                },
            } }));
    }
    return (react_1.default.createElement("div", { className: "layout" },
        react_1.default.createElement("button", { type: "button", onClick: logout }, "Log out"),
        react_1.default.createElement(react_router_dom_1.Switch, null,
            react_1.default.createElement(react_router_dom_1.Route, { component: Dashboard_1.default }))));
};
exports.default = (0, react_2.withAuthGate)({ sdk: lib_1.sdk, ensure: true })(LoggedInWrapper);
//# sourceMappingURL=LoggedInWrapper.js.map