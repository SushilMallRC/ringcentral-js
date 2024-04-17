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
var Subscription_1 = __importDefault(require("./Subscription"));
var CachedSubscription = /** @class */ (function (_super) {
    __extends(CachedSubscription, _super);
    function CachedSubscription(_a) {
        var sdk = _a.sdk, PubNub = _a.PubNub, cacheKey = _a.cacheKey, pollInterval = _a.pollInterval, renewHandicapMs = _a.renewHandicapMs;
        var _this = _super.call(this, { sdk: sdk, PubNub: PubNub, pollInterval: pollInterval, renewHandicapMs: renewHandicapMs }) || this;
        if (!cacheKey) {
            throw new Error('Cached Subscription requires cacheKey parameter to be defined');
        }
        _this._cacheKey = cacheKey;
        return _this;
    }
    CachedSubscription.prototype.subscription = function () {
        return this._sdk.cache().getItemSync(this._cacheKey) || {};
    };
    CachedSubscription.prototype._setSubscription = function (subscription) {
        this._sdk.cache().setItemSync(this._cacheKey, subscription);
        return this;
    };
    /**
     * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
     */
    CachedSubscription.prototype.restore = function (events) {
        if (!this.eventFilters().length) {
            this.setEventFilters(events);
        }
        return this;
    };
    return CachedSubscription;
}(Subscription_1.default));
exports.default = CachedSubscription;
//# sourceMappingURL=CachedSubscription.js.map