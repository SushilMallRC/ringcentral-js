"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var LoggedInWrapper_1 = __importDefault(require("./LoggedInWrapper"));
var LoggedOutWrapper_1 = __importDefault(require("./LoggedOutWrapper"));
var Router = function () { return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
    react_1.default.createElement(react_router_dom_1.Switch, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "/app", component: LoggedInWrapper_1.default }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/api", component: LoggedOutWrapper_1.default }),
        react_1.default.createElement(react_router_dom_1.Redirect, { from: "/", to: "/app" })))); };
exports.default = Router;
//# sourceMappingURL=Router.js.map