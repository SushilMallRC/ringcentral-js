"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var AuthGate_1 = __importDefault(require("@ringcentral/redux/lib/AuthGate"));
var lib_1 = require("./lib");
var Index_1 = __importDefault(require("./pages/Index"));
var Login_1 = __importDefault(require("./pages/Login"));
var Router = function (_a) {
    var store = _a.store, storeConnector = _a.storeConnector;
    return (react_1.default.createElement(react_redux_1.Provider, { store: store },
        react_1.default.createElement(AuthGate_1.default, { storeConnector: storeConnector }, function (_a) {
            var loading = _a.loading;
            return loading ? (react_1.default.createElement("div", null, "Loading auth...")) : (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
                react_1.default.createElement(react_router_dom_1.Switch, null,
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/", exact: true, component: (0, lib_1.authenticated)(Index_1.default) }),
                    react_1.default.createElement(react_router_dom_1.Route, { path: lib_1.redirectPath, exact: true, component: (0, lib_1.notAuthenticated)(Login_1.default) }))));
        })));
};
exports.default = Router;
//# sourceMappingURL=Router.js.map