import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
export interface LoginProps extends RouteComponentProps {
    error: null | Error;
}
declare const _default: React.ComponentClass<Pick<import("react-redux").Omit<LoginProps, "error">, never> & {
    wrappedComponentRef?: React.Ref<React.Component<import("react-redux").Omit<LoginProps, "error">, any, any>>;
}, any> & import("react-router").WithRouterStatics<import("react-redux").ConnectedComponentClass<React.FunctionComponent<LoginProps>, import("react-redux").Omit<LoginProps, "error">>>;
export default _default;
