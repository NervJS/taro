export = Taro;
export as namespace Taro;

declare namespace Taro {
  interface ComponentLifecycle<P, S> {
    componentWillMount?(): void;
    componentDidMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, prevContext: any): void;
    componentWillUnmount?(): void;
    componentDidShow?(): void;
    componentDidHide?(): void;
  }

  interface Component<P = {}, S = {}> extends ComponentLifecycle<P, S> { }

  class Component<P, S> {
    constructor(props?: P, context?: any);

    setState<K extends keyof S>(
        state: ((prevState: Readonly<S>, props: P) => (Pick<S, K> | S)) | (Pick<S, K> | S),
        callback?: () => any
    ): void;

    forceUpdate(callBack?: () => any): void;

    render(): any;

    props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
        [key: string]: any
    };
  }
}
