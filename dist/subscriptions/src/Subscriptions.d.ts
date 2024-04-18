/// <reference types="node" />
import { SDK } from '@ringcentral/sdk';
import EventEmitter from 'events';
import RingCentral from '@rc-ex/core';
import RcSdkExtension from '@rc-ex/rcsdk';
import WebSocketExtension from '@rc-ex/ws';
export declare class Subscription extends EventEmitter {
    private subscriptions;
    events: {
        notification: string;
    };
    eventFilters: string[];
    constructor(options: {
        subscriptions: Subscriptions;
    });
    setEventFilters(eventFilters: string[]): this;
    register(): Promise<import("@rc-ex/ws/lib/subscription").default>;
}
export declare class Subscriptions {
    private status;
    rc: RingCentral;
    rcSdkExtension: RcSdkExtension;
    constructor(options: {
        sdk: SDK;
    });
    init(): Promise<void>;
    newWsExtension(): Promise<WebSocketExtension>;
    createSubscription(): Subscription;
}
export default Subscriptions;
