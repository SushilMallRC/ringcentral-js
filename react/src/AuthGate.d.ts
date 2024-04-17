import React, { Component } from 'react';
import { SDK } from '@ringcentral/sdk';
export interface AuthGateState {
    isAuthorized: boolean;
    authorizing: boolean;
    authError: null | Error;
}
export interface AuthGateRenderProps extends AuthGateState {
    loginUrl: (options: any) => string;
    parseRedirect: (search: string) => Promise<any>;
    logout: () => Promise<any>;
}
export interface AuthGateProps {
    sdk: SDK;
    ensure?: boolean;
    children: (props: AuthGateRenderProps) => any;
}
export declare class AuthGate extends Component<AuthGateProps, AuthGateState> {
    state: {
        isAuthorized: boolean;
        authorizing: boolean;
        authError: any;
    };
    static defaultProps: {
        ensure: boolean;
    };
    /**
     * purposely going through antipattern because we can't cancel promises for now
     * we still cancel subscriptions etc., but we can't guarantee when storage promises will resolve
     * @type {boolean}
     */
    mounted: boolean;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    before: () => void;
    error: (e: any) => Promise<void>;
    success: () => Promise<void>;
    loginUrl: (options: any) => string;
    logout: () => Promise<Response>;
    parseRedirect: (search: any) => Promise<Response>;
    updateState: (authError?: any) => Promise<void>;
    render(): any;
}
export declare const withAuthGate: ({ sdk, ensure }: {
    sdk: SDK;
    ensure?: boolean;
}) => (Cmp: any) => {
    (props: any): React.JSX.Element;
    displayName: string;
};
