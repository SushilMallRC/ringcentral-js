"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loading = exports.error = exports.status = void 0;
var constants_1 = require("./constants");
var status = function (state, _a) {
    if (state === void 0) { state = false; }
    var type = _a.type;
    switch (type) {
        case constants_1.LOGIN_SUCCESS:
            return true;
        case constants_1.AUTH_ERROR:
        case constants_1.LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
};
exports.status = status;
var error = function (state, _a) {
    if (state === void 0) { state = null; }
    var type = _a.type, payload = _a.payload;
    switch (type) {
        case constants_1.LOGIN_SUCCESS:
        case constants_1.LOGOUT_SUCCESS:
            return null;
        case constants_1.AUTH_ERROR:
            return payload;
        default:
            return state;
    }
};
exports.error = error;
var loading = function (state, _a) {
    if (state === void 0) { state = true; }
    var type = _a.type;
    switch (type) {
        case constants_1.LOGIN_SUCCESS:
        case constants_1.AUTH_ERROR:
            return false;
        default:
            return state;
    }
};
exports.loading = loading;
//# sourceMappingURL=reducer.js.map