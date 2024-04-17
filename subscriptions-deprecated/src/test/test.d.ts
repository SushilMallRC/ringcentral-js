import { Subscriptions } from '../Subscriptions';
export declare const createSubscriptions: (sdk: any) => Subscriptions;
export declare function presenceLoad(id: any): void;
export declare function subscribeGeneric(expiresIn?: number, id?: any, remove?: boolean, timeZoneString?: any): void;
export declare function subscribeOnPresence(id?: string, detailed?: boolean): void;
