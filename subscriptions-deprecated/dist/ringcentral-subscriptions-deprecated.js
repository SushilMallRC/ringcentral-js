(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@ringcentral/sdk"), require("pubnub"));
	else if(typeof define === 'function' && define.amd)
		define(["ringcentral", "pubnub"], factory);
	else if(typeof exports === 'object')
		exports["RingCentral"] = factory(require("@ringcentral/sdk"), require("pubnub"));
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["SubscriptionsDeprecated"] = factory(root["RingCentral"], root["PubNub"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__180__, __WEBPACK_EXTERNAL_MODULE__10__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 702:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subscriptions = void 0;
var pubnub_1 = __importDefault(__webpack_require__(10));
var Subscription_1 = __importDefault(__webpack_require__(807));
var CachedSubscription_1 = __importDefault(__webpack_require__(401));
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
exports["default"] = Subscriptions;


/***/ }),

/***/ 401:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Subscription_1 = __importDefault(__webpack_require__(807));
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
exports["default"] = CachedSubscription;


/***/ }),

/***/ 807:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.events = void 0;
var pubnub_1 = __importDefault(__webpack_require__(10));
var sdk_1 = __webpack_require__(180);
// detect ISO 8601 format string with +00[:00] timezone notations
var ISO_REG_EXP = /(\+[\d]{2}):?([\d]{2})?$/;
var buildIEFriendlyString = function (match, $1, $2) { return "".concat($1, ":").concat($2 || '00'); };
var parseISOString = function (time) {
    time = time || 0;
    if (typeof time === 'string') {
        return Date.parse(time.replace(ISO_REG_EXP, buildIEFriendlyString));
    }
    return time;
};
var events;
(function (events) {
    events["notification"] = "notification";
    events["removeSuccess"] = "removeSuccess";
    events["removeError"] = "removeError";
    events["renewSuccess"] = "renewSuccess";
    events["renewError"] = "renewError";
    events["subscribeSuccess"] = "subscribeSuccess";
    events["subscribeError"] = "subscribeError";
    events["automaticRenewSuccess"] = "automaticRenewSuccess";
    events["automaticRenewError"] = "automaticRenewError";
})(events = exports.events || (exports.events = {}));
var Subscription = /** @class */ (function (_super) {
    __extends(Subscription, _super);
    function Subscription(_a) {
        var sdk = _a.sdk, PubNub = _a.PubNub, _b = _a.pollInterval, pollInterval = _b === void 0 ? 10 * 1000 : _b, _c = _a.renewHandicapMs, renewHandicapMs = _c === void 0 ? 2 * 60 * 1000 : _c;
        var _this = _super.call(this) || this;
        _this.events = events;
        _this._pubnub = null;
        _this._pubnubLastChannel = null;
        _this._pubnubLastSubscribeKey = null;
        _this._timeout = null;
        _this._subscription = null;
        _this._automaticRenewPromise = null;
        _this._sdk = sdk;
        _this._PubNub = PubNub;
        _this._pollInterval = pollInterval;
        _this._renewHandicapMs = renewHandicapMs;
        return _this;
    }
    Subscription.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    Subscription.prototype.subscribed = function () {
        var subscription = this.subscription();
        return !!(subscription.id &&
            subscription.deliveryMode &&
            subscription.deliveryMode.subscriberKey &&
            subscription.deliveryMode.address);
    };
    Subscription.prototype.alive = function () {
        return this.subscribed() && Date.now() < this.expirationTime();
    };
    Subscription.prototype.expired = function () {
        if (!this.subscribed()) {
            return true;
        }
        return !this.subscribed() || Date.now() > parseISOString(this.subscription().expirationTime);
    };
    Subscription.prototype.expirationTime = function () {
        return parseISOString(this.subscription().expirationTime) - this._renewHandicapMs;
    };
    Subscription.prototype.setSubscription = function (subscription) {
        subscription = subscription || {};
        this._clearTimeout();
        this._setSubscription(subscription);
        this._subscribeAtPubNub();
        this._setTimeout();
        return this;
    };
    Subscription.prototype.subscription = function () {
        var _subscription = this._subscription || {};
        return __assign({}, _subscription);
    };
    Subscription.prototype.pubnub = function () {
        return this._pubnub;
    };
    /**
     * Creates or updates subscription if there is an active one
     */
    Subscription.prototype.register = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.alive()) {
                    return [2 /*return*/, this.renew()];
                }
                return [2 /*return*/, this.subscribe()];
            });
        });
    };
    Subscription.prototype.eventFilters = function () {
        return this.subscription().eventFilters || [];
    };
    Subscription.prototype.addEventFilters = function (eventFilters) {
        this.setEventFilters(this.eventFilters().concat(eventFilters));
        return this;
    };
    /**
     * @param {string[]} eventFilters
     * @return {Subscription}
     */
    Subscription.prototype.setEventFilters = function (eventFilters) {
        var subscription = this.subscription();
        subscription.eventFilters = eventFilters;
        this._setSubscription(subscription);
        return this;
    };
    Subscription.prototype.subscribe = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this._clearTimeout();
                        if (!this.eventFilters().length) {
                            throw new Error('Events are undefined');
                        }
                        return [4 /*yield*/, this._sdk.platform().post('/restapi/v1.0/subscription', {
                                eventFilters: this._getFullEventFilters(),
                                deliveryMode: {
                                    transportType: 'PubNub',
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        this.setSubscription(json).emit(this.events.subscribeSuccess, response);
                        return [2 /*return*/, response];
                    case 3:
                        e_1 = _a.sent();
                        // `reset` will remove pubnub instance.
                        // so if network is broken for a long time, pubnub will be removed. And client can not receive notification anymore.
                        this.reset().emit(this.events.subscribeError, e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Subscription.prototype.renew = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this._clearTimeout();
                        if (!this.subscribed()) {
                            throw new Error('No subscription');
                        }
                        if (!this.eventFilters().length) {
                            throw new Error('Events are undefined');
                        }
                        return [4 /*yield*/, this._sdk.platform().put("/restapi/v1.0/subscription/".concat(this.subscription().id), {
                                eventFilters: this._getFullEventFilters(),
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        this.setSubscription(json).emit(this.events.renewSuccess, response);
                        return [2 /*return*/, response];
                    case 3:
                        e_2 = _a.sent();
                        // `reset` will remove pubnub instance.
                        // so if network is broken for a long time, pubnub will be removed. And client can not receive notification anymore.
                        this.reset().emit(this.events.renewError, e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Subscription.prototype.remove = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.subscribed()) {
                            throw new Error('No subscription');
                        }
                        return [4 /*yield*/, this._sdk.platform().delete("/restapi/v1.0/subscription/".concat(this.subscription().id))];
                    case 1:
                        response = _a.sent();
                        this.reset().emit(this.events.removeSuccess, response);
                        return [2 /*return*/, response];
                    case 2:
                        e_3 = _a.sent();
                        this.emit(this.events.removeError, e_3);
                        throw e_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Subscription.prototype.resubscribe = function () {
        var filters = this.eventFilters();
        return this.reset()
            .setEventFilters(filters)
            .subscribe();
    };
    /**
     * Remove subscription and disconnect from PubNub
     * This method resets subscription at client side but backend is not notified
     */
    Subscription.prototype.reset = function () {
        this._clearTimeout();
        this._unsubscribeAtPubNub();
        this._setSubscription(null);
        return this;
    };
    /**
     * @param subscription
     * @private
     */
    Subscription.prototype._setSubscription = function (subscription) {
        this._subscription = __assign({}, subscription);
        return this;
    };
    /**
     * @return {string[]}
     * @private
     */
    Subscription.prototype._getFullEventFilters = function () {
        var _this = this;
        return this.eventFilters().map(function (event) { return _this._sdk.platform().createUrl(event); });
    };
    Subscription.prototype._automaticRenewHandler = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (this.alive()) {
                            return [2 /*return*/];
                        }
                        this._clearTimeout();
                        return [4 /*yield*/, (this.expired() ? this.subscribe() : this.renew())];
                    case 1:
                        res = _a.sent();
                        this.emit(this.events.automaticRenewSuccess, res);
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        this.emit(this.events.automaticRenewError, e_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @return {Subscription}
     * @private
     */
    Subscription.prototype._setTimeout = function () {
        var _this = this;
        this._clearTimeout();
        if (!this.alive()) {
            throw new Error('Subscription is not alive');
        }
        this._timeout = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._automaticRenewPromise) {
                            this._automaticRenewPromise = this._automaticRenewHandler();
                        }
                        return [4 /*yield*/, this._automaticRenewPromise];
                    case 1:
                        _a.sent();
                        this._automaticRenewPromise = null;
                        return [2 /*return*/];
                }
            });
        }); }, this._pollInterval);
        return this;
    };
    // check if app is automatic renewing
    Subscription.prototype.automaticRenewing = function () {
        return this._automaticRenewPromise;
    };
    /**
     * @return {Subscription}
     * @private
     */
    Subscription.prototype._clearTimeout = function () {
        clearInterval(this._timeout);
        return this;
    };
    Subscription.prototype._decrypt = function (message) {
        if (!this.subscribed()) {
            throw new Error('No subscription');
        }
        if (this.subscription().deliveryMode.encryptionKey) {
            //FIXME decrypt is not described in DTS
            message = this._pubnub.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb',
            });
        }
        return message;
    };
    Subscription.prototype._notify = function (message) {
        this.emit(this.events.notification, this._decrypt(message));
        return this;
    };
    Subscription.prototype._subscribeAtPubNub = function () {
        var _this = this;
        if (!this.alive()) {
            throw new Error('Subscription is not alive');
        }
        var _a = this.subscription().deliveryMode, address = _a.address, subscriberKey = _a.subscriberKey;
        if (this._pubnub) {
            if (this._pubnubLastChannel === address) {
                // Nothing to update, keep listening to same channel
                return this;
            }
            if (this._pubnubLastSubscribeKey && this._pubnubLastSubscribeKey !== subscriberKey) {
                // Subscribe key changed, need to reset everything
                this._unsubscribeAtPubNub();
            }
            else if (this._pubnubLastChannel) {
                // Need to subscribe to new channel
                this._pubnub.unsubscribeAll();
            }
        }
        if (!this._pubnub) {
            this._pubnubLastSubscribeKey = subscriberKey;
            var PubNub = this._PubNub;
            this._pubnub = new PubNub({
                ssl: true,
                restore: true,
                subscribeKey: subscriberKey,
                useRandomIVs: false,
            });
            this._pubnub.addListener({
                status: function (statusEvent) { },
                message: function (m) { return _this._notify(m.message); },
            });
        }
        this._pubnubLastChannel = address;
        this._pubnub.subscribe({ channels: [address] });
        return this;
    };
    Subscription.prototype._unsubscribeAtPubNub = function () {
        if (!this.subscribed() || !this._pubnub) {
            return this;
        }
        this._pubnub.unsubscribeAll();
        this._pubnub.removeAllListeners();
        this._pubnubLastSubscribeKey = null;
        this._pubnubLastChannel = null;
        this._pubnub = null;
        return this;
    };
    // Allow to force rebuild pubnub connection
    Subscription.prototype.resubscribeAtPubNub = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._unsubscribeAtPubNub();
                return [2 /*return*/, this.register()];
            });
        });
    };
    return Subscription;
}(sdk_1.SDK.EventEmitter));
exports["default"] = Subscription;


/***/ }),

/***/ 180:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__180__;

/***/ }),

/***/ 10:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__10__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(702);
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=ringcentral-subscriptions-deprecated.js.map