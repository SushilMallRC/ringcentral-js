import PubNubDefault from 'pubnub';
import { ApiError, SDK } from '@ringcentral/sdk';
declare class ActualPubNub extends PubNubDefault {
    removeAllListeners: any;
    decrypt: any;
}
export declare enum events {
    notification = "notification",
    removeSuccess = "removeSuccess",
    removeError = "removeError",
    renewSuccess = "renewSuccess",
    renewError = "renewError",
    subscribeSuccess = "subscribeSuccess",
    subscribeError = "subscribeError",
    automaticRenewSuccess = "automaticRenewSuccess",
    automaticRenewError = "automaticRenewError"
}
export default class Subscription extends SDK.EventEmitter {
    events: typeof events;
    protected _sdk: SDK;
    protected _PubNub: typeof ActualPubNub;
    protected _pollInterval: number;
    protected _renewHandicapMs: number;
    protected _pubnub: ActualPubNub;
    protected _pubnubLastChannel: string;
    protected _pubnubLastSubscribeKey: string;
    protected _timeout: any;
    protected _subscription: SubscriptionData;
    protected _automaticRenewPromise: Promise<void>;
    constructor({ sdk, PubNub, pollInterval, renewHandicapMs, }: SubscriptionOptionsConstructor);
    on(event: events.notification, listener: (body: any) => void): any;
    on(event: events.removeSuccess, listener: (response: Response) => void): any;
    on(event: events.removeError, listener: (error: ApiError | Error) => void): any;
    on(event: events.renewSuccess, listener: (response: Response) => void): any;
    on(event: events.renewError, listener: (error: ApiError | Error) => void): any;
    on(event: events.automaticRenewSuccess, listener: (response: Response) => void): any;
    on(event: events.automaticRenewError, listener: (error: ApiError | Error) => void): any;
    on(event: events.subscribeSuccess, listener: (response: Response) => void): any;
    on(event: events.subscribeError, listener: (error: ApiError | Error) => void): any;
    subscribed(): boolean;
    alive(): boolean;
    expired(): boolean;
    expirationTime(): number;
    setSubscription(subscription: SubscriptionData): this;
    subscription(): {
        id?: string;
        uri?: string;
        eventFilters?: string[];
        expirationTime?: string;
        expiresIn?: number;
        deliveryMode?: DeliveryMode;
        creationTime?: string;
        status?: string;
    };
    pubnub(): ActualPubNub;
    /**
     * Creates or updates subscription if there is an active one
     */
    register(): Promise<Response>;
    eventFilters(): string[];
    addEventFilters(eventFilters: string[]): this;
    /**
     * @param {string[]} eventFilters
     * @return {Subscription}
     */
    setEventFilters(eventFilters: any): this;
    subscribe(): Promise<Response>;
    renew(): Promise<Response>;
    remove(): Promise<Response>;
    resubscribe(): Promise<Response>;
    /**
     * Remove subscription and disconnect from PubNub
     * This method resets subscription at client side but backend is not notified
     */
    reset(): this;
    /**
     * @param subscription
     * @private
     */
    protected _setSubscription(subscription: SubscriptionData): this;
    /**
     * @return {string[]}
     * @private
     */
    _getFullEventFilters(): string[];
    private _automaticRenewHandler;
    /**
     * @return {Subscription}
     * @private
     */
    _setTimeout(): this;
    automaticRenewing(): Promise<void>;
    /**
     * @return {Subscription}
     * @private
     */
    _clearTimeout(): this;
    _decrypt(message: any): any;
    private _notify;
    private _subscribeAtPubNub;
    private _unsubscribeAtPubNub;
    resubscribeAtPubNub(): Promise<Response>;
}
export interface SubscriptionOptions {
    pollInterval?: number;
    renewHandicapMs?: number;
}
export interface SubscriptionOptionsConstructor extends SubscriptionOptions {
    sdk: SDK;
    PubNub: typeof ActualPubNub;
}
export interface DeliveryMode {
    transportType?: string;
    encryption?: string;
    address?: string;
    subscriberKey?: string;
    encryptionKey?: string;
    secretKey?: string;
}
export interface SubscriptionData {
    id?: string;
    uri?: string;
    eventFilters?: string[];
    expirationTime?: string;
    expiresIn?: number;
    deliveryMode?: DeliveryMode;
    creationTime?: string;
    status?: string;
}
export {};
