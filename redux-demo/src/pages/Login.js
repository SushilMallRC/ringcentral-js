"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var react_redux_1 = require("react-redux");
var lib_1 = require("../lib");
var login = lib_1.storeConnector.actions.login;
var Login = function (_a) {
    var error = _a.error, _b = _a.location, pathname = _b.pathname, search = _b.search, hash = _b.hash;
    var query = lib_1.sdk.parseLoginRedirect(search || hash);
    // code is defined in redirect from OAuth
    if (query.code || query.access_token) {
        console.log(query); //eslint-disable-line
        login(query); // actually it's async, but it does not matter since we listen to everything
    }
    return (react_1.default.createElement("div", null,
        error && react_1.default.createElement("div", { style: { color: 'red' } },
            "Cannot login: ",
            error.toString()),
        react_1.default.createElement("button", { type: "button", onClick: function (e) { return (0, lib_1.openLogin)(query.redirect); } }, "Login to RingCentral")));
};
exports.default = (0, react_router_dom_1.withRouter)((0, react_redux_1.connect)(function (state) { return ({
    error: lib_1.storeConnector.getAuthError(state),
}); }, {
    login: login,
})(Login));
//# sourceMappingURL=Login.js.map