"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_dom_1 = require("react-dom");
var Router_1 = __importDefault(require("./Router"));
(0, react_dom_1.render)(react_1.default.createElement(Router_1.default, null), document.getElementById('app'));
if (module.hot) {
    module.hot.accept();
}
//# sourceMappingURL=index.js.map