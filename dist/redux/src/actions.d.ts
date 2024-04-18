import { SDK } from '@ringcentral/sdk';
export interface ActionsOptions {
    sdk: SDK;
}
export default class Actions {
    sdk: SDK;
    constructor({ sdk }: ActionsOptions);
    login: (query: any) => {
        type: string;
        payload: any;
        error: boolean;
    } | {
        type: string;
    };
    logout: () => {
        type: string;
    };
    loginSuccess: () => {
        type: string;
    };
    authError: (error: any) => {
        type: string;
        payload: any;
        error: boolean;
    };
    logoutSuccess: () => {
        type: string;
    };
}
