"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var AuthGate = function (_a) {
    var loading = _a.loading, error = _a.error, status = _a.status, children = _a.children;
    return children({ loading: loading, error: error, status: status });
};
// import {SFC} from 'react';
// const ConnectedLoginGate: SFC<LoginGateProps> = connect((state, {storeConnector}) => ({
var ConnectedAuthGate = (0, react_redux_1.connect)(function (state, _a) {
    var storeConnector = _a.storeConnector;
    return ({
        loading: storeConnector.getAuthLoading(state),
        error: storeConnector.getAuthError(state),
        status: storeConnector.getAuthStatus(state),
    });
})(AuthGate);
exports.default = ConnectedAuthGate;
//# sourceMappingURL=AuthGate.js.map