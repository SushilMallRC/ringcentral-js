import StoreConnector from './index';
interface LoginGateProps {
    storeConnector: StoreConnector;
    children: any;
}
declare const ConnectedAuthGate: import("react-redux").ConnectedComponentClass<({ loading, error, status, children }: {
    loading: any;
    error: any;
    status: any;
    children: any;
}) => any, import("react-redux").Omit<{
    loading: any;
    error: any;
    status: any;
    children: any;
}, "error" | "loading" | "status"> & LoginGateProps>;
export default ConnectedAuthGate;
