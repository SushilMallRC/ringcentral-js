"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscriptions = void 0;
var pubnub_1 = __importDefault(require("pubnub"));
var Subscription_1 = __importDefault(require("./subscription/Subscription"));
var CachedSubscription_1 = __importDefault(require("./subscription/CachedSubscription"));
var Subscriptions = /** @class */ (function () {
    function Subscriptions(_a) {
        var sdk = _a.sdk, _b = _a.PubNub, PubNub = _b === void 0 ? pubnub_1.default : _b;
        this._sdk = sdk;
        this._PubNub = PubNub;
        // eslint-disable-next-line no-console
        console.warn('PubNub support is deprecated. Please migrate your application to WebSockets.');
    }
    Subscriptions.prototype.createSubscription = function (_a) {
        var _b = _a === void 0 ? {} : _a, pollInterval = _b.pollInterval, renewHandicapMs = _b.renewHandicapMs;
        return new Subscription_1.default({
            pollInterval: pollInterval,
            renewHandicapMs: renewHandicapMs,
            sdk: this._sdk,
            PubNub: this._PubNub,
        });
    };
    Subscriptions.prototype.createCachedSubscription = function (_a) {
        var cacheKey = _a.cacheKey, pollInterval = _a.pollInterval, renewHandicapMs = _a.renewHandicapMs;
        return new CachedSubscription_1.default({
            cacheKey: cacheKey,
            pollInterval: pollInterval,
            renewHandicapMs: renewHandicapMs,
            sdk: this._sdk,
            PubNub: this._PubNub,
        });
    };
    Subscriptions.prototype.getPubNub = function () {
        return this._PubNub;
    };
    return Subscriptions;
}());
exports.Subscriptions = Subscriptions;
exports.default = Subscriptions;
//# sourceMappingURL=Subscriptions.js.map