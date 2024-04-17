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
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@ringcentral/sdk/src/test/test");
var test_2 = require("../test/test");
var pollInterval = 1; // ms
var renewHandicapMs = 30; // ms
var expiresIn = 10; // s
var quickExpiresIn = 0.1; // s
var createSubscription = function (sdk) {
    return (0, test_2.createSubscriptions)(sdk).createSubscription({
        pollInterval: pollInterval,
        renewHandicapMs: renewHandicapMs,
    });
};
describe('Subscription', function () {
    describe('register', function () {
        it('automatically renews subscription', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(quickExpiresIn);
                        (0, test_2.subscribeGeneric)(10, 'foo-bar-baz'); // should be a good value for future response
                        subscription = createSubscription(sdk);
                        return [4 /*yield*/, subscription.setEventFilters(['foo', 'bar']).register()];
                    case 1:
                        _a.sent();
                        (0, test_1.expect)(subscription.subscription().expiresIn).toEqual(quickExpiresIn);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                subscription.on(subscription.events.automaticRenewError, function (e) {
                                    reject(e);
                                });
                                subscription.on(subscription.events.automaticRenewSuccess, function () {
                                    resolve(null);
                                });
                            })];
                    case 2:
                        _a.sent();
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('automatically renews subscription with +0000 timezone format', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(quickExpiresIn, null, null, '+0000');
                        (0, test_2.subscribeGeneric)(10, 'foo-bar-baz'); // should be a good value for future response
                        subscription = createSubscription(sdk);
                        return [4 /*yield*/, subscription.setEventFilters(['foo', 'bar']).register()];
                    case 1:
                        _a.sent();
                        (0, test_1.expect)(subscription.subscription().expiresIn).toEqual(quickExpiresIn);
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                subscription.on(subscription.events.automaticRenewError, function (e) {
                                    reject(e);
                                });
                                subscription.on(subscription.events.automaticRenewSuccess, function () {
                                    resolve(null);
                                });
                            })];
                    case 2:
                        _a.sent();
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('captures automatic subscription renew errors', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var subscription, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(quickExpiresIn);
                        (0, test_1.apiCall)('PUT', '/restapi/v1.0/subscription/foo-bar-baz', { message: 'expected' }, 400, 'Bad Request');
                        subscription = createSubscription(sdk);
                        return [4 /*yield*/, subscription.setEventFilters(['foo', 'bar']).register()];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                subscription.on(subscription.events.automaticRenewError, function (e) {
                                    (0, test_1.expect)(e.message).toEqual('expected');
                                    resolve(null);
                                });
                                subscription.on(subscription.events.automaticRenewSuccess, function () {
                                    reject(new Error('This should not be reached'));
                                });
                            })];
                    case 2:
                        _a.sent();
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('resubscribe', function () {
        it('resets and resubscribes', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(expiresIn);
                        s = createSubscription(sdk).setEventFilters(['foo', 'bar']);
                        return [4 /*yield*/, s.resubscribe()];
                    case 1:
                        _a.sent();
                        (0, test_1.expect)(s.subscription().expiresIn).toEqual(expiresIn);
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('resubscribeAtPubNub', function () {
        it('resubscribe pubnub instance', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s, oldPubNub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(expiresIn);
                        s = createSubscription(sdk).setEventFilters(['foo', 'bar']);
                        return [4 /*yield*/, s.register()];
                    case 1:
                        _a.sent();
                        oldPubNub = s.pubnub();
                        (0, test_2.subscribeGeneric)(expiresIn + 10, s.subscription().id);
                        return [4 /*yield*/, s.resubscribeAtPubNub()];
                    case 2:
                        _a.sent();
                        (0, test_1.expect)(s.subscription().expiresIn).toEqual(expiresIn + 10);
                        (0, test_1.expect)(!!s.pubnub()).toEqual(true);
                        (0, test_1.expect)(s.pubnub()).not.toEqual(oldPubNub);
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('notify', function () {
        it('fires a notification event when the notify method is called and passes the message object', (0, test_1.asyncTest)(function (sdk) {
            return new Promise(function (resolve) {
                var subscription = createSubscription(sdk);
                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo',
                    },
                });
                subscription.on(subscription.events.notification, function (event) {
                    (0, test_1.expect)(event).toEqual({ foo: 'bar' });
                    resolve(1);
                });
                subscription['_notify']({ foo: 'bar' });
                subscription.reset();
            });
        }));
    });
    describe('renew', function () {
        it('fails when no subscription', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s = createSubscription(sdk);
                        return [4 /*yield*/, (0, test_1.expectThrows)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, s.renew()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 'No subscription')];
                    case 1:
                        _a.sent();
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('fails when no eventFilters', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s = createSubscription(sdk);
                        return [4 /*yield*/, (0, test_1.expectThrows)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, s
                                                .setSubscription({
                                                id: 'foo',
                                                expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                                                deliveryMode: {
                                                    subscriberKey: 'foo',
                                                    address: 'foo',
                                                },
                                            })
                                                .renew()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 'Events are undefined')];
                    case 1:
                        _a.sent();
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('renews successfully', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(expiresIn, 'foo');
                        subscription = createSubscription(sdk);
                        subscription.setSubscription({
                            id: 'foo',
                            expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                            eventFilters: ['foo'],
                            deliveryMode: {
                                subscriberKey: 'foo',
                                address: 'foo',
                            },
                        });
                        return [4 /*yield*/, subscription.renew()];
                    case 1:
                        _a.sent();
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('remove', function () {
        it('fails when no subscription', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s = createSubscription(sdk);
                        return [4 /*yield*/, (0, test_1.expectThrows)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, s.remove()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 'No subscription')];
                    case 1:
                        _a.sent();
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('removes successfully', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(expiresIn, 'foo', true);
                        subscription = createSubscription(sdk);
                        subscription.setSubscription({
                            id: 'foo',
                            expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                            eventFilters: ['foo'],
                            deliveryMode: {
                                subscriberKey: 'foo',
                                address: 'foo',
                            },
                        });
                        return [4 /*yield*/, subscription.remove()];
                    case 1:
                        _a.sent();
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('removes successfully', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_2.subscribeGeneric)(expiresIn, 'foo', true);
                        subscription = createSubscription(sdk);
                        subscription.setSubscription({
                            id: 'foo',
                            expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                            eventFilters: ['foo'],
                            deliveryMode: {
                                subscriberKey: 'foo',
                                address: 'foo',
                            },
                        });
                        return [4 /*yield*/, subscription.remove()];
                    case 1:
                        _a.sent();
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('subscribe', function () {
        it('fails when no eventFilters', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        s = createSubscription(sdk);
                        return [4 /*yield*/, (0, test_1.expectThrows)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, s.subscribe()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 'Events are undefined')];
                    case 1:
                        _a.sent();
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('calls the success callback and passes the subscription provided from the platform', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var event, subscription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event = 'foo';
                        subscription = createSubscription(sdk);
                        (0, test_2.subscribeGeneric)();
                        return [4 /*yield*/, subscription.setEventFilters([event]).subscribe()];
                    case 1:
                        _a.sent();
                        (0, test_1.expect)(subscription.subscription().eventFilters.length).toEqual(1);
                        subscription.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
        it('calls the error callback and passes the error provided from the platform', (0, test_1.asyncTest)(function (sdk) { return __awaiter(void 0, void 0, void 0, function () {
            var s;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, test_1.apiCall)('POST', '/restapi/v1.0/subscription', { message: 'Subscription failed' }, 400, 'Bad Request');
                        s = createSubscription(sdk);
                        return [4 /*yield*/, (0, test_1.expectThrows)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, s.setEventFilters(['foo']).subscribe()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 'Subscription failed')];
                    case 1:
                        _a.sent();
                        s.reset();
                        return [2 /*return*/];
                }
            });
        }); }));
    });
    describe('decrypt', function () {
        it('decrypts AES-encrypted messages when the subscription has an encryption key', (0, test_1.asyncTest)(function (sdk) {
            var subscription = createSubscription(sdk);
            var aesMessage = 'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtI' +
                'BsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt' +
                '6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1r' +
                'k/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=';
            subscription.setSubscription({
                id: 'foo',
                expirationTime: new Date(Date.now() + expiresIn * 1000).toISOString(),
                deliveryMode: {
                    encryptionKey: 'e0bMTqmumPfFUbwzppkSbA==',
                    subscriberKey: 'foo',
                    address: 'foo',
                },
            });
            (0, test_1.expect)(subscription._decrypt(aesMessage)).toEqual({
                timestamp: '2014-03-12T20:47:54.712+0000',
                body: {
                    extensionId: 402853446008,
                    telephonyStatus: 'OnHold',
                },
                event: '/restapi/v1.0/account/~/extension/402853446008/presence',
                uuid: 'db01e7de-5f3c-4ee5-ab72-f8bd3b77e308',
            });
            subscription.reset();
        }));
    });
});
//# sourceMappingURL=Subscription-spec.js.map