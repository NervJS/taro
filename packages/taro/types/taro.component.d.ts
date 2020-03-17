/// <reference types="react" />
/// <reference path="taro.lifecycle.d.ts" />
/// <reference path="taro.config.d.ts" />

declare namespace Taro {
  // Components
  interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS> {
    componentWillMount?(): void
    componentDidMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void
    componentWillUnmount?(): void
    componentWillPreload?(params: { [propName: string]: any }): any
    componentDidShow?(): void
    componentDidHide?(): void
    componentDidCatchError?(err: string): void
    componentDidNotFound?(obj: PageNotFoundObject): void
    onPullDownRefresh?(): void
    onReachBottom?(): void
    onPageScroll?(obj: PageScrollObject): void
    onShareAppMessage?(obj: ShareAppMessageObject): ShareAppMessageReturn
    onTabItemTap?(obj: TabItemTapObject): void
    onResize?(obj: any): void
  }

  interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
    $scope?: any
  }

  interface ComponentOptions {
    addGlobalClass?: boolean
  }

  interface FunctionComponent<P = {}> {
    (props: Readonly<P>): JSX.Element
    defaultProps?: Partial<P>
    config?: Config
    options?: ComponentOptions
  }

  type FC<P = {}> = FunctionComponent<P>

  interface StatelessFunctionComponent {
    (): JSX.Element
  }

  type SFC = StatelessFunctionComponent

  interface ComponentClass<P = {}, S = any> extends StaticLifecycle<P, S> {
    new (...args: any[]): Component<P, {}>
    propTypes?: any
    defaultProps?: Partial<P>
    displayName?: string
  }

  interface ComponentOptions {
    addGlobalClass?: boolean
  }

  interface RouterInfo {
    /**
     * 在跳转成功的目标页的生命周期方法里通过 `this.$router.params` 获取到传入的参数
     *
     * @example
     * componentWillMount () {
     *   console.log(this.$router.params)
     * }
     *
     * @see 参考[路由功能：路由传参](https://nervjs.github.io/taro/docs/router.html#%E8%B7%AF%E7%94%B1%E4%BC%A0%E5%8F%82)一节
    */
    params: {
      [key: string]: string
    } & {
      path?: string
      scene?: number | string
      query?: {[key: string]: string} | string
      shareTicket?: string
      referrerInfo?: {[key: string]: any} | string
    }
    /**
    * 可以于 `this.$router.preload` 中访问到 `this.$preload` 传入的参数
    *
    * **注意** 上一页面没有使用 `this.$preload` 传入任何参数时 `this.$router` 不存在 `preload` 字段
    * 请开发者在使用时自行判断
    *
    * @example
    * componentWillMount () {
    *   console.log('preload: ', this.$router.preload)
    * }
    *
    * @see 参考[性能优化实践：在小程序中，可以使用 `this.$preload` 函数进行页面跳转传参](https://nervjs.github.io/taro/docs/optimized-practice.html#%E5%9C%A8%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%B8%AD-%E5%8F%AF%E4%BB%A5%E4%BD%BF%E7%94%A8-this-preload-%E5%87%BD%E6%95%B0%E8%BF%9B%E8%A1%8C%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%E4%BC%A0%E5%8F%82)一节
    */
    preload?: {
      [key: string]: string
    }
  }

  class Component<P, S> {
    constructor(props?: P, context?: any)

    config?: Config

    options?: ComponentOptions

    $componentType: 'PAGE' | 'COMPONENT'

    $router: RouterInfo

    $preloadData: any

    /**
     * 使用 `this.$preload` 函数进行页面跳转传参
     * @example this.$preload('key', 'val');
     * @example this.$preload({
                  x: 1,
                  y: 2
                });
     * @see https://nervjs.github.io/taro/docs/best-practice.html
     */
    $preload(key: string, value: any): void
    $preload(key: object): void

    setState<K extends keyof S>(state: ((prevState: Readonly<S>, props: P) => Pick<S, K> | S) | (Pick<S, K> | S), callback?: () => any): void

    forceUpdate(callBack?: () => any): void

    render(): any

    props: Readonly<P> & Readonly<{ children?: any }>
    state: Readonly<S>
    context: any
    refs: {
      [key: string]: any
    }
  }

  class PureComponent<P = {}, S = {}> extends Component<P, S> {}

  function memo<P = {}>(
    FunctionComponent: FunctionComponent<P>,
    compare?: (oldProps: P, newProps: P) => Boolean
  ): FunctionComponent<P>
}
