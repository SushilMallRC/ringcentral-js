import Subscription, { SubscriptionOptions, SubscriptionOptionsConstructor } from './Subscription';
export default class CachedSubscription extends Subscription {
    protected _cacheKey: string;
    constructor({ sdk, PubNub, cacheKey, pollInterval, renewHandicapMs }: CachedSubscriptionOptionsConstructor);
    subscription(): any;
    protected _setSubscription(subscription: any): this;
    /**
     * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
     */
    restore(events: string[]): this;
}
export interface CachedSubscriptionOptions extends SubscriptionOptions {
    cacheKey: string;
}
export interface CachedSubscriptionOptionsConstructor extends SubscriptionOptionsConstructor, CachedSubscriptionOptions {
}
