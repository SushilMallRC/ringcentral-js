"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@ringcentral/sdk/src/test/test");
var test_2 = require("../test/test");
describe('CachedSubscription', function () {
    describe('create', function () {
        it('supports legacy definition', (0, test_1.asyncTest)(function (sdk) {
            var sub = (0, test_2.createSubscriptions)(sdk);
            var subscription1 = sub.createCachedSubscription({ cacheKey: 'foo' });
            var subscription2 = sub.createCachedSubscription({
                cacheKey: 'foo',
                pollInterval: 11,
                renewHandicapMs: 22,
            });
            var data = {
                id: 'foo',
                expirationTime: new Date(Date.now() + 10000).toISOString(),
                deliveryMode: {
                    subscriberKey: 'foo',
                    address: 'foo',
                },
            };
            (0, test_1.expect)(subscription1['_cacheKey']).toEqual('foo');
            (0, test_1.expect)(subscription2['_cacheKey']).toEqual('foo');
            (0, test_1.expect)(subscription2['_pollInterval']).toEqual(11);
            (0, test_1.expect)(subscription2['_renewHandicapMs']).toEqual(22);
            subscription1['_setSubscription'](data);
            (0, test_1.expect)(subscription2.subscription()).toEqual(data);
        }));
    });
    describe('restore', function () {
        it('sets event filters if they are not defined', (0, test_1.asyncTest)(function (sdk) {
            var sub = (0, test_2.createSubscriptions)(sdk);
            var s = sub.createCachedSubscription({ cacheKey: 'foo' });
            s.restore(['foo']);
            (0, test_1.expect)(s.eventFilters()).toEqual(['foo']);
        }));
        it('uses previous event filters if they are defined', (0, test_1.asyncTest)(function (sdk) {
            var sub = (0, test_2.createSubscriptions)(sdk);
            var s = sub.createCachedSubscription({ cacheKey: 'foo' });
            s.restore(['bar']);
            s.restore(['foo']);
            (0, test_1.expect)(s.eventFilters()).toEqual(['bar']);
        }));
        it.skip('sets appropriate event filters if subscription is not alive', function () { });
        it.skip('sets appropriate event filters if subscription is never existed', function () { });
        it.skip('renews subscription if cache data is OK', function () { });
        it.skip('re-subscribes with default event filters when renew fails', function () { });
    });
    describe.skip('renew', function () { });
    describe.skip('resubscribe', function () { });
});
//# sourceMappingURL=CachedSubscription-spec.js.map