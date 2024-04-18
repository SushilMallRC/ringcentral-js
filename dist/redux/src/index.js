"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var actions_1 = __importDefault(require("./actions"));
var reducer_1 = require("./reducer");
var StoreConnector = /** @class */ (function () {
    function StoreConnector(_a) {
        var sdk = _a.sdk, _b = _a.root, root = _b === void 0 ? 'rcAuth' : _b;
        var _this = this;
        this.connectToStore = function (store) { return __awaiter(_this, void 0, void 0, function () {
            var dispatch, platform, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.store = store;
                        dispatch = store.dispatch;
                        platform = this.sdk.platform();
                        platform.on(platform.events.loginError, function (e) { return dispatch(_this.actions.authError(e)); });
                        platform.on(platform.events.refreshError, function (e) { return dispatch(_this.actions.authError(e)); });
                        platform.on(platform.events.logoutError, function (e) { return dispatch(_this.actions.authError(e)); });
                        platform.on(platform.events.loginSuccess, function () { return dispatch(_this.actions.loginSuccess()); });
                        platform.on(platform.events.logoutSuccess, function () { return dispatch(_this.actions.logoutSuccess()); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, platform.auth().accessTokenValid()];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        dispatch(this.actions.loginSuccess()); // manual dispatch
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, platform.refresh()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.reducer = (0, redux_1.combineReducers)({
            status: reducer_1.status,
            error: reducer_1.error,
            loading: reducer_1.loading,
        });
        this.getAuth = function (state) { return state[_this.root]; };
        this.getAuthStatus = function (state) { return _this.getAuth(state).status; };
        this.getAuthError = function (state) { return _this.getAuth(state).error; };
        this.getAuthLoading = function (state) { return _this.getAuth(state).loading; };
        this.sdk = sdk;
        this.root = root;
        this.actions = new actions_1.default({ sdk: sdk });
    }
    return StoreConnector;
}());
exports.default = StoreConnector;
//# sourceMappingURL=index.js.map