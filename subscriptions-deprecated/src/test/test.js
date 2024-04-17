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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeOnPresence = exports.subscribeGeneric = exports.presenceLoad = exports.createSubscriptions = void 0;
var pubnub_1 = __importDefault(require("pubnub"));
var test_1 = require("@ringcentral/sdk/src/test/test");
var Subscriptions_1 = require("../Subscriptions");
var PubNubMock = /** @class */ (function (_super) {
    __extends(PubNubMock, _super);
    function PubNubMock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.subscribe = function (params) { }; //FIXME Actual subscribe slows down test teardown
        return _this;
    }
    return PubNubMock;
}(pubnub_1.default));
var createSubscriptions = function (sdk) { return new Subscriptions_1.Subscriptions({ sdk: sdk, PubNub: PubNubMock }); };
exports.createSubscriptions = createSubscriptions;
function presenceLoad(id) {
    (0, test_1.apiCall)('GET', "/restapi/v1.0/account/~/extension/".concat(id, "/presence"), {
        uri: "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/".concat(id, "/presence"),
        extension: {
            uri: "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/".concat(id),
            id: id,
            extensionNumber: '101',
        },
        activeCalls: [],
        presenceStatus: 'Available',
        telephonyStatus: 'Ringing',
        userStatus: 'Available',
        dndStatus: 'TakeAllCalls',
        extensionId: id,
    });
}
exports.presenceLoad = presenceLoad;
function subscribeGeneric(expiresIn, id, remove, timeZoneString) {
    if (expiresIn === void 0) { expiresIn = 15 * 60 * 60; }
    if (id === void 0) { id = null; }
    if (remove === void 0) { remove = false; }
    if (timeZoneString === void 0) { timeZoneString = null; }
    var date = new Date();
    var method = 'POST';
    if (id) {
        method = 'PUT';
    }
    if (remove) {
        method = 'DELETE';
    }
    var expirationTime = new Date(date.getTime() + expiresIn * 1000).toISOString();
    if (timeZoneString) {
        expirationTime = expirationTime.replace('Z', timeZoneString);
    }
    (0, test_1.apiCall)(method, "/restapi/v1.0/subscription".concat(id ? "/".concat(id) : ''), remove
        ? ''
        : {
            eventFilters: ['/restapi/v1.0/account/~/extension/~/presence'],
            expirationTime: expirationTime,
            expiresIn: expiresIn,
            deliveryMode: {
                transportType: 'PubNub',
                encryption: false,
                address: '123_foo',
                subscriberKey: 'sub-c-foo',
                secretKey: 'sec-c-bar',
            },
            id: 'foo-bar-baz',
            creationTime: date.toISOString(),
            status: 'Active',
            uri: 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz',
        });
}
exports.subscribeGeneric = subscribeGeneric;
function subscribeOnPresence(id, detailed) {
    if (id === void 0) { id = '1'; }
    if (detailed === void 0) { detailed = false; }
    var date = new Date();
    (0, test_1.apiCall)('POST', '/restapi/v1.0/subscription', {
        eventFilters: [
            "/restapi/v1.0/account/~/extension/".concat(id, "/presence").concat(detailed ? '?detailedTelephonyState=true' : ''),
        ],
        expirationTime: new Date(date.getTime() + 15 * 60 * 60 * 1000).toISOString(),
        deliveryMode: {
            transportType: 'PubNub',
            encryption: true,
            address: '123_foo',
            subscriberKey: 'sub-c-foo',
            secretKey: 'sec-c-bar',
            encryptionAlgorithm: 'AES',
            encryptionKey: 'VQwb6EVNcQPBhE/JgFZ2zw==',
        },
        creationTime: date.toISOString(),
        id: 'foo-bar-baz',
        status: 'Active',
        uri: 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz',
    });
}
exports.subscribeOnPresence = subscribeOnPresence;
//# sourceMappingURL=test.js.map