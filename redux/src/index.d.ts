import { Store } from 'redux';
import Actions, { ActionsOptions } from './actions';
export interface StoreConnectorOptions extends ActionsOptions {
    root?: string;
}
export default class StoreConnector {
    private sdk;
    private store;
    root: string;
    actions: Actions;
    constructor({ sdk, root }: StoreConnectorOptions);
    connectToStore: (store: Store) => Promise<void>;
    reducer: import("redux").Reducer<import("redux").CombinedState<{
        status: boolean;
        error: any;
        loading: boolean;
    }>, import("redux").AnyAction>;
    getAuth: (state: any) => any;
    getAuthStatus: (state: any) => any;
    getAuthError: (state: any) => any;
    getAuthLoading: (state: any) => any;
}
