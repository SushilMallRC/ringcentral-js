import StoreConnector from '@ringcentral/redux';
import SDK from '@ringcentral/sdk';
export declare const redirectPath = "/api/oauth2Callback";
export declare const redirectUri: string;
export declare const sdk: SDK;
export declare const storeConnector: StoreConnector;
export declare const createStore: () => import("redux").Store<import("redux").EmptyObject & {
    [x: string]: any;
}, import("redux").AnyAction> & {
    dispatch: unknown;
};
export declare const openLogin: (pathname: any) => void;
export declare const authenticated: any;
export declare const notAuthenticated: any;
