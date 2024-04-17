import React, { Component } from 'react';
export interface IndexState {
    user: any;
    error: any;
}
declare class Index extends Component<any, IndexState> {
    constructor(props: any);
    /**
     * Here we can make an authorized request since this page is opened only when user is authorized
     * This can be wrapped in Redux Action
     */
    componentDidMount(): Promise<void>;
    render(): React.JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof Index, import("react-redux").Omit<any, "logout">>;
export default _default;
