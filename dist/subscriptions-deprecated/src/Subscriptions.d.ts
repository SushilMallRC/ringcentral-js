import PubNubDefault from 'pubnub';
import { SDK } from '@ringcentral/sdk';
import Subscription, { SubscriptionOptions } from './subscription/Subscription';
import CachedSubscription, { CachedSubscriptionOptions } from './subscription/CachedSubscription';
export { SubscriptionOptions, CachedSubscriptionOptions };
export declare class Subscriptions {
    private _sdk;
    private _PubNub;
    constructor({ sdk, PubNub }: SubscriptionsOptions);
    createSubscription({ pollInterval, renewHandicapMs }?: SubscriptionOptions): Subscription;
    createCachedSubscription({ cacheKey, pollInterval, renewHandicapMs }: CachedSubscriptionOptions): CachedSubscription;
    getPubNub(): any;
}
export interface SubscriptionsOptions {
    sdk: SDK;
    PubNub?: typeof PubNubDefault;
}
export default Subscriptions;
