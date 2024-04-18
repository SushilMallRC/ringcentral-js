"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuthGate = exports.AuthGate = void 0;
var react_1 = __importStar(require("react"));
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
var delay = function () { return new Promise(function (res) { return setTimeout(res, 0); }); };
var AuthGate = /** @class */ (function (_super) {
    __extends(AuthGate, _super);
    function AuthGate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isAuthorized: false,
            authorizing: true,
            authError: null,
        };
        /**
         * purposely going through antipattern because we can't cancel promises for now
         * we still cancel subscriptions etc., but we can't guarantee when storage promises will resolve
         * @type {boolean}
         */
        _this.mounted = false;
        _this.before = function () { return _this.mounted && _this.setState({ authorizing: true }); };
        _this.error = function (e) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.updateState(e)];
        }); }); };
        _this.success = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this.updateState(null)];
        }); }); };
        _this.loginUrl = function (options) { return _this.props.sdk.platform().loginUrl(options); };
        _this.logout = function () { return __awaiter(_this, void 0, void 0, function () {
            var platform;
            return __generator(this, function (_a) {
                platform = this.props.sdk.platform();
                return [2 /*return*/, platform.logout()];
            });
        }); };
        _this.parseRedirect = function (search) { return __awaiter(_this, void 0, void 0, function () {
            var platform, loginOptions, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 1, , 3]);
                        platform = this.props.sdk.platform();
                        loginOptions = platform.parseLoginRedirect(search);
                        if (!loginOptions.code && !loginOptions.access_token) {
                            throw new Error('No authorization information');
                        }
                        return [2 /*return*/, platform.login(loginOptions)];
                    case 1:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.error(e_1)];
                    case 2:
                        _a.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.updateState = function () {
            var args_1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args_1[_i] = arguments[_i];
            }
            return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (authError) {
                var _a, _b;
                var _c;
                if (authError === void 0) { authError = null; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, delay()];
                        case 1:
                            _d.sent();
                            _a = this.mounted;
                            if (!_a) return [3 /*break*/, 3];
                            _b = this.setState;
                            _c = {};
                            return [4 /*yield*/, this.props.sdk
                                    .platform()
                                    .auth()
                                    .accessTokenValid()];
                        case 2:
                            _a = _b.apply(this, [(_c.isAuthorized = _d.sent(),
                                    _c.authorizing = false,
                                    _c.authError = authError,
                                    _c)]);
                            _d.label = 3;
                        case 3:
                            _a;
                            return [2 /*return*/];
                    }
                });
            });
        };
        return _this;
    }
    AuthGate.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, sdk, ensure, platform, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.mounted = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 7]);
                        _a = this.props, sdk = _a.sdk, ensure = _a.ensure;
                        platform = sdk.platform();
                        platform.on(platform.events.beforeRefresh, this.before);
                        platform.on(platform.events.beforeLogin, this.before);
                        platform.on(platform.events.refreshError, this.error);
                        platform.on(platform.events.loginError, this.error);
                        platform.on(platform.events.logoutSuccess, this.success);
                        platform.on(platform.events.loginSuccess, this.success);
                        platform.on(platform.events.refreshSuccess, this.success);
                        if (!ensure) return [3 /*break*/, 3];
                        return [4 /*yield*/, platform.ensureLoggedIn()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.updateState()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        e_2 = _b.sent();
                        return [4 /*yield*/, this.updateState(e_2)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthGate.prototype.componentWillUnmount = function () {
        this.mounted = false;
        var sdk = this.props.sdk;
        var platform = sdk.platform();
        platform.removeListener(platform.events.beforeRefresh, this.before);
        platform.removeListener(platform.events.beforeLogin, this.before);
        platform.removeListener(platform.events.refreshError, this.error);
        platform.removeListener(platform.events.loginError, this.error);
        platform.removeListener(platform.events.logoutSuccess, this.success);
        platform.removeListener(platform.events.loginSuccess, this.success);
        platform.removeListener(platform.events.refreshSuccess, this.success);
    };
    AuthGate.prototype.render = function () {
        var _a = this.props, sdk = _a.sdk, ensure = _a.ensure, children = _a.children, props = __rest(_a, ["sdk", "ensure", "children"]);
        return children(__assign(__assign(__assign({}, this.state), props), { loginUrl: this.loginUrl, parseRedirect: this.parseRedirect, logout: this.logout }));
    };
    // default props
    AuthGate.defaultProps = {
        ensure: false,
    };
    return AuthGate;
}(react_1.Component));
exports.AuthGate = AuthGate;
//TODO Definition
var withAuthGate = function (_a) {
    var sdk = _a.sdk, _b = _a.ensure, ensure = _b === void 0 ? false : _b;
    return function (Cmp) {
        var WrappedCmp = function (props) { return (react_1.default.createElement(AuthGate, { sdk: sdk, ensure: ensure }, function (renderProps) { return react_1.default.createElement(Cmp, __assign({}, props, renderProps)); })); };
        WrappedCmp.displayName = "withAuthGate(".concat(getDisplayName(Cmp), ")");
        return WrappedCmp;
    };
};
exports.withAuthGate = withAuthGate;
//# sourceMappingURL=AuthGate.js.map