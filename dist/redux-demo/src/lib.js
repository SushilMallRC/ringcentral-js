"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notAuthenticated = exports.authenticated = exports.openLogin = exports.createStore = exports.storeConnector = exports.sdk = exports.redirectUri = exports.redirectPath = void 0;
var redux_1 = require("redux");
var locationHelper_1 = __importDefault(require("redux-auth-wrapper/history4/locationHelper"));
var redirect_1 = require("redux-auth-wrapper/history4/redirect");
var redux_logger_1 = require("redux-logger");
var redux_2 = __importDefault(require("@ringcentral/redux"));
var sdk_1 = __importDefault(require("@ringcentral/sdk"));
var package_json_1 = __importDefault(require("../package.json"));
var locationHelper = (0, locationHelper_1.default)({});
exports.redirectPath = '/api/oauth2Callback';
exports.redirectUri = window.location.origin + exports.redirectPath;
exports.sdk = new sdk_1.default({
    appName: 'ReduxDemo',
    appVersion: package_json_1.default.version,
    server: process.env.REACT_APP_API_SERVER,
    clientId: process.env.REACT_APP_API_CLIENT_ID,
    redirectUri: exports.redirectUri,
});
exports.storeConnector = new redux_2.default({ sdk: exports.sdk });
var createStore = function () {
    var _a;
    var store = (0, redux_1.createStore)((0, redux_1.combineReducers)((_a = {},
        _a[exports.storeConnector.root] = exports.storeConnector.reducer,
        _a)), undefined, (0, redux_1.applyMiddleware)((0, redux_logger_1.createLogger)({
        level: process.env.NODE_ENV !== 'production' ? 'log' : 'error',
        collapsed: function (getState, action, logEntry) { return !logEntry.error; },
        diff: true,
    })));
    exports.storeConnector.connectToStore(store);
    return store;
};
exports.createStore = createStore;
var openLogin = function (pathname) { return window.location.assign(exports.sdk.loginUrl({ state: pathname, implicit: true })); };
exports.openLogin = openLogin;
exports.authenticated = (0, redirect_1.connectedRouterRedirect)({
    redirectPath: exports.redirectPath,
    authenticatedSelector: exports.storeConnector.getAuthStatus,
    wrapperDisplayName: 'UserIsAuthenticated',
});
exports.notAuthenticated = (0, redirect_1.connectedRouterRedirect)({
    redirectPath: function (state, ownProps) {
        var _a = ownProps.location, _b = _a === void 0 ? {} : _a, _c = _b.search, search = _c === void 0 ? '' : _c, _d = _b.hash, hash = _d === void 0 ? '' : _d;
        var query = search ? exports.sdk.parseLoginRedirect(search || hash) : { state: '/' };
        return query.state || locationHelper.getRedirectQueryParam(ownProps) || '/';
    },
    allowRedirectBack: false,
    authenticatedSelector: function (state) { return !exports.storeConnector.getAuthStatus(state); },
    wrapperDisplayName: 'UserIsNotAuthenticated',
});
//# sourceMappingURL=lib.js.map