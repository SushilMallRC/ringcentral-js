import React, { Component } from 'react';
export interface DashboardState {
    user?: any;
    error?: any;
}
export default class Dashboard extends Component<any, DashboardState> {
    state: {
        user: any;
        error: any;
    };
    componentWillMount(): Promise<void>;
    render(): React.JSX.Element;
}
