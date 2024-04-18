"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Actions = /** @class */ (function () {
    function Actions(_a) {
        var sdk = _a.sdk;
        var _this = this;
        this.login = function (query) {
            if (query.error_description) {
                return _this.authError(new Error(query.error_description));
            }
            _this.sdk.login(query); // we ignore promise result because we listen to all events already
            return { type: constants_1.LOGIN };
        };
        this.logout = function () {
            _this.sdk.logout(); // we ignore promise result because we listen to all events already
            return { type: constants_1.LOGOUT };
        };
        this.loginSuccess = function () { return ({
            type: constants_1.LOGIN_SUCCESS,
        }); };
        this.authError = function (error) { return ({
            type: constants_1.AUTH_ERROR,
            payload: error,
            error: true,
        }); };
        this.logoutSuccess = function () { return ({
            type: constants_1.LOGOUT_SUCCESS,
        }); };
        this.sdk = sdk;
    }
    return Actions;
}());
exports.default = Actions;
//# sourceMappingURL=actions.js.map