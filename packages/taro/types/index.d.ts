import { JSX } from 'babel-types'
export = Taro
export as namespace Taro

declare namespace Taro {
     // React Hooks
    // ----------------------------------------------------------------------

    // based on the code in https://github.com/facebook/react/pull/13968

    // Unlike the class component setState, the updates are not allowed to be partial
    type SetStateAction<S> = S | ((prevState: S) => S)
    // this technically does accept a second argument, but it's already under a deprecation warning
    // and it's not even released so probably better to not define it.
    type Dispatch<A> = (value: A) => void
    // Unlike redux, the actions _can_ be anything
    type Reducer<S, A> = (prevState: S, action: A) => S
    // types used to try and prevent the compiler from reducing S
    // to a supertype common with the second argument to useReducer()
    type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never
    type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never
    // The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
    // TODO (TypeScript 3.0): ReadonlyArray<unknown>
    type DependencyList = ReadonlyArray<any>

    // NOTE: callbacks are _only_ allowed to return either void, or a destructor.
    // The destructor is itself only allowed to return void.
    type EffectCallback = () => (void | (() => void | undefined))

    interface MutableRefObject<T> {
        current: T
    }

    /**
     * Returns a stateful value, and a function to update it.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usestate
     */
    function useState<S> (initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
    // convenience overload when first argument is ommitted
    /**
     * Returns a stateful value, and a function to update it.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usestate
     */
    function useState<S = undefined> (): [S | undefined, Dispatch<SetStateAction<S | undefined>>]
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */
    // overload where "I" may be a subset of ReducerState<R>; used to provide autocompletion.
    // If "I" matches ReducerState<R> exactly then the last overload will allow initializer to be ommitted.
    // the last overload effectively behaves as if the identity function (x => x) is the initializer.
    function useReducer<R extends Reducer<any, any>, I> (
        reducer: R,
        initializerArg: I & ReducerState<R>,
        initializer: (arg: I & ReducerState<R>) => ReducerState<R>
    ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */
    // overload for free "I"; all goes as long as initializer converts it into "ReducerState<R>".
    function useReducer<R extends Reducer<any, any>, I> (
        reducer: R,
        initializerArg: I,
        initializer: (arg: I) => ReducerState<R>
    ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */

    // I'm not sure if I keep this 2-ary or if I make it (2,3)-ary; it's currently (2,3)-ary.
    // The Flow types do have an overload for 3-ary invocation with undefined initializer.

    // NOTE: without the ReducerState indirection, TypeScript would reduce S to be the most common
    // supertype between the reducer's return type and the initialState (or the initializer's return type),
    // which would prevent autocompletion from ever working.

    // TODO: double-check if this weird overload logic is necessary. It is possible it's either a bug
    // in older versions, or a regression in newer versions of the typescript completion service.
    function useReducer<R extends Reducer<any, any>> (
        reducer: R,
        initialState: ReducerState<R>,
        initializer?: undefined
    ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useref
     */
    // TODO (TypeScript 3.0): <T extends unknown>
    function useRef<T> (initialValue: T): MutableRefObject<T>

    interface RefObject<T> {
        readonly current: T | null
    }

    function createRef<T>(): RefObject<T>;

    // convenience overload for refs given as a ref prop as they typically start with a null value
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
     * of the generic argument.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useref
     */
    // TODO (TypeScript 3.0): <T extends unknown>
    function useRef<T> (initialValue: T | null): RefObject<T>
    // convenience overload for potentially undefined initialValue / call with 0 arguments
    // has a default to stop it from defaulting to {} instead
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useref
     */
    // TODO (TypeScript 3.0): <T extends unknown>
    function useRef<T = undefined> (): MutableRefObject<T | undefined>
    /**
     * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
     * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
     * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
     *
     * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
     *
     * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
     * `componentDidMount` and `componentDidUpdate`.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
     */
    function useLayoutEffect (effect: EffectCallback, deps?: DependencyList): void
    /**
     * Accepts a function that contains imperative, possibly effectful code.
     *
     * @param effect Imperative function that can return a cleanup function
     * @param deps If present, effect will only activate if the values in the list change.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useeffect
     */
    function useEffect (effect: EffectCallback, deps?: DependencyList): void
    // NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
    /**
     * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
     * `ref`. As always, imperative code using refs should be avoided in most cases.
     *
     * `useImperativeHandle` should be used with `React.forwardRef`.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
     */
    type Ref<T> =
      | string
      | { bivarianceHack (instance: T | null): any }['bivarianceHack']
    function useImperativeHandle<T, R extends T> (ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void
    // I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
    // useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
    /**
     * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
     * has changed.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usecallback
     */
    // TODO (TypeScript 3.0): <T extends (...args: never[]) => unknown>
    function useCallback<T extends (...args: any[]) => any> (callback: T, deps: DependencyList): T
    /**
     * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
     *
     * Usage note: if calling `useMemo` with a referentially stable function, also give it as the input in
     * the second argument.
     *
   ```ts
   function expensive () { ... }

   function Component () {
     const expensiveResult = useMemo(expensive, [expensive])
     return ...
   }
   ```
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usememo
     */
    // allow undefined, but don't make it optional as that is very likely a mistake
    function useMemo<T> (factory: () => T, deps: DependencyList | undefined): T
  interface PageNotFoundObject {
    /**
     * 不存在页面的路径
     */
    path: string

    /**
     * 打开不存在页面的 query
     */
    query: object

    /**
     * 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面）
     */
    isEntryPage: boolean
  }

  interface PageScrollObject {
    /**
     * 页面在垂直方向已滚动的距离（单位px）
     */
    scrollTop: number
  }

  interface ShareAppMessageObject {
    /**
     * 转发事件来源
     */
    from?: string
    /**
     * 如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
     */
    target?: object
    /**
     * 页面中包含<web-view>组件时，返回当前<web-view>的url
     */
    webViewUrl?: string
  }

  interface ShareAppMessageReturn {
    /**
     * 	转发标题，默认为当前小程序名称
     */
    title?: string

    /**
     * 转发路径，必须是以 / 开头的完整路径，默认为当前页面 path
     */
    path?: string

    /**
     * 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径
     * 支持PNG及JPG
     * 显示图片长宽比是 5:4
     */
    imageUrl?: string
  }

  interface TabItemTapObject {
    /**
     * 被点击tabItem的序号，从0开始
     */
    index: string

    /**
     * 被点击tabItem的页面路径
     */
    pagePath: string

    /**
     * 被点击tabItem的按钮文字
     */
    text: string
  }

  type GetDerivedStateFromProps<P, S> =
  /**
   * Returns an update to a component's state based on its new props and old state.
   *
   * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
   */
  (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;

  interface StaticLifecycle<P, S> {
    getDerivedStateFromProps?: GetDerivedStateFromProps<P, S>;
  }

  interface NewLifecycle<P, S, SS> {
    /**
     * Runs before React applies the result of `render` to the document, and
     * returns an object to be given to componentDidUpdate. Useful for saving
     * things such as scroll position before `render` causes changes to it.
     *
     * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
     * lifecycle events from running.
     */
    getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;
    /**
     * Called immediately after updating occurs. Not called for the initial render.
     *
     * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
     */
    componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
}

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
    onResize?(): void
  }

  interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
    $scope?: any
  }

  interface FunctionComponent<P = {}> {
    (props: Readonly<P>): JSX.Element
  }

  interface ComponentClass<P = {}, S = any> extends StaticLifecycle<P, S> {
    new (...args: any[]): Component<P, {}>
    propTypes?: any
    defaultProps?: Partial<P>
    displayName?: string
  }

  // NOTE: only the Context object itself can get a displayName
  // https://github.com/facebook/react-devtools/blob/e0b854e4c/backend/attachRendererFiber.js#L310-L325
  // type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
  // type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
  interface Context<T> {
      Provider: ComponentClass<{ value: T }>;
      // Consumer: Consumer<T>;
      displayName?: string;
  }
  function createContext<T>(
      defaultValue: T
  ): Context<T>;


  // This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
  /**
   * Accepts a context object (the value returned from `React.createContext`) and returns the current
   * context value, as given by the nearest context provider for the given context.
   *
   * @version 16.8.0
   * @see https://reactjs.org/docs/hooks-reference.html#usecontext
   */
  function useContext<T>(context: Context<T>/*, (not public API) observedBits?: number|boolean */): T;


  /**
   * 微信小程序全局 Window 配置和页面配置的公共项目
   */
  interface CommonPageConfig {
    /**
     * 导航栏背景颜色，HexColor
     * default: #000000
     */
    navigationBarBackgroundColor?: string
    /**
     * 导航栏标题颜色，仅支持 black/white
     * default: 'white'
     */
    navigationBarTextStyle?: 'white' | 'black'
    /**
     * 导航栏标题文字内容
     */
    navigationBarTitleText?: string
    /**
     * 导航栏样式，仅支持以下值：
     * default 默认样式
     * custom 自定义导航栏
     */
    navigationStyle?: 'default' | 'custom'
    /**
     * 窗口的背景色， HexColor
     * default: #ffffff
     */
    backgroundColor?: string
    /**
     * 下拉背景字体、loading 图的样式，仅支持 dark/light
     * default: 'dark'
     */
    backgroundTextStyle?: 'dark' | 'light'
    /**
     * 顶部窗口的背景色，仅 iOS 支持
     * default: #ffffff
     */
    backgroundColorTop?: string
    /**
     * 底部窗口的背景色，仅 iOS 支持
     * default: #ffffff
     */
    backgroundColorBottom?: string
    /**
     * 是否开启下拉刷新
     * default: false
     */
    enablePullDownRefresh?: boolean
    /**
     * 页面上拉触底事件触发时距页面底部距离，单位为px
     * default: 50
     */
    onReachBottomDistance?: number
  }

  interface PageConfig extends CommonPageConfig {
    /**
     * 设置为 true 则页面整体不能上下滚动；
     * 只在页面配置中有效，无法在 app.json 中设置该项
     * default: false
     */
    disableScroll?: boolean
    /**
     * 禁止页面右滑手势返回
     * default: false
     * @since 微信客户端 7.0.0
     *
     * **注意** 自微信客户端 7.0.5 开始，页面配置中的 disableSwipeBack 属性将不再生效，
     * 详情见[右滑手势返回能力调整](https://developers.weixin.qq.com/community/develop/doc/000868190489286620a8b27f156c01)公告
     */
    disableSwipeBack?: boolean
  }

  interface WindowConfig extends CommonPageConfig {
    /**
     * 屏幕旋转设置
     * 支持 auto / portrait / landscape
     * default: portrait
     * 详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html)
     */
    pageOrientation?: 'auto' | 'portrait' | 'landscape'
  }

  interface TarbarList {
    /**
     * 页面路径，必须在 pages 中先定义
     */
    pagePath: string
    /**
     * tab 上按钮文字
     */
    text: string
    /**
     * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
     */
    iconPath?: string
    /**
     * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
     */
    selectedIconPath?: string
  }

  interface TabBar {
    /**
     * tab 上的文字默认颜色
     */
    color?: string
    /**
     * tab 上的文字选中时的颜色
     */
    selectedColor?: string
    /**
     * tab 的背景色
     */
    backgroundColor?: string
    /**
     * tabbar上边框的颜色， 仅支持 black/white
     * @default: black
     */
    borderStyle?: 'black' | 'white'
    /**
     * tabar 的位置，可选值 bottom、top
     * @default: 'bottom'
     */
    position?: 'bottom' | 'top'
    /**
     * 自定义 tabBar，见[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)
     * @default false
     * @since 2.1.0
     */
    custom?: boolean

    list: TarbarList[]
  }

  interface NetworkTimeout {
    /**
     * wx.request 的超时时间，单位毫秒。
     * @default 60000
     */
    request?: number
    /**
     * wx.connectSocket 的超时时间，单位毫秒。
     * @default 60000
     */
    connectSocket?: number
    /**
     * wx.uploadFile 的超时时间，单位毫秒。
     * @default 60000
     */
    uploadFile?: number
    /**
     * wx.downloadFile 的超时时间，单位毫秒。
     * @default 60000
     */
    downloadFile?: number
  }

  interface SubPackage {
    /**
     * 分包根路径
     * - 注意：不能放在主包pages目录下
     */
    root: string
    /**
     * 分包路径下的所有页面配置
     */
    pages: string[]
    /**
     * 分包别名，分包预下载时可以使用
     */
    name?: string
    /**
     * 分包是否是独立分包
     */
    independent?: boolean
  }

  interface Plugins {
    [key: string]: {
      version: string
      provider: string
    }
  }

  interface PreloadRule {
    [key: string]: {
      /**
       *进入页面后预下载分包的 root 或 name。__APP__ 表示主包。
       */
      packages: string[]
      /**
       * 在指定网络下预下载，可选值为：
       * all: 不限网络
       * wifi: 仅wifi下预下载
       * @default wifi
       */
      network?: 'all' | 'wifi'
    }
  }

  interface Permission {
    [key: string]: {
      /**
       * 小程序获取权限时展示的接口用途说明。最长30个字符
       */
      desc: string
    }
  }
  interface AppConfig {
    /**
     * 接受一个数组，每一项都是字符串，来指定小程序由哪些页面组成，数组的第一项代表小程序的初始页面
     */
    pages?: string[]
    tabBar?: TabBar
    /**
     * 各类网络请求的超时时间，单位均为毫秒。
     */
    networkTimeout?: NetworkTimeout
    /**
     * 是否开启 debug 模式，默认关闭
     * @default false
     */
    debug?: boolean
    /**
     * 启用插件功能页时，插件所有者小程序需要设置其 functionalPages 为 true。
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html
     * @default false
     * @since 2.1.0
     */
    functionalPages?: boolean
    /**
     * 分包加载配置
     * 示例:
     * [
     *   {
     *     root: 'packages/module',
     *     pages: [
     *       'pages/page/index'
     *     ]
     *   }
     * ]
     * @since 1.7.3
     */
    subPackages?: SubPackage[]
    /**
     * Worker 代码放置的目录
     * 使用 Worker 处理多线程任务时，设置 Worker 代码放置的目录
     * @since 1.9.90
     */
    workers?: string
    /**
     * 申明需要后台运行的能力，类型为数组。目前支持以下项目：
     * @since 微信客户端 6.7.2 及以上版本支持
     */
    requiredBackgroundModes?: ['audio']
    /**
     * 使用到的插件
     * @since 1.9.6
     */
    plugins?: Plugins
    /**
     * 声明分包预下载的规则。
     * preloadRule 中，key 是页面路径，value 是进入此页面的预下载配置
     * 注意: 分包预下载目前只支持通过配置方式使用，暂不支持通过调用API完成。
     *      vConsole 里有preloadSubpackages开头的日志信息，可以用来验证预下载的情况。
     * @since 2.3.0
     */
    preloadRule?: PreloadRule
    /**
     * iPad 小程序是否支持屏幕旋转
     * @default false
     * @since 2.3.0
     */
    resizable?: boolean
    /**
     * 需要跳转的小程序列表
     * @since 2.4.0
     */
    navigateToMiniProgramAppIdList?: string[]
    /**
     * 小程序接口权限相关设置
     * @since 微信客户端 7.0.0
     */
    permission?: Permission
  }

  interface Config extends PageConfig, AppConfig {
    usingComponents?: {
      [key: string]: string
    }
    window?: WindowConfig
    cloud?: boolean
  }

  interface ComponentOptions {
    addGlobalClass?: boolean
  }

  class Component<P, S> {
    constructor(props?: P, context?: any)

    config?: Config

    options?: ComponentOptions

    $componentType: 'PAGE' | 'COMPONENT'

    $router: {
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

  // Events
  class Events {
    /**
     * 监听一个事件，接受参数
     */
    on(eventName: string | symbol, listener: (...args: any[]) => void): this

    /**
     * 添加一个事件监听，并在事件触发完成之后移除Callbacks链
     */
    once(eventName: string | symbol, listener: (...args: any[]) => void): this

    /**
     * 取消监听一个事件
     */
    off(eventName: string | symbol, listener?: (...args: any[]) => void): this

    /**
     * 取消监听的所有事件
     */
    off(): this

    /**
     * 触发一个事件，传参
     */
    trigger(eventName: string | symbol, ...args: any[]): boolean
  }

  // eventCenter

  namespace eventCenter {
    function on(eventName: string | symbol, listener: (...args: any[]) => void): void

    function once(eventName: string | symbol, listener: (...args: any[]) => void): void

    function off(eventName: string | symbol, listener?: (...args: any[]) => void): void

    function off(): void

    function trigger(eventName: string | symbol, ...args: any[]): boolean
  }

  // ENV_TYPE

  enum ENV_TYPE {
    WEAPP = 'WEAPP',
    WEB = 'WEB',
    RN = 'RN',
    SWAN = 'SWAN',
    ALIPAY = 'ALIPAY',
    TT = 'TT'
  }

  function getEnv(): ENV_TYPE.WEAPP | ENV_TYPE.WEB | ENV_TYPE.RN | ENV_TYPE.ALIPAY | ENV_TYPE.TT | ENV_TYPE.SWAN

  function render(component: Component | JSX.Element, element: Element | null): any

  function internal_safe_set(...arg: any[]): any
  function internal_safe_get(...arg: any[]): any

  type MessageType = 'info' | 'success' | 'error' | 'warning'

  interface AtMessageOptions {
    message: string
    type?: MessageType
    duration?: number
  }

  function atMessage(options: AtMessageOptions): void

  function pxTransform(size: number): string
  function initPxTransform(config: { designWidth: number; deviceRatio: object })

  interface RequestParams extends request.Param<any> {
    [propName: string]: any
  }

  type interceptor = (chain: Chain) => any

  interface Chain {
    index: number
    requestParams: RequestParams
    interceptors: interceptor[]
    proceed(requestParams: RequestParams): any
  }

  namespace interceptors {
    function logInterceptor(chain: Chain): Promise<any>

    function timeoutInterceptor(chain: Chain): Promise<any>
  }

  function addInterceptor(interceptor: interceptor): any

  /**
   * 小程序引用插件 JS 接口
   */
  function requirePlugin(pluginName: string): any

  /**
   *
   * 微信端能力
   * original code from: https://github.com/wx-minapp/minapp-wx/blob/master/typing/wx.d.ts
   * Lincenced under MIT license: https://github.com/qiu8310/minapp/issues/69
   * thanks for the great work by @qiu8310 👍👍👍
   *
   */

  namespace request {
    type Promised < T extends any | string | ArrayBuffer = any > = {
      /**
       * 开发者服务器返回的数据
       *
       * **data 数据说明：**
       *
       * 最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String 。转换规则如下：
       *
       * *   对于 `GET` 方法的数据，会将数据转换成 query string（encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
       * *   对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会对数据进行 JSON 序列化
       * *   对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
       */
      data: T
      /**
       * 开发者服务器返回的 HTTP 状态码
       */
      statusCode: number
      /**
       * 开发者服务器返回的 HTTP Response Header
       *
       * @since 1.2.0
       */
      header: any
    }
    /**
     * 网络请求任务对象
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.html
     */
    interface requestTask<T> extends Promise<request.Promised<T>> {
      /**
       * 中断请求任务
       * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/RequestTask.abort.html
       */
      abort(): void
    }
    type Param < P extends any | string | ArrayBuffer = any > = {
      /**
       * 开发者服务器接口地址
       */
      url: string
      /**
       * 请求的参数
       */
      data?: P
      /**
       * 设置请求的 header，header 中不能设置 Referer。
       */
      header?: any
      /**
       * （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       *
       * @default GET
       */
      method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
      /**
       * 如果设为 json，会尝试对返回的数据做一次 JSON.parse
       *
       * @default json
       */
      dataType?: string
      /**
       * 设置响应的数据类型。合法值：text、arraybuffer
       *
       * @default text
       * @since 1.7.0
       */
      responseType?: string
      /**
       * 设置 H5 端是否使用jsonp方式获取数据
       *
       * @default false
       */
      jsonp?: boolean
      /**
       * 设置 H5 端 jsonp 请求 url 是否需要被缓存
       *
       * @default false
       */
      jsonpCache?: boolean
      /**
       * 设置 H5 端是否允许跨域请求。有效值：no-cors, cors, same-origin
       *
       * @default same-origin
       */
      mode?: 'no-cors' | 'cors' | 'same-origin'
      /**
       * 设置 H5 端是否携带 Cookie。有效值：include, same-origin, omit
       *
       * @default omit
       */
      credentials?: 'include' | 'same-origin' | 'omit'
      /**
       * 设置 H5 端缓存模式。有效值：default, no-cache, reload, force-cache, only-if-cached
       *
       * @default default
       */
      cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached'
      /**
       * 设置 H5 端请求响应超时时间
       *
       * @default 2000
       */
      timeout?: number
      /**
       * 设置 H5 端请求重试次数
       *
       * @default 2
       */
      retryTimes?: number
      /**
       * 设置 H5 端请求的兜底接口
       */
      backup?: string | string[]
      /**
       * 设置 H5 端请求响应的数据校验函数，若返回 false，则请求兜底接口，若无兜底接口，则报请求失败
       */
      dataCheck?(): boolean
      /**
       * 设置 H5 端请求是否使用缓存
       *
       * @default false
       */
      useStore?: boolean
      /**
       * 设置 H5 端请求缓存校验的 key
       */
      storeCheckKey?: string
      /**
       * 设置 H5 端请求缓存签名
       */
      storeSign?: string
      /**
       * 设置 H5 端请求校验函数，一般不需要设置
       */
      storeCheck?(): boolean
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 发起网络请求。**使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)**。
   *
   * **返回值：**
   * 
   * @returns {request.requestTask} 返回一个 `requestTask` 对象，通过 `requestTask`，可中断请求任务。
   *
   * @since 1.4.0
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: content-type 默认为 'application/json';
   * 2.  `tip`: url 中不能有端口；
   * 3.  `bug`: 开发者工具 `0.10.102800` 版本，`header` 的 `content-type` 设置异常；
   *
   * **示例代码：**
   * 
   * @example
   * // 回调函数(Callback)用法：
   * const requestTask = Taro.request({
   *   url: 'test.php', //仅为示例，并非真实的接口地址
   *   data: {
   *     x: '' ,
   *     y: ''
   *   },
   *   header: {
   *     'content-type': 'application/json' // 默认值
   *   },
   *   success: function(res) {
   *     console.log(res.data)
   *   }
   * })
   * requestTask.abort()
   * 
   * // Promise 用法：
   * const requestTask = Taro.request({
   *   url: 'test.php', //仅为示例，并非真实的接口地址
   *   data: {
   *     x: '' ,
   *     y: ''
   *   },
   *   header: {
   *     'content-type': 'application/json' // 默认值
   *   },
   *   success: function(res) {
   *     console.log(res.data)
   *   }
   * })
   * requestTask.then(res => {
   *   console.log(res.data)
   * })
   * requestTask.abort()
   * 
   * // async/await 用法：
   * const requestTask = Taro.request(params)
   * const res = await requestTask
   * requestTask.abort()
   * 
   * // 不需要 abort 的 async/await 用法：
   * const res = await Taro.request(params)
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
   */
  function request<T = any, U = any>(OBJECT: request.Param<U>): request.requestTask<T>

  type arrayBuffer = Uint8Array | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | ArrayBuffer

  /**
   * 将 ArrayBuffer 数据转成 Base64 字符串
   */
  function arrayBufferToBase64(buffer: arrayBuffer): string

  /**
   * 将 Base64 字符串转成 ArrayBuffer 数据
   */
  function base64ToArrayBuffer(base64: string): arrayBuffer

  namespace uploadFile {
    type Promised = {
      /**
       * 开发者服务器返回的数据
       */
      data: string
      /**
       * 开发者服务器返回的 HTTP 状态码
       */
      statusCode: number
    }
    /**
     * 上传进度
     */
    type UploadTaskProgress = {
      progress: number
      totalBytesSent: number
      totalBytesExpectedToSend: number
    }
    /**
     * 上传进度回调
     */
    type UploadTaskProgressCallback = (res: UploadTaskProgress) => any
    /**
     * 上传任务
     */
    type UploadTask = Promise<uploadFile.Promised> & {
      /**
       * 上传进度回调
       */
      progress: (callback: UploadTaskProgressCallback) => void
      /**
       * 终止上传任务
       */
      abort: () => void
    }
    type Param = {
      /**
       * 开发者服务器 url
       */
      url: string
      /**
       * 要上传文件资源的路径
       */
      filePath: string
      /**
       * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
       */
      name: string
      /**
       * HTTP 请求 Header, header 中不能设置 Referer
       */
      header?: any
      /**
       * HTTP 请求中其他额外的 form data
       */
      formData?: any
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 `content-type` 为 `multipart/form-data` 。
   * **使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)**。
   *
   * 如页面通过 [Taro.chooseImage](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html)
   * 等接口获取到一个本地资源的临时文件路径后，可通过此接口将本地资源上传到指定服务器。
   *
   * **返回值：**
   *
   * @since 1.4.0
   *
   * 返回一个 `uploadTask` 对象，通过 `uploadTask`，可监听上传进度变化事件，以及取消上传任务。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseImage({
     success: function(res) {
       var tempFilePaths = res.tempFilePaths
       Taro.uploadFile({
         url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
         filePath: tempFilePaths[0],
         name: 'file',
         formData:{
           'user': 'test'
         },
         success: function(res){
           var data = res.data
           //do something
         }
       })
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   const uploadTask = Taro.uploadFile({
       url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
       filePath: tempFilePaths[0],
       name: 'file',
       formData:{
           'user': 'test'
       },
       success: function(res){
           var data = res.data
           //do something
       }
   })
         uploadTask.progress((res) => {
       console.log('上传进度', res.progress)
       console.log('已经上传的数据长度', res.totalBytesSent)
       console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
   })
         uploadTask.abort() // 取消上传任务
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/upload/wx.uploadFile.html
   */
  function uploadFile(OBJECT: uploadFile.Param): uploadFile.UploadTask

  namespace downloadFile {
    type Promised = {
      /**
       * 临时文件路径，下载后的文件会存储到一个临时文件
       */
      tempFilePath: string
      /**
       * 开发者服务器返回的 HTTP 状态码
       */
      statusCode: number
    }
    type Param = {
      /**
       * 下载资源的 url
       */
      url: string
      /**
       * HTTP 请求 Header，header 中不能设置 Referer
       */
      header?: any
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
    /**
     * 下载进度
     */
    type DownloadTaskProgress = {
      progress: number
      totalBytesWritten: number
      totalBytesExpectedToWrite: number
    }
    /**
     * 下载进度回调
     */
    type DownloadTaskProgressCallback = (res: DownloadTaskProgress) => any
    /**
     * 下载任务
     */
    type DownloadTask = Promise<downloadFile.Promised> & {
      /**
       * 下载进度回调
       */
      progress: (params: DownloadTaskProgressCallback) => void
      /**
       * 终止下载任务
       */
      abort: () => void
    }
  }
  /**
   * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
   * **使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)**。
   *
   * **返回值：**
   *
   * @since 1.4.0
   *
   * 返回一个 `downloadTask` 对象，通过 `downloadTask`，可监听下载进度变化事件，以及取消下载任务。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 6.5.3 以及之前版本的 iOS 微信客户端 `header` 设置无效
   *
   * **示例代码：**
   *
   ```javascript
   Taro.downloadFile({
     url: 'https://example.com/audio/123', //仅为示例，并非真实的资源
     success: function(res) {
       // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
       if (res.statusCode === 200) {
           Taro.playVoice({
             filePath: res.tempFilePath
           })
       }
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   const downloadTask = Taro.downloadFile({
       url: 'http://example.com/audio/123', //仅为示例，并非真实的资源
       success: function(res) {
           Taro.playVoice({
               filePath: res.tempFilePath
           })
       }
   })
         downloadTask.progress((res) => {
       console.log('下载进度', res.progress)
       console.log('已经下载的数据长度', res.totalBytesWritten)
       console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
   })
         downloadTask.abort() // 取消下载任务
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/download/wx.downloadFile.html
   */
  function downloadFile(OBJECT: downloadFile.Param): downloadFile.DownloadTask

  namespace connectSocket {
    type Promised = SocketTask

    type Param = {
      /**
       * 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
       */
      url: string
      /**
       * HTTP Header , header 中不能设置 Referer
       */
      header?: any
      /**
       * 默认是GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       */
      method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
      /**
       * 子协议数组
       *
       * @since 1.4.0
       */
      protocols?: string[]
    }
  }
  /**
   * 创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 连接。
   * **使用前请先阅读[说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)**。
   *
   * **基础库 1.7.0 之前，一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。基础库版本 1.7.0 及以后，支持存在多个 WebSokcet 连接，每次成功调用 Taro.connectSocket 会返回一个新的 [SocketTask](https://developers.weixin.qq.com/minigame/dev/api/network/websocket/SocketTask.html)。**
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'wss://example.qq.com',
     data:{
       x: '',
       y: ''
     },
     header:{
       'content-type': 'application/json'
     },
     protocols: ['protocol1'],
     method:"GET"
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html
   */
  function connectSocket(OBJECT: connectSocket.Param): Promise<connectSocket.Promised>

  namespace onSocketOpen {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 连接成功的 HTTP 响应 Header
       *
       * @since 2.0.0
       */
      header?: any
    }
  }
  /**
   * 监听WebSocket连接打开事件。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
   Taro.onSocketOpen(function(res) {
     console.log('WebSocket连接已打开！')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketOpen.html
   */
  function onSocketOpen(callback?: onSocketOpen.Param): void

  /**
   * 监听WebSocket错误。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
   Taro.onSocketOpen(function(res){
     console.log('WebSocket连接已打开！')
   })
   Taro.onSocketError(function(res){
     console.log('WebSocket连接打开失败，请检查！')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketError.html
   */
  function onSocketError(CALLBACK: any): void

  namespace sendSocketMessage {
    type Param = {
      /**
       * 需要发送的内容
       */
      data: string | ArrayBuffer
    }
  }
  /**
   * 通过 WebSocket 连接发送数据，需要先 [Taro.connectSocket](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html) 回调之后才能发送。
   *
   * **示例代码：**
   *
   ```javascript
   var socketOpen = false
   var socketMsgQueue = []
   Taro.connectSocket({
     url: 'test.php'
   })
         Taro.onSocketOpen(function(res) {
     socketOpen = true
     for (var i = 0; i < socketMsgQueue.length; i++){
        sendSocketMessage(socketMsgQueue[i])
     }
     socketMsgQueue = []
   })
         function sendSocketMessage(msg) {
     if (socketOpen) {
       Taro.sendSocketMessage({
         data:msg
       })
     } else {
        socketMsgQueue.push(msg)
     }
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.sendSocketMessage.html
   */
  function sendSocketMessage(OBJECT: sendSocketMessage.Param): Promise<any>

  namespace onSocketMessage {
    type Param < T = any > = (res: ParamParam<T>) => any
    type ParamParam < T extends any | string | ArrayBuffer = any > = {
      /**
       * 服务器返回的消息
       */
      data: T
    }
  }
  /**
   * 监听WebSocket接受到服务器的消息事件。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
         Taro.onSocketMessage(function(res) {
     console.log('收到服务器内容：' + res.data)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketMessage.html
   */
  function onSocketMessage<T = any>(CALLBACK?: onSocketMessage.Param<T>): void

  namespace closeSocket {
    type Param = {
      /**
       * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
       *
       * @since 1.4.0
       */
      code?: number
      /**
       * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
       *
       * @since 1.4.0
       */
      reason?: string
    }
  }
  /**
   * 关闭 WebSocket 连接。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.closeSocket.html
   */
  function closeSocket(OBJECT?: closeSocket.Param): Promise<any>

  /**
   * 监听WebSocket关闭。
   *
   * **返回值：**
   *
   * @since 1.7.0
   *
   * 返回一个 [SocketTask](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html)。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 基础库 1.7.0 开始，支持同时存在 2 条 WebSocket 连接
   *
   * **示例：**
   *
   ```javascript
   Taro.connectSocket({
     url: 'test.php'
   })
         //注意这里有时序问题，
   //如果 Taro.connectSocket 还没回调 Taro.onSocketOpen，而先调用 Taro.closeSocket，那么就做不到关闭 WebSocket 的目的。
   //必须在 WebSocket 打开期间调用 Taro.closeSocket 才能关闭。
   Taro.onSocketOpen(function() {
     Taro.closeSocket()
   })
         Taro.onSocketClose(function(res) {
     console.log('WebSocket 已关闭！')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.onSocketClose.html
   */
  function onSocketClose(CALLBACK?: (res: any) => any): void

  namespace SocketTask {
    namespace send {
      type Param = {
        /**
         * 需要发送的内容
         */
        data: string | ArrayBuffer
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace close {
      type Param = {
        /**
         * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
         */
        code?: number
        /**
         * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
         */
        reason?: string
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace onError {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 错误信息
         */
        errMsg: string
      }
    }
    namespace onMessage {
      type Param < T = any > = (res: ParamParam<T>) => any
      type ParamParam < T extends any | string | ArrayBuffer = any > = {
        /**
         * 服务器返回的消息
         */
        data: T
      }
    }
  }
  /**
   * @since 1.7.0
   *
   * WebSocket 任务，可通过 [Taro.connectSocket()](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/SocketTask.html) 接口创建返回。
   */
  class SocketTask {
    /**
     * websocket 当前的连接状态。
     */
    readonly readyState: boolean

    /**
     * websocket 状态值：连接中。
     */
    readonly CONNECTING: boolean

    /**
     * websocket 状态值：已连接。
     */
    readonly OPEN: boolean

    /**
     * websocket 状态值：关闭中。
     */
    readonly CLOSING: boolean

    /**
     * websocket 状态值：已关闭。
     */
    readonly CLOSED: boolean

    /**
     * 浏览器 websocket 实例。（h5 端独有）
     */
    readonly ws: WebSocket

    /**
     *
     * **SocketTask.send(OBJECT)：**
     *
     * 通过 WebSocket 连接发送数据。
     */
    send(OBJECT: SocketTask.send.Param): void
    /**
     *
     * **SocketTask.close(OBJECT)：**
     *
     * 关闭 WebSocket 连接。
     */
    close(OBJECT: SocketTask.close.Param): void
    /**
     *
     * **SocketTask.onOpen(CALLBACK)：**
     *
     * 监听 WebSocket 连接打开事件。
     */
    onOpen(CALLBACK?: any): void
    /**
     *
     * **SocketTask.onClose(CALLBACK)：**
     *
     * 监听 WebSocket 连接关闭事件。
     */
    onClose(CALLBACK?: any): void
    /**
     *
     * **SocketTask.onError(CALLBACK)：**
     *
     * 监听 WebSocket 错误。
     */
    onError(CALLBACK?: SocketTask.onError.Param): void
    /**
     *
     * **SocketTask.onMessage(CALLBACK)：**
     *
     * 监听WebSocket接受到服务器的消息事件。
     */
    onMessage<T = any>(CALLBACK: SocketTask.onMessage.Param<T>): void
  }
  namespace chooseImage {
    type Promised = {
      /**
       * 图片的本地文件路径列表
       */
      tempFilePaths: string[]
      /**
       * 图片的本地文件列表，每一项是一个 File 对象
       *
       * @since 1.2.0
       */
      tempFiles: PromisedPropTempFiles
    }
    /**
     * 图片的本地文件列表，每一项是一个 File 对象
     */
    type PromisedPropTempFiles = PromisedPropTempFilesItem[]
    type PromisedPropTempFilesItem = {
      /**
       * 本地文件路径
       */
      path: string
      /**
       * 本地文件大小，单位：B
       */
      size: number
    }
    type ParamPropTempFiles = ParamPropTempFilesItem[]
    type ParamPropTempFilesItem = {
      path: string
      size: number
    }
    type ParamPropSuccess = (res: { tempFilePaths: string[]; tempFiles: ParamPropTempFiles }) => void
    type ParamPropFail = (err: any) => void
    type ParamPropComplete = () => any
    type Param = {
      /**
       * 最多可以选择的图片张数，默认9
       */
      count?: number
      /**
       * original 原图，compressed 压缩图，默认二者都有
       */
      sizeType?: string[]
      /**
       * album 从相册选图，camera 使用相机，默认二者都有
       */
      sourceType?: string[]
      /**
       * success 回调
       */
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
  }
  /**
   * 从本地相册选择图片或使用相机拍照。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseImage({
     count: 1, // 默认9
     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
     success: function (res) {
       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       var tempFilePaths = res.tempFilePaths
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
   */
  function chooseImage(OBJECT?: chooseImage.Param): Promise<chooseImage.Promised>

  namespace previewImage {
    type Param = {
      /**
       * 当前显示图片的链接，不填则默认为 urls 的第一张
       */
      current?: string
      /**
       * 需要预览的图片链接列表
       */
      urls: string[]
    }
  }
  /**
   * 预览图片。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.previewImage({
     current: '', // 当前显示图片的http链接
     urls: [] // 需要预览的图片http链接列表
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewImage.html
   */
  function previewImage(OBJECT: previewImage.Param): Promise<any>

  namespace getImageInfo {
    type Promised = {
      /**
       * 图片宽度，单位px
       */
      width: number
      /**
       * 图片高度，单位px
       */
      height: number
      /**
       * 返回图片的本地路径
       */
      path: string
      /**
       * 返回图片的方向，有效值见下表
       *
       * **orientation参数说明：**
       *
       *   枚举值           |  说明
       * -------------------|-----------------
       *   up               |  默认
       *   down             |  180度旋转
       *   left             |  逆时针旋转90度
       *   right            |  顺时针旋转90度
       *   up-mirrored      |  同up，但水平翻转
       *   down-mirrored    |  同down，但水平翻转
       *   left-mirrored    |  同left，但垂直翻转
       *   right-mirrored   |  同right，但垂直翻转
       *
       * @since 1.9.90
       */
      orientation: 'up' | 'down' | 'left' | 'right' | 'up-mirrored' | 'down-mirrored ' | 'left-mirrored' | 'right-mirrored'
      /**
       * 返回图片的格式
       *
       * @since 1.9.90
       */
      type: string
    }
    type Param = {
      /**
       * 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
       */
      src: string
    }
  }
  /**
   * 获取图片信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getImageInfo({
     src: 'images/a.jpg',
     success: function (res) {
       console.log(res.width)
       console.log(res.height)
     }
   })
         Taro.chooseImage({
     success: function (res) {
       Taro.getImageInfo({
         src: res.tempFilePaths[0],
         success: function (res) {
           console.log(res.width)
           console.log(res.height)
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.getImageInfo.html
   */
  function getImageInfo(OBJECT: getImageInfo.Param): Promise<getImageInfo.Promised>

  namespace saveImageToPhotosAlbum {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
       */
      filePath: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 保存图片到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
   *
   * **示例代码：**
   *
   ```javascript
   Taro.saveImageToPhotosAlbum({
       success(res) {
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
   */
  function saveImageToPhotosAlbum(OBJECT: saveImageToPhotosAlbum.Param): Promise<saveImageToPhotosAlbum.Promised>

  namespace startRecord {
    type Promised = {
      /**
       * 录音文件的临时路径
       */
      tempFilePath: string
    }
    type Param = {}
  }
  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getRecorderManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html) 接口**
   *
   * 开始录音。当主动调用`Taro.stopRecord`，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。当用户离开小程序时，此接口无法调用。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.record
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.startRecord.html
   */
  function startRecord(OBJECT?: startRecord.Param): Promise<startRecord.Promised>

  /**
   * ​主动调用停止录音。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
     },
     fail: function(res) {
        //录音失败
     }
   })
   setTimeout(function() {
     //结束录音
     Taro.stopRecord()
   }, 10000)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.stopRecord.html
   */
  function stopRecord(): void

  /**
   * @since 1.6.0
   *
   * 获取**全局唯一**的录音管理器 `recorderManager`。
   *
   * **其中，采样率和码率有一定要求，具体有效值如下：：**
   *
   *   采样率  |  编码码率
   * ----------|-------------------
   *   8000    |  16000 ~ 48000
   *   11025   |  16000 ~ 48000
   *   12000   |  24000 ~ 64000
   *   16000   |  24000 ~ 96000
   *   22050   |  32000 ~ 128000
   *   24000   |  32000 ~ 128000
   *   32000   |  48000 ~ 192000
   *   44100   |  64000 ~ 320000
   *   48000   |  64000 ~ 320000
   *
   * **示例代码：**
   *
   ```javascript
   const recorderManager = Taro.getRecorderManager()
         recorderManager.onStart(() => {
     console.log('recorder start')
   })
   recorderManager.onPause(() => {
     console.log('recorder pause')
   })
   recorderManager.onStop((res) => {
     console.log('recorder stop', res)
     const { tempFilePath } = res
   })
   recorderManager.onFrameRecorded((res) => {
     const { frameBuffer } = res
     console.log('frameBuffer.byteLength', frameBuffer.byteLength)
   })
         const options = {
     duration: 10000,
     sampleRate: 44100,
     numberOfChannels: 1,
     encodeBitRate: 192000,
     format: 'aac',
     frameSize: 50
   }
         recorderManager.start(options)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/wx.getRecorderManager.html
   */
  function getRecorderManager(): RecorderManager

  namespace RecorderManager {
    namespace start {
      type Param = {
        /**
         * 指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
         */
        duration?: number
        /**
         * 采样率，有效值 8000/16000/44100
         */
        sampleRate?: number
        /**
         * 录音通道数，有效值 1/2
         */
        numberOfChannels?: number
        /**
         * 编码码率，有效值见下表格
         */
        encodeBitRate?: number
        /**
         * 音频格式，有效值 aac/mp3
         */
        format?: string
        /**
         * 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
         */
        frameSize?: number
      }
    }
    namespace onStop {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 录音文件的临时路径
         */
        tempFilePath: string
      }
    }
    namespace onFrameRecorded {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 录音分片结果数据
         */
        frameBuffer: ArrayBuffer
        /**
         * 当前帧是否正常录音结束前的最后一帧
         */
        isLastFrame: boolean
      }
    }
    namespace onError {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 错误信息
         */
        errMsg: string
      }
    }
  }
  class RecorderManager {
    /**
     * 开始录音
     */
    start(options: RecorderManager.start.Param): void
    /**
     * 暂停录音
     */
    pause(): void
    /**
     * 继续录音
     */
    resume(): void
    /**
     * 停止录音
     */
    stop(): void
    /**
     * 录音开始事件
     */
    onStart(callback?: () => void): void
    /**
     * 录音暂停事件
     */
    onPause(callback?: () => void): void
    /**
     * 录音停止事件，会回调文件地址
     */
    onStop(callback?: RecorderManager.onStop.Param): void
    /**
     * 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
     */
    onFrameRecorded(callback?: RecorderManager.onFrameRecorded.Param): void
    /**
     * 录音错误事件, 会回调错误信息
     */
    onError(callback?: RecorderManager.onError.Param): void
  }
  namespace playVoice {
    type Param = {
      /**
       * 需要播放的语音文件的文件路径
       */
      filePath: string
      /**
       * 指定录音时长，到达指定的录音时长后会自动停止录音，单位：秒，默认值：60
       *
       * @since 1.6.0
       */
      duration?: number
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   *
   * 开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
       Taro.playVoice({
         filePath: tempFilePath,
         complete: function(){
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.playVoice.html
   */
  function playVoice(OBJECT: playVoice.Param): Promise<any>

  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   * 暂停正在播放的语音。再次调用Taro.playVoice播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 Taro.stopVoice。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
         Taro.playVoice({
         filePath: tempFilePath
       })
             setTimeout(function() {
           //暂停播放
         Taro.pauseVoice()
       }, 5000)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.pauseVoice.html
   */
  function pauseVoice(): void

  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   * 结束播放语音。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startRecord({
     success: function(res) {
       var tempFilePath = res.tempFilePath
       Taro.playVoice({
         filePath:tempFilePath
       })
             setTimeout(function(){
         Taro.stopVoice()
       }, 5000)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.stopVoice.html
   */
  function stopVoice(): void

  namespace setInnerAudioOption {
    type Param = {
      /**
       * 是否与其他音频混播，设置为 true 之后，不会终止其他应用或微信内的音乐
       */
      mixWithOther?: boolean
      /**
       * （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
       */
      obeyMuteSwitch?: boolean
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * @since 2.3.0
   *
   * 设置 InnerAudioContext 的播放选项。设置之后对当前小程序全局生效。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.setInnerAudioOption.html
   */
  function setInnerAudioOption(OBJECT: setInnerAudioOption.Param): Promise<any>

  const enum audioSourcesTypes {
    /**
     * 自动设置，默认使用手机麦克风，插上耳麦后自动切换使用耳机麦克风，所有平台适用
     */
    auto = 'auto',
    /**
     * 手机麦克风，仅限 iOS
     */
    buildInMic = 'buildInMic',
    /**
     * 耳机麦克风，仅限 iOS
     */
    headsetMic = 'headsetMic',
    /**
     * 麦克风（没插耳麦时是手机麦克风，插耳麦时是耳机麦克风），仅限 Android
     */
    mic = 'mic',
    /**
     * 同 mic，适用于录制音视频内容，仅限 Android
     */
    camcorder = 'camcorder',
    /**
     * 同 mic，适用于实时沟通，仅限 Android
     */
    voice_communication = 'voice_communication',
    /**
     * 同 mic，适用于语音识别，仅限 Android
     */
    voice_recognition = 'voice_recognition'
  }

  namespace getAvailableAudioSources {
    type Param = {
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: Result) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any

    type Result = {
      /**
       * 支持的音频输入源列表，可在 RecorderManager.start() 接口中使用。返回值定义参考 https://developer.android.com/reference/kotlin/android/media/MediaRecorder.AudioSourc
       */
      audioSources: audioSourcesTypes[]
    }
  }
  /**
   * @since 2.1.0
   * 获取当前支持的音频输入源。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.getAvailableAudioSources.html
   */
  function getAvailableAudioSources(OBJECT: getAvailableAudioSources.Param): Promise<any>

  namespace getBackgroundAudioPlayerState {
    type Promised = {
      /**
       * 选定音频的长度（单位：s），只有在当前有音乐播放时返回
       */
      duration: number
      /**
       * 选定音频的播放位置（单位：s），只有在当前有音乐播放时返回
       */
      currentPosition: number
      /**
       * 播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
       */
      status: 0 | 1 | 2
      /**
       * 音频的下载进度（整数，80 代表 80%），只有在当前有音乐播放时返回
       */
      downloadPercent: number
      /**
       * 歌曲数据链接，只有在当前有音乐播放时返回
       */
      dataUrl: string
    }
    type Param = {}
  }
  /**
   * **注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.getBackgroundAudioManager](https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html) 接口**
   *
   * 获取后台音乐播放状态。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBackgroundAudioPlayerState({
       success: function(res) {
           var status = res.status
           var dataUrl = res.dataUrl
           var currentPosition = res.currentPosition
           var duration = res.duration
           var downloadPercent = res.downloadPercent
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioPlayerState.html
   */
  function getBackgroundAudioPlayerState(OBJECT?: getBackgroundAudioPlayerState.Param): Promise<getBackgroundAudioPlayerState.Promised>

  namespace playBackgroundAudio {
    type Param = {
      /**
       * 音乐链接，目前支持的格式有 m4a, aac, mp3, wav
       */
      dataUrl: string
      /**
       * 音乐标题
       */
      title?: string
      /**
       * 封面URL
       */
      coverImgUrl?: string
    }
  }
  /**
   * 使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放。
   *
   * **OBJECT参数说明：**
   *
   ```javascript
   Taro.playBackgroundAudio({
       dataUrl: '',
       title: '',
       coverImgUrl: ''
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.playBackgroundAudio.html
   */
  function playBackgroundAudio(OBJECT: playBackgroundAudio.Param): Promise<any>

  /**
   * 暂停播放音乐。
   *
   * **示例代码**
   *
   * **示例：**
   *
   ```javascript
   Taro.pauseBackgroundAudio()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.pauseBackgroundAudio.html
   */
  function pauseBackgroundAudio(): void

  namespace seekBackgroundAudio {
    type Param = {
      /**
       * 音乐位置，单位：秒
       */
      position: number
    }
  }
  /**
   * 控制音乐播放进度。
   *
   * **OBJECT参数说明：**
   *
   ```javascript
   Taro.seekBackgroundAudio({
       position: 30
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.seekBackgroundAudio.html
   */
  function seekBackgroundAudio(OBJECT: seekBackgroundAudio.Param): Promise<any>

  /**
   * 停止播放音乐。
   *
   * **示例代码**
   *
   * **示例：**
   *
   ```javascript
   Taro.stopBackgroundAudio()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.stopBackgroundAudio.html
   */
  function stopBackgroundAudio(): void

  /**
   * 监听音乐播放。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioPlay.html
   */
  function onBackgroundAudioPlay(CALLBACK: any): void

  /**
   * 监听音乐暂停。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioPause.html
   */
  function onBackgroundAudioPause(CALLBACK: any): void

  /**
   * 监听音乐停止。
   *
   * **bug & tip：**
   *
   * 1.  `bug`: `iOS` `6.3.30` Taro.seekBackgroundAudio 会有短暂延迟
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.onBackgroundAudioStop.html
   */
  function onBackgroundAudioStop(CALLBACK: any): void

  /**
   * @since 1.2.0
   *
   * 获取**全局唯一**的背景音频管理器 `backgroundAudioManager`。
   *
   * **errcode 说明：**
   *
   *   errCode   |  说明
   * ------------|---------
   *   10001     | 系统错误
   *   10002     | 网络错误
   *   10003     | 文件错误
   *   10004     | 格式错误
   *   -1        | 未知错误
   *
   * **示例代码：**
   *
   ```javascript
   const backgroundAudioManager = Taro.getBackgroundAudioManager()
         backgroundAudioManager.title = '此时此刻'
   backgroundAudioManager.epname = '此时此刻'
   backgroundAudioManager.singer = '许巍'
   backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
   backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46' // 设置了 src 之后会自动播放
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/background-audio/wx.getBackgroundAudioManager.html
   */
  function getBackgroundAudioManager(): BackgroundAudioManager

  class BackgroundAudioManager {
    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     *
     * @readonly
     */
    readonly duration: number
    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
     *
     * @readonly
     */
    readonly currentTime: number
    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     *
     * @readonly
     */
    readonly paused: boolean
    /**
     * 音频的数据源，默认为空字符串，**当设置了新的 src 时，会自动开始播放** ，目前支持的格式有 m4a, aac, mp3, wav
     */
    src: string
    /**
     * 音频开始播放的位置（单位：s）
     */
    startTime: number
    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
     *
     * @readonly
     */
    buffered: number
    /**
     * 音频标题，用于做原生音频播放器音频标题。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
     */
    title: string
    /**
     * 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     */
    epname: string
    /**
     * 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     */
    singer: string
    /**
     * 封面图url，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
     */
    coverImgUrl: string
    /**
     * 页面链接，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     */
    webUrl: string
    /**
     * 音频协议。默认值为 'http'，设置 'hls' 可以支持播放 HLS 协议的直播音频
     *
     * @since 1.9.94
     */
    protocol: string
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 停止
     */
    stop(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: any): void
    /**
     * 背景音频进入可以播放状态，但不保证后面可以流畅播放
     */
    onCanplay(callback?: () => void): void
    /**
     * 背景音频播放事件
     */
    onPlay(callback?: () => void): void
    /**
     * 背景音频暂停事件
     */
    onPause(callback?: () => void): void
    /**
     * 背景音频停止事件
     */
    onStop(callback?: () => void): void
    /**
     * 背景音频自然播放结束事件
     */
    onEnded(callback?: () => void): void
    /**
     * 背景音频播放进度更新事件
     */
    onTimeUpdate(callback?: () => void): void
    /**
     * 用户在系统音乐播放面板点击上一曲事件（iOS only）
     */
    onPrev(callback?: () => void): void
    /**
     * 用户在系统音乐播放面板点击下一曲事件（iOS only）
     */
    onNext(callback?: () => void): void
    /**
     * 背景音频播放错误事件
     */
    onError(callback?: () => void): void
    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     */
    onWaiting(callback?: () => void): void
  }
  /**
   * **注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 [Taro.createInnerAudioContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html) 接口**
   *
   * 创建并返回 audio 上下文 `audioContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<audio/>` 组件
   *
   * **audioContext：**
   *
   * `audioContext` 通过 audioId 跟一个 `<audio/>` 组件绑定，通过它可以操作对应的 `<audio/>` 组件。
   *
   * **示例代码：**
   *
   ```html
   <!-- audio.wxml -->
   <audio  src="{{src}}" id="myAudio" ></audio>
         <button type="primary" bindtap="audioPlay">播放</button>
   <button type="primary" bindtap="audioPause">暂停</button>
   <button type="primary" bindtap="audio14">设置当前播放时间为14秒</button>
   <button type="primary" bindtap="audioStart">回到开头</button>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   // audio.js
   Page({
     onReady: function (e) {
       // 使用 Taro.createAudioContext 获取 audio 上下文 context
       this.audioCtx = Taro.createAudioContext('myAudio')
       this.audioCtx.setSrc('http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46')
       this.audioCtx.play()
     },
     data: {
       src: ''
     },
     audioPlay: function () {
       this.audioCtx.play()
     },
     audioPause: function () {
       this.audioCtx.pause()
     },
     audio14: function () {
       this.audioCtx.seek(14)
     },
     audioStart: function () {
       this.audioCtx.seek(0)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createAudioContext.html
   */
  function createAudioContext(audioId: string, instance?: any): AudioContext

  class AudioContext {
    /**
     * 音频的地址
     */
    setSrc(src: string): void
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: number): void
  }
  /**
   * @since 1.6.0
   *
   * 创建并返回内部 audio 上下文 `innerAudioContext` 对象。_本接口是 `Taro.createAudioContext` 升级版。_
   *
   * **errCode 说明：**
   *
   *   errCode   |  说明
   * ------------|---------
   *   10001     | 系统错误
   *   10002     | 网络错误
   *   10003     | 文件错误
   *   10004     | 格式错误
   *   -1        | 未知错误
   *
   * **示例代码：**
   *
   ```javascript
   const innerAudioContext = Taro.createInnerAudioContext()
   innerAudioContext.autoplay = true
   innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
   innerAudioContext.onPlay(() => {
       console.log('开始播放')
   })
   innerAudioContext.onError((res) => {
       console.log(res.errMsg)
       console.log(res.errCode)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/wx.createInnerAudioContext.html
   */
  function createInnerAudioContext(): InnerAudioContext

  class InnerAudioContext {
    /**
     * 音频的数据链接，用于直接播放。
     */
    src: string
    /**
     * 开始播放的位置（单位：s），默认 0
     */
    startTime: number
    /**
     * 是否自动开始播放，默认 false
     */
    autoplay: boolean
    /**
     * 是否循环播放，默认 false
     */
    loop: boolean
    /**
     * 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
     */
    obeyMuteSwitch: boolean
    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     *
     * @readonly
     */
    duration: number
    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
     *
     * @readonly
     */
    currentTime: number
    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     *
     * @readonly
     */
    paused: boolean
    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
     *
     * @readonly
     */
    buffered: number
    /**
     * 音量。范围 0~1。
     *
     * @since 1.9.90
     */
    volume: number
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 停止
     */
    stop(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: number): void
    /**
     * 销毁当前实例
     */
    destroy(): void
    /**
     * 音频进入可以播放状态，但不保证后面可以流畅播放
     */
    onCanplay(callback?: () => void): void
    /**
     * 音频播放事件
     */
    onPlay(callback?: () => void): void
    /**
     * 音频暂停事件
     */
    onPause(callback?: () => void): void
    /**
     * 音频停止事件
     */
    onStop(callback?: () => void): void
    /**
     * 音频自然播放结束事件
     */
    onEnded(callback?: () => void): void
    /**
     * 音频播放进度更新事件
     */
    onTimeUpdate(callback?: () => void): void
    /**
     * 音频播放错误事件
     */
    onError(callback?: () => void): void
    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     */
    onWaiting(callback?: () => void): void
    /**
     * 音频进行 seek 操作事件
     */
    onSeeking(callback?: () => void): void
    /**
     * 音频完成 seek 操作事件
     */
    onSeeked(callback?: () => void): void
    /**
     * 取消监听 onCanplay 事件
     *
     * @since 1.9.0
     */
    offCanplay(callback?: () => void): void
    /**
     * 取消监听 onPlay 事件
     *
     * @since 1.9.0
     */
    offPlay(callback?: () => void): void
    /**
     * 取消监听 onPause 事件
     *
     * @since 1.9.0
     */
    offPause(callback?: () => void): void
    /**
     * 取消监听 onStop 事件
     *
     * @since 1.9.0
     */
    offStop(callback?: () => void): void
    /**
     * 取消监听 onEnded 事件
     *
     * @since 1.9.0
     */
    offEnded(callback?: () => void): void
    /**
     * 取消监听 onTimeUpdate 事件
     *
     * @since 1.9.0
     */
    offTimeUpdate(callback?: () => void): void
    /**
     * 取消监听 onError 事件
     *
     * @since 1.9.0
     */
    offError(callback?: () => void): void
    /**
     * 取消监听 onWaiting 事件
     *
     * @since 1.9.0
     */
    offWaiting(callback?: () => void): void
    /**
     * 取消监听 onSeeking 事件
     *
     * @since 1.9.0
     */
    offSeeking(callback?: () => void): void
    /**
     * 取消监听 onSeeked 事件
     *
     * @since 1.9.0
     */
    offSeeked(callback?: () => void): void
  }
  namespace chooseVideo {
    type Promised = {
      /**
       * 选定视频的临时文件路径
       */
      tempFilePath: string
      /**
       * 选定视频的时间长度
       */
      duration: number
      /**
       * 选定视频的数据量大小
       */
      size: number
      /**
       * 返回选定视频的长
       */
      height: number
      /**
       * 返回选定视频的宽
       */
      width: number
    }
    type Param = {
      /**
       * album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
       */
      sourceType?: string[]
      /**
       * 是否压缩所选的视频源文件，默认值为true，需要压缩
       *
       * @since 1.6.0
       */
      compressed?: boolean
      /**
       * 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
       */
      maxDuration?: number
    }
  }
  /**
   * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
   *
   * **示例代码：**
   *
   ```html
   <view class="container">
       <video src="{{src}}"></video>
       <button bindtap="bindButtonTap">获取视频</button>
   </view>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
       bindButtonTap: function() {
           var that = this
           Taro.chooseVideo({
               sourceType: ['album','camera'],
               maxDuration: 60,
         camera: 'back',
               success: function(res) {
                   that.setData({
                       src: res.tempFilePath
                   })
               }
           })
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html
   */
  function chooseVideo(OBJECT?: chooseVideo.Param): Promise<chooseVideo.Promised>

  namespace saveVideoToPhotosAlbum {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 视频文件路径，可以是临时文件路径也可以是永久文件路径
       */
      filePath: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 保存视频到系统相册。需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.writePhotosAlbum
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: camera 参数在部分 Android 手机下由于系统 ROM 不支持无法生效
   *
   * **示例代码：**
   *
   ```javascript
   Taro.saveVideoToPhotosAlbum({
     filePath: 'wxfile://xxx'
     success(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.saveVideoToPhotosAlbum.html
   */
  function saveVideoToPhotosAlbum(OBJECT: saveVideoToPhotosAlbum.Param): Promise<saveVideoToPhotosAlbum.Promised>

  /**
   * 创建并返回 video 上下文 `videoContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<video/>` 组件
   *
   * **videoContext：**
   *
   * `videoContext` 通过 videoId 跟一个 video 组件绑定，通过它可以操作一个 video 组件。
   *
   * **示例代码：**
   *
   ```html
   <view class="section tc">
     <video id="myVideo" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"   enable-danmu danmu-btn controls></video>
     <view class="btn-area">
       <input bindblur="bindInputBlur"/>
       <button bindtap="bindSendDanmu">发送弹幕</button>
     </view>
   </view>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   function getRandomColor () {
     let rgb = []
     for (let i = 0 ; i < 3; ++i){
       let color = Math.floor(Math.random()   256).toString(16)
       color = color.length == 1 ? '0' + color : color
       rgb.push(color)
     }
     return '#' + rgb.join('')
   }
         Page({
     onReady: function (res) {
       this.videoContext = Taro.createVideoContext('myVideo')
     },
     inputValue: '',
     bindInputBlur: function(e) {
       this.inputValue = e.detail.value
     },
     bindSendDanmu: function () {
       this.videoContext.sendDanmu({
         text: this.inputValue,
         color: getRandomColor()
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.createVideoContext.html
   */
  function createVideoContext(videoId: any, instance?: any): VideoContext

  class VideoContext {
    /**
     * 播放
     */
    play(): void
    /**
     * 暂停
     */
    pause(): void
    /**
     * 停止
     *
     * @since 1.7.0
     */
    stop(): void
    /**
     * 跳转到指定位置，单位 s
     */
    seek(position: number): void
    /**
     * 发送弹幕，danmu 包含两个属性 text, color。
     */
    sendDanmu(danmu: { text: string; color: string }): void
    /**
     * 设置倍速播放，支持的倍率有 0.5/0.8/1.0/1.25/1.5
     *
     * @since 1.4.0
     */
    playbackRate(rate: number): void
    /**
     * 进入全屏，可传入{direction}参数（1.7.0起支持），详见video组件文档
     *
     * @since 1.4.0
     */
    requestFullScreen(param: { direction: 0 | 90 | -90 }): void
    /**
     * 退出全屏
     *
     * @since 1.4.0
     */
    exitFullScreen(): void
    /**
     * 显示状态栏，仅在iOS全屏下有效
     *
     * @since 2.1.0
     */
    showStatusBar(): void
    /**
     * 隐藏状态栏，仅在iOS全屏下有效
     *
     * @since 2.1.0
     */
    hideStatusBar(): void
  }
  /**
   * @since 1.6.0
   *
   * 创建并返回 camera 上下文 `cameraContext` 对象，`cameraContext` 与页面的 `camera` 组件绑定，一个页面只能有一个camera，通过它可以操作对应的 `<camera/>` 组件。 在自定义组件下，第一个参数传入组件实例this，以操作组件内 `<camera/>` 组件
   *
   * **示例代码：**
   *
   * [在开发者工具中预览效果](wechatide://minicode/VBZ3Jim26zYu)
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/camera/wx.createCameraContext.html
   */
  function createCameraContext(instance?: any): CameraContext

  namespace CameraContext {
    namespace takePhoto {
      type Param = {
        /**
         * 成像质量，值为high, normal, low，默认normal
         */
        quality?: string
        /**
         * 接口调用成功的回调函数 ，res = { tempImagePath }
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数 ，res = { tempImagePath }
       */
      type ParamPropSuccess = (res: { tempImagePath: string }) => void
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace startRecord {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
        /**
         * 超过30s或页面onHide时会结束录像，res = { tempThumbPath, tempVideoPath }
         */
        timeoutCallback?: ParamPropTimeoutCallback
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: { tempThumbPath: string; tempVideoPath: string }) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
      /**
       * 超过30s或页面onHide时会结束录像，res = { tempThumbPath, tempVideoPath }
       */
      type ParamPropTimeoutCallback = (res: { tempThumbPath: string; tempVideoPath: string }) => void
    }
    namespace stopRecord {
      type Param = {
        /**
         * 接口调用成功的回调函数 ，res = { tempThumbPath, tempVideoPath }
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数 ，res = { tempThumbPath, tempVideoPath }
       */
      type ParamPropSuccess = (res: { tempThumbPath: string; tempVideoPath: string }) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
  }
  class CameraContext {
    /**
     * 拍照，可指定质量，成功则返回图片
     */
    takePhoto(OBJECT: CameraContext.takePhoto.Param): any
    /**
     * 开始录像
     */
    startRecord(OBJECT: CameraContext.startRecord.Param): any
    /**
     * 结束录像，成功则返回封面与视频
     */
    stopRecord(OBJECT: CameraContext.stopRecord.Param): any
  }
  /**
   * @since 1.7.0
   *
   * 操作对应的 `<live-player/>` 组件。 创建并返回 `live-player` 上下文 `LivePlayerContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<live-player/>` 组件
   *
   * **示例代码：**
   *
   * [在开发者工具中预览效果](wechatide://minicode/UzWEzmm763Y4)
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/wx.createLivePlayerContext.html
   */
  function createLivePlayerContext(domId: any, instance?: any): LivePlayerContext

  namespace LivePlayerContext {
    namespace play {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace stop {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace mute {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace pause {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace resume {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace requestFullScreen {
      type Param = {
        /**
         * 有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）
         */
        direction?: number
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace exitFullScreen {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
  }
  class LivePlayerContext {
    /**
     * 播放
     */
    play(OBJECT: LivePlayerContext.play.Param): any
    /**
     * 停止
     */
    stop(OBJECT: LivePlayerContext.stop.Param): any
    /**
     * 静音
     */
    mute(OBJECT: LivePlayerContext.mute.Param): any
    /**
     * 暂停
     *
     * @since 1.9.90
     */
    pause(OBJECT: LivePlayerContext.pause.Param): any
    /**
     * 恢复
     *
     * @since 1.9.90
     */
    resume(OBJECT: LivePlayerContext.resume.Param): any
    /**
     * 进入全屏
     */
    requestFullScreen(OBJECT: LivePlayerContext.requestFullScreen.Param): any
    /**
     * 退出全屏
     */
    exitFullScreen(OBJECT: LivePlayerContext.exitFullScreen.Param): any
  }
  /**
   * @since 1.7.0
   *
   * 创建并返回 `live-pusher` 上下文 `LivePusherContext` 对象，`LivePusherContext` 与页面的 `<live-pusher />` 组件绑定，一个页面只能有一个 `live-pusher`，通过它可以操作对应的 `<live-pusher/>` 组件。 在自定义组件下，第一个参数传入组件实例this，以操作组件内 `<live-pusher/>` 组件
   *
   * **示例代码：**
   *
   * [在开发者工具中预览效果](wechatide://minicode/KvWD9mmA62Yk)
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/live/wx.createLivePusherContext.html
   */
  function createLivePusherContext(): LivePusherContext

  namespace LivePusherContext {
    namespace start {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace stop {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace pause {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace resume {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace switchCamera {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace snapshot {
      type Param = {
        /**
         * 接口调用成功的回调函数
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
  }
  class LivePusherContext {
    /**
     * 播放推流
     */
    start(OBJECT: LivePusherContext.start.Param): any
    /**
     * 停止推流
     */
    stop(OBJECT: LivePusherContext.stop.Param): any
    /**
     * 暂停推流
     */
    pause(OBJECT: LivePusherContext.pause.Param): any
    /**
     * 恢复推流
     */
    resume(OBJECT: LivePusherContext.resume.Param): any
    /**
     * 切换前后摄像头
     */
    switchCamera(OBJECT: LivePusherContext.switchCamera.Param): any
    /**
     * 快照
     *
     * @since 1.9.90
     */
    snapshot(OBJECT: LivePusherContext.snapshot.Param): any
  }
  namespace saveFile {
    type Promised = {
      /**
       * 文件的保存路径
       */
      savedFilePath: any
    }
    type Param = {
      /**
       * 需要保存的文件的临时路径
       */
      tempFilePath: string
    }
  }
  /**
   * 保存文件到本地。**注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用**
   *
   * **bug & tip：**
   *
   * 1.  `tip`: 本地文件存储的大小限制为 10M
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseImage({
     success: function(res) {
       var tempFilePaths = res.tempFilePaths
       Taro.saveFile({
         tempFilePath: tempFilePaths[0],
         success: function(res) {
           var savedFilePath = res.savedFilePath
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.saveFile.html
   */
  function saveFile(OBJECT: saveFile.Param): Promise<saveFile.Promised>

  namespace getSavedFileList {
    type Promised = {
      /**
       * 接口调用结果
       */
      errMsg: string
      /**
       * 文件列表
       */
      fileList: PromisedPropFileList
    }
    /**
     * 文件列表
     */
    type PromisedPropFileList = PromisedPropFileListItem[]
    type PromisedPropFileListItem = {
      /**
       * 文件的本地路径
       */
      filePath: string
      /**
       * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
       */
      createTime: number
      /**
       * 文件大小，单位B
       */
      size: number
    }
    type Param = {}
  }
  /**
   * 获取本地已保存的文件列表
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSavedFileList({
     success: function(res) {
       console.log(res.fileList)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileList.html
   */
  function getSavedFileList(OBJECT?: getSavedFileList.Param): Promise<getSavedFileList.Promised>

  namespace getSavedFileInfo {
    type Promised = {
      /**
       * 接口调用结果
       */
      errMsg: string
      /**
       * 文件大小，单位B
       */
      size: number
      /**
       * 文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数
       */
      createTime: number
    }
    type Param = {
      /**
       * 文件路径
       */
      filePath: string
    }
  }
  /**
   * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 [Taro.getFileInfo](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html) 接口。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSavedFileInfo({
     filePath: 'wxfile://somefile', //仅做示例用，非真正的文件路径
     success: function(res) {
       console.log(res.size)
       console.log(res.createTime)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileInfo.html
   */
  function getSavedFileInfo(OBJECT: getSavedFileInfo.Param): Promise<getSavedFileInfo.Promised>

  namespace removeSavedFile {
    type Param = {
      /**
       * 需要删除的文件路径
       */
      filePath: string
    }
  }
  /**
   * 删除本地存储的文件
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSavedFileList({
     success: function(res) {
       if (res.fileList.length > 0){
         Taro.removeSavedFile({
           filePath: res.fileList[0].filePath,
           complete: function(res) {
             console.log(res)
           }
         })
       }
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.removeSavedFile.html
   */
  function removeSavedFile(OBJECT: removeSavedFile.Param): Promise<any>

  namespace openDocument {
    type Param = {
      /**
       * 文件路径，可通过 downFile 获得
       */
      filePath: string
      /**
       * 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
       *
       * @since 1.4.0
       */
      fileType?: string
    }
  }
  /**
   * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
   *
   * **示例代码：**
   *
   ```javascript
   Taro.downloadFile({
     url: 'http://example.com/somefile.pdf',
     success: function (res) {
       var filePath = res.tempFilePath
       Taro.openDocument({
         filePath: filePath,
         success: function (res) {
           console.log('打开文档成功')
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html
   */
  function openDocument(OBJECT: openDocument.Param): Promise<any>

  namespace getFileInfo {
    type Promised = {
      /**
       * 文件大小，单位：B
       */
      size: number
      /**
       * 按照传入的 digestAlgorithm 计算得出的的文件摘要
       */
      digest: string
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 本地文件路径
       */
      filePath: string
      /**
       * 计算文件摘要的算法，默认值 md5，有效值：md5，sha1
       */
      digestAlgorithm?: string
    }
  }
  /**
   * @since 1.4.0
   *
   * 获取文件信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getFileInfo({
       success(res) {
           console.log(res.size)
           console.log(res.digest)
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html
   */
  function getFileInfo(OBJECT: getFileInfo.Param): Promise<getFileInfo.Promised>

  namespace setStorage {
    type Param = {
      /**
       * 本地缓存中的指定的 key
       */
      key: string
      /**
       * 需要存储的内容
       */
      data: any | string
    }
  }
  /**
   * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setStorage({
     key:"key",
     data:"value"
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html
   */
  function setStorage(OBJECT: setStorage.Param): Promise<any>

  /**
   * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
   *
   * **参数说明：**
   *
   ```javascript
   try {
       Taro.setStorageSync('key', 'value')
   } catch (e) {
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html
   */
  function setStorageSync(key: string, data: any | string): void

  namespace getStorage {
    type Promised = {
      /**
       * key对应的内容
       */
      data: string
    }
    type Param = {
      /**
       * 本地缓存中的指定的 key
       */
      key: string
    }
  }
  /**
   * 从本地缓存中异步获取指定 key 对应的内容。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getStorage({
     key: 'key',
     success: function(res) {
         console.log(res.data)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html
   */
  function getStorage(OBJECT: getStorage.Param): Promise<getStorage.Promised>

  /**
   * 从本地缓存中同步获取指定 key 对应的内容。
   *
   * **示例代码：**
   *
   ```javascript
   try {
     var value = Taro.getStorageSync('key')
     if (value) {
         // Do something with return value
     }
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageSync.html
   */
  function getStorageSync(key: string): any | undefined

  namespace getStorageInfo {
    type Promised = {
      /**
       * 当前storage中所有的key
       */
      keys: string[]
      /**
       * 当前占用的空间大小, 单位kb
       */
      currentSize: number
      /**
       * 限制的空间大小，单位kb
       */
      limitSize: number
    }
    type Param = {}
  }
  /**
   * 异步获取当前storage的相关信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getStorageInfo({
     success: function(res) {
       console.log(res.keys)
       console.log(res.currentSize)
       console.log(res.limitSize)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfo.html
   */
  function getStorageInfo(OBJECT?: getStorageInfo.Param): Promise<getStorageInfo.Promised>

  namespace getStorageInfoSync {
    type Return = {
      /**
       * 当前storage中所有的key
       */
      keys: string[]
      /**
       * 当前占用的空间大小, 单位kb
       */
      currentSize: number
      /**
       * 限制的空间大小，单位kb
       */
      limitSize: number
    }
  }
  /**
   * 同步获取当前storage的相关信息
   *
   * **示例代码：**
   *
   ```javascript
   try {
     var res = Taro.getStorageInfoSync()
     console.log(res.keys)
     console.log(res.currentSize)
     console.log(res.limitSize)
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorageInfoSync.html
   */
  function getStorageInfoSync(): getStorageInfoSync.Return

  namespace removeStorage {
    type Param = {
      /**
       * 本地缓存中的指定的 key
       */
      key: string
    }
  }
  /**
   * 从本地缓存中异步移除指定 key 。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.removeStorage({
     key: 'key',
     success: function(res) {
       console.log(res.data)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorage.html
   */
  function removeStorage(OBJECT: removeStorage.Param): Promise<any>

  /**
   * 从本地缓存中同步移除指定 key 。
   *
   * **示例代码：**
   *
   ```javascript
   try {
     Taro.removeStorageSync('key')
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorageSync.html
   */
  function removeStorageSync(key: string): void

  /**
   * 清理本地数据缓存。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.clearStorage()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html
   */
  function clearStorage(): void

  /**
   * 同步清理本地数据缓存
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 本地数据存储的大小限制为 10MB
   *
   * **示例代码：**
   *
   ```javascript
   try {
       Taro.clearStorageSync()
   } catch(e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorageSync.html
   */
  function clearStorageSync(): void

  namespace getLocation {
    type Promised = {
      /**
       * 纬度，浮点数，范围为-90~90，负数表示南纬
       */
      latitude: number
      /**
       * 经度，浮点数，范围为-180~180，负数表示西经
       */
      longitude: number
      /**
       * 速度，浮点数，单位m/s
       */
      speed: number
      /**
       * 位置的精确度
       */
      accuracy: number
      /**
       * 高度，单位 m
       *
       * @since 1.2.0
       */
      altitude: number
      /**
       * 垂直精度，单位 m（Android 无法获取，返回 0）
       *
       * @since 1.2.0
       */
      verticalAccuracy: number
      /**
       * 水平精度，单位 m
       *
       * @since 1.2.0
       */
      horizontalAccuracy: number
    }
    type Param = {
      /**
       * 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于`Taro.openLocation`的坐标
       */
      type?: 'wgs84' | 'gcj02'
      /**
       * 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
       *
       * @since 1.6.0
       */
      altitude?: boolean
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用；当用户点击“显示在聊天顶部”时，此接口可继续调用。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getLocation({
     type: 'wgs84',
     success: function(res) {
       var latitude = res.latitude
       var longitude = res.longitude
       var speed = res.speed
       var accuracy = res.accuracy
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
   */
  function getLocation(OBJECT?: getLocation.Param): Promise<getLocation.Promised>

  namespace chooseLocation {
    type Promised = {
      /**
       * 位置名称
       */
      name: any
      /**
       * 详细地址
       */
      address: any
      /**
       * 纬度，浮点数，范围为-90~90，负数表示南纬
       */
      latitude: any
      /**
       * 经度，浮点数，范围为-180~180，负数表示西经
       */
      longitude: any
    }
    type Param = {}
  }
  /**
   * 打开地图选择位置。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userLocation
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.chooseLocation.html
   */
  function chooseLocation(OBJECT?: chooseLocation.Param): Promise<chooseLocation.Promised>

  namespace openLocation {
    type Param = {
      /**
       * 纬度，范围为-90~90，负数表示南纬
       */
      latitude: number
      /**
       * 经度，范围为-180~180，负数表示西经
       */
      longitude: number
      /**
       * 缩放比例，范围5~18，默认为18
       */
      scale?: number
      /**
       * 位置名
       */
      name?: string
      /**
       * 地址的详细说明
       */
      address?: string
    }
  }
  /**
   * ​使用微信内置地图查看位置。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userLocation
   *
   * **Bug & Tip：**
   *
   * 1.  `bug`: `iOS` `6.3.30` type 参数不生效，只会返回 wgs84 类型的坐标信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getLocation({
     type: 'gcj02', //返回可以用于Taro.openLocation的经纬度
     success: function(res) {
       var latitude = res.latitude
       var longitude = res.longitude
       Taro.openLocation({
         latitude: latitude,
         longitude: longitude,
         scale: 28
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
   */
  function openLocation(OBJECT: openLocation.Param): Promise<any>

  /**
   * 创建并返回 map 上下文 `mapContext` 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<map/>` 组件
   *
   * **mapContext：**
   *
   * `mapContext` 通过 mapId 跟一个 `<map/>` 组件绑定，通过它可以操作对应的 `<map/>` 组件。
   *
   * **示例代码：**
   *
   ```html
   <!-- map.wxml -->
   <map id="myMap" show-location />
         <button type="primary" bindtap="getCenterLocation">获取位置</button>
   <button type="primary" bindtap="moveToLocation">移动位置</button>
   <button type="primary" bindtap="translateMarker">移动标注</button>
   <button type="primary" bindtap="includePoints">缩放视野展示所有经纬度</button>
   ```
   *
   * **示例代码：**
   *
   ```javascript
   // map.js
   Page({
     onReady: function (e) {
       // 使用 Taro.createMapContext 获取 map 上下文
       this.mapCtx = Taro.createMapContext('myMap')
     },
     getCenterLocation: function () {
       this.mapCtx.getCenterLocation({
         success: function(res){
           console.log(res.longitude)
           console.log(res.latitude)
         }
       })
     },
     moveToLocation: function () {
       this.mapCtx.moveToLocation()
     },
     translateMarker: function() {
       this.mapCtx.translateMarker({
         markerId: 0,
         autoRotate: true,
         duration: 1000,
         destination: {
           latitude:23.10229,
           longitude:113.3345211,
         },
         animationEnd() {
           console.log('animation end')
         }
       })
     },
     includePoints: function() {
       this.mapCtx.includePoints({
         padding: [10],
         points: [{
           latitude:23.10229,
           longitude:113.3345211,
         }, {
           latitude:23.00229,
           longitude:113.3345211,
         }]
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/map/wx.createMapContext.html
   */
  function createMapContext(mapId: any, instance?: any): MapContext

  namespace MapContext {
    namespace getCenterLocation {
      type Param = {
        /**
         * 接口调用成功的回调函数 ，res = { longitude: "经度", latitude: "纬度"}
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数 ，res = { longitude: "经度", latitude: "纬度"}
       */
      type ParamPropSuccess = (res: { longitude: number; latitude: number }) => void
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace translateMarker {
      type Param = {
        /**
         * 指定marker
         */
        markerId: number
        /**
         * 指定marker移动到的目标点
         */
        destination: any
        /**
         * 移动过程中是否自动旋转marker
         */
        autoRotate: boolean
        /**
         * marker的旋转角度
         */
        rotate: number
        /**
         * 动画持续时长，默认值1000ms，平移与旋转分别计算
         */
        duration?: number
        /**
         * 动画结束回调函数
         */
        animationEnd?: ParamPropAnimationEnd
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
      }
      /**
       * 动画结束回调函数
       */
      type ParamPropAnimationEnd = () => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = () => any
    }
    namespace includePoints {
      type Param = {
        /**
         * 要显示在可视区域内的坐标点列表，[{latitude, longitude}]
         */
        points: any[]
        /**
         * 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。
         */
        padding?: any[]
      }
    }
    namespace getRegion {
      type Param = {
        /**
         * 接口调用成功的回调函数，res = {southwest, northeast}，西南角与东北角的经纬度
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数，res = {southwest, northeast}，西南角与东北角的经纬度
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
    namespace getScale {
      type Param = {
        /**
         * 接口调用成功的回调函数，res = {scale}
         */
        success?: ParamPropSuccess
        /**
         * 接口调用失败的回调函数
         */
        fail?: ParamPropFail
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ParamPropComplete
      }
      /**
       * 接口调用成功的回调函数，res = {scale}
       */
      type ParamPropSuccess = (res: any) => any
      /**
       * 接口调用失败的回调函数
       */
      type ParamPropFail = (err: any) => any
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      type ParamPropComplete = () => any
    }
  }
  class MapContext {
    /**
     * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 [`Taro.openLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html)
     */
    getCenterLocation(OBJECT: MapContext.getCenterLocation.Param): any
    /**
     * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
     */
    moveToLocation(): void
    /**
     * 平移marker，带动画
     *
     * @since 1.2.0
     */
    translateMarker(OBJECT: MapContext.translateMarker.Param): any
    /**
     * 缩放视野展示所有经纬度
     *
     * @since 1.2.0
     */
    includePoints(OBJECT: MapContext.includePoints.Param): any
    /**
     * 获取当前地图的视野范围
     *
     * @since 1.4.0
     */
    getRegion(OBJECT: MapContext.getRegion.Param): any
    /**
     * 获取当前地图的缩放级别
     *
     * @since 1.4.0
     */
    getScale(OBJECT: MapContext.getScale.Param): any
  }
  namespace getSystemInfo {
    type Promised = {
      /**
       * 手机品牌
       *
       * @since 1.5.0
       */
      brand: string
      /**
       * 手机型号
       */
      model: string
      /**
       * 设备像素比
       */
      pixelRatio: string
      /**
       * 屏幕宽度
       *
       * @since 1.1.0
       */
      screenWidth: number
      /**
       * 屏幕高度
       *
       * @since 1.1.0
       */
      screenHeight: number
      /**
       * 可使用窗口宽度
       */
      windowWidth: number
      /**
       * 可使用窗口高度
       */
      windowHeight: number
      /**
       * 状态栏的高度
       *
       * @since 1.9.0
       */
      statusBarHeight: number
      /**
       * 微信设置的语言
       */
      language: string
      /**
       * 微信版本号
       */
      version: string
      /**
       * 操作系统版本
       */
      system: string
      /**
       * 客户端平台
       */
      platform: string
      /**
       * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
       *
       * @since 1.5.0
       */
      fontSizeSetting: number
      /**
       * 客户端基础库版本
       *
       * @since 1.1.0
       */
      SDKVersion: string
    }
    type Param = {}
  }
  /**
   * 获取系统信息。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSystemInfo({
     success: function(res) {
       console.log(res.model)
       console.log(res.pixelRatio)
       console.log(res.windowWidth)
       console.log(res.windowHeight)
       console.log(res.language)
       console.log(res.version)
       console.log(res.platform)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfo.html
   */
  function getSystemInfo(OBJECT?: getSystemInfo.Param): Promise<getSystemInfo.Promised>

  namespace getSystemInfoSync {
    type Return = {
      /**
       * 手机品牌
       *
       * @since 1.5.0
       */
      brand: string
      /**
       * 手机型号
       */
      model: string
      /**
       * 设备像素比
       */
      pixelRatio: number
      /**
       * 屏幕宽度
       *
       * @since 1.1.0
       */
      screenWidth: number
      /**
       * 屏幕高度
       *
       * @since 1.1.0
       */
      screenHeight: number
      /**
       * 可使用窗口宽度
       */
      windowWidth: number
      /**
       * 可使用窗口高度
       */
      windowHeight: number
      /**
       * 状态栏的高度
       *
       * @since 1.9.0
       */
      statusBarHeight: number
      /**
       * 微信设置的语言
       */
      language: string
      /**
       * 微信版本号
       */
      version: string
      /**
       * 操作系统版本
       */
      system: string
      /**
       * 客户端平台
       */
      platform: string
      /**
       * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
       *
       * @since 1.5.0
       */
      fontSizeSetting: number
      /**
       * 客户端基础库版本
       *
       * @since 1.1.0
       */
      SDKVersion: string
    }
  }
  /**
   * 获取系统信息同步接口
   *
   * **示例代码：**
   *
   ```javascript
   try {
     var res = Taro.getSystemInfoSync()
     console.log(res.model)
     console.log(res.pixelRatio)
     console.log(res.windowWidth)
     console.log(res.windowHeight)
     console.log(res.language)
     console.log(res.version)
     console.log(res.platform)
   } catch (e) {
     // Do something when catch error
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfoSync.html
   */
  function getSystemInfoSync(): getSystemInfoSync.Return

  /**
   * **注意：此接口从基础库 1.1.1 版本开始支持。**
   *
   * 判断小程序的API，回调，参数，组件等是否在当前版本可用。
   *
   * **String参数说明：** 使用`${API}.${method}.${param}.${options}`或者`${component}.${attribute}.${option}`方式来调用，例如：
   *
   * *   `${API}` 代表 API 名字
   * *   `${method}` 代表调用方式，有效值为`return`, `success`, `object`, `callback`
   * *   `${param}` 代表参数或者返回值
   * *   `${options}` 代表参数的可选值
   * *   `${component}` 代表组件名字
   * *   `${attribute}` 代表组件属性
   * *   `${option}` 代表组件属性的可选值
   *
   * 例子：
   *
   * **示例：**
   *
   ```js
   Taro.canIUse('openBluetoothAdapter')
   Taro.canIUse('getSystemInfoSync.return.screenWidth')
   Taro.canIUse('getSystemInfo.success.screenWidth')
   Taro.canIUse('showToast.object.image')
   Taro.canIUse('onCompassChange.callback.direction')
   Taro.canIUse('request.object.method.GET')
         Taro.canIUse('live-player')
   Taro.canIUse('text.selectable')
   Taro.canIUse('button.open-type.contact')
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html
   */
  function canIUse(String: any): boolean

  namespace getNetworkType {
    type Promised = {
      /**
       * 网络类型
       */
      networkType: any
    }
    type Param = {}
  }
  /**
   * 获取网络类型。
   *
   * **success返回参数说明：**
   *
   ```javascript
   Taro.getNetworkType({
     success: function(res) {
       // 返回网络类型, 有效值：
       // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
       var networkType = res.networkType
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html
   */
  function getNetworkType(OBJECT?: getNetworkType.Param): Promise<getNetworkType.Promised>

  namespace onNetworkStatusChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 当前是否有网络连接
       */
      isConnected: boolean
      /**
       * 网络类型
       *
       * **networkType 有效值：**
       *
       *   值        |  说明
       * ------------|---------------------
       *   wifi      |  wifi 网络
       *   2g        |  2g 网络
       *   3g        |  3g 网络
       *   4g        |  4g 网络
       *   none      |  无网络
       *   unknown   |Android下不常见的网络类型
       */
      networkType: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听网络状态变化。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onNetworkStatusChange(function(res) {
     console.log(res.isConnected)
     console.log(res.networkType)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkStatusChange.html
   */
  function onNetworkStatusChange(CALLBACK: onNetworkStatusChange.Param): void

  namespace setScreenBrightness {
    type Param = {
      /**
       * 屏幕亮度值，范围 0~1，0 最暗，1 最亮
       */
      value: number
    }
  }
  /**
   * @since 1.2.0
   *
   * 设置屏幕亮度。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setScreenBrightness.html
   */
  function setScreenBrightness(OBJECT: setScreenBrightness.Param): Promise<any>

  namespace getScreenBrightness {
    type Promised = {
      /**
       * 屏幕亮度值，范围 0~1，0 最暗，1 最亮
       */
      value: number
    }
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 获取屏幕亮度。
   *
   * **Bug & Tip：**
   *
   * 1. `tip`: `getScreenBrightness` 接口若安卓系统设置中开启了自动调节亮度功能，则屏幕亮度会根据光线自动调整，该接口仅能获取自动调节亮度之前的值，而非实时的亮度值。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.getScreenBrightness.html
   */
  function getScreenBrightness(OBJECT?: getScreenBrightness.Param): Promise<getScreenBrightness.Promised>

  namespace vibrateLong {
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 使手机发生较长时间的振动（400ms）
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateLong.html
   */
  function vibrateLong(OBJECT?: vibrateLong.Param): Promise<any>

  namespace vibrateShort {
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 使手机发生较短时间的振动（15ms）
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`：`vibrateShort` 接口仅在 iPhone7/iPhone7Plus 及 Android 机型生效
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateShort.html
   */
  function vibrateShort(OBJECT?: vibrateShort.Param): Promise<any>

  namespace onAccelerometerChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * X 轴
       */
      x: number
      /**
       * Y 轴
       */
      y: number
      /**
       * Z 轴
       */
      z: number
    }
  }
  /**
   * 监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 `Taro.stopAccelerometer` 停止监听。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onAccelerometerChange(function(res) {
     console.log(res.x)
     console.log(res.y)
     console.log(res.z)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.onAccelerometerChange.html
   */
  function onAccelerometerChange(CALLBACK: onAccelerometerChange.Param): void

  namespace startAccelerometer {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 开始监听加速度数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startAccelerometer()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.startAccelerometer.html
   */
  function startAccelerometer(OBJECT?: startAccelerometer.Param): Promise<any>

  namespace stopAccelerometer {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 停止监听加速度数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopAccelerometer()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/accelerometer/wx.stopAccelerometer.html
   */
  function stopAccelerometer(OBJECT?: stopAccelerometer.Param): Promise<any>

  namespace onCompassChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 面对的方向度数
       */
      direction: number
    }
  }
  /**
   * 监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用`Taro.stopCompass`停止监听。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onCompassChange(function (res) {
     console.log(res.direction)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.onCompassChange.html
   */
  function onCompassChange(CALLBACK: onCompassChange.Param): void

  namespace startCompass {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 开始监听罗盘数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startCompass()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.startCompass.html
   */
  function startCompass(OBJECT?: startCompass.Param): Promise<any>

  namespace stopCompass {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 停止监听罗盘数据。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopCompass()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/compass/wx.stopCompass.html
   */
  function stopCompass(OBJECT?: stopCompass.Param): Promise<any>

  namespace makePhoneCall {
    type Param = {
      /**
       * 需要拨打的电话号码
       */
      phoneNumber: string
    }
  }
  /**
   *
   * **示例代码：**
   *
   ```javascript
   Taro.makePhoneCall({
     phoneNumber: '1340000' //仅为示例，并非真实的电话号码
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html
   */
  function makePhoneCall(OBJECT: makePhoneCall.Param): Promise<any>

  namespace scanCode {
    type Promised = {
      /**
       * 所扫码的内容
       */
      result: any
      /**
       * 所扫码的类型
       */
      scanType: any
      /**
       * 所扫码的字符集
       */
      charSet: any
      /**
       * 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
       */
      path: any
    }
    type Param = {
      /**
       * 是否只能从相机扫码，不允许从相册选择图片
       *
       * @since 1.2.0
       */
      onlyFromCamera?: boolean
      /**
       * 扫码类型，参数类型是数组，二维码是'qrCode'，一维码是'barCode'，DataMatrix是‘datamatrix’，pdf417是‘pdf417’。
       *
       * @since 1.7.0
       */
      scanType?: any[]
    }
  }
  /**
   * 调起客户端扫码界面，扫码成功后返回对应的结果
   *
   * **示例代码：**
   *
   ```javascript
   // 允许从相机和相册扫码
   Taro.scanCode({
     success: (res) => {
       console.log(res)
     }
   })
         // 只允许从相机扫码
   Taro.scanCode({
     onlyFromCamera: true,
     success: (res) => {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html
   */
  function scanCode(OBJECT?: scanCode.Param): Promise<scanCode.Promised>

  namespace setClipboardData {
    type Param = {
      /**
       * 需要设置的内容
       */
      data: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 设置系统剪贴板的内容
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setClipboardData({
     data: 'data',
     success: function(res) {
       Taro.getClipboardData({
         success: function(res) {
           console.log(res.data) // data
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html
   */
  function setClipboardData(OBJECT: setClipboardData.Param): Promise<any>

  namespace getClipboardData {
    type Promised = {
      /**
       * 剪贴板的内容
       */
      data: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取系统剪贴板内容
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getClipboardData({
     success: function(res){
       console.log(res.data)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.getClipboardData.html
   */
  function getClipboardData(OBJECT?: getClipboardData.Param): Promise<getClipboardData.Promised>

  namespace openBluetoothAdapter {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 初始化小程序蓝牙模块，生效周期为调用`Taro.openBluetoothAdapter`至调用`Taro.closeBluetoothAdapter`或小程序被销毁为止。 在小程序蓝牙适配器模块生效期间，开发者可以正常调用下面的小程序API，并会收到蓝牙模块相关的on回调。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 基础库版本 1.1.0 开始支持，低版本需做[兼容处理](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   * 2.  `tip`: 在没有调用`Taro.openBluetoothAdapter`的情况下调用小程序其它蓝牙模块相关API，API会返回错误，错误码为`10000`
   * 3.  `bug`: 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用`Taro.openBluetoothAdapter`会返回错误，错误码为`10001`，表示手机蓝牙功能不可用；此时小程序蓝牙模块已经初始化完成，可通过`Taro.onBluetoothAdapterStateChange`监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.openBluetoothAdapter({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html
   */
  function openBluetoothAdapter(OBJECT?: openBluetoothAdapter.Param): Promise<any>

  namespace closeBluetoothAdapter {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 关闭蓝牙模块，使其进入未初始化状态。调用该方法将断开所有已建立的链接并释放系统资源。建议在使用小程序蓝牙流程后调用，与`Taro.openBluetoothAdapter`成对调用。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.closeBluetoothAdapter({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.closeBluetoothAdapter.html
   */
  function closeBluetoothAdapter(OBJECT?: closeBluetoothAdapter.Param): Promise<any>

  namespace getBluetoothAdapterState {
    type Promised = {
      /**
       * 是否正在搜索设备
       */
      discovering: boolean
      /**
       * 蓝牙适配器是否可用
       */
      available: boolean
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取本机蓝牙适配器状态
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBluetoothAdapterState({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothAdapterState.html
   */
  function getBluetoothAdapterState(OBJECT?: getBluetoothAdapterState.Param): Promise<getBluetoothAdapterState.Promised>

  namespace onBluetoothAdapterStateChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 蓝牙适配器是否可用
       */
      available: boolean
      /**
       * 蓝牙适配器是否处于搜索状态
       */
      discovering: boolean
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听蓝牙适配器状态变化事件
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onBluetoothAdapterStateChange(function(res) {
     console.log(`adapterState changed, now is`, res)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothAdapterStateChange.html
   */
  function onBluetoothAdapterStateChange(CALLBACK: onBluetoothAdapterStateChange.Param): void

  namespace startBluetoothDevicesDiscovery {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备主 service 的 uuid 列表
       */
      services?: any[]
      /**
       * 是否允许重复上报同一设备， 如果允许重复上报，则onDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同
       */
      allowDuplicatesKey?: boolean
      /**
       * 上报设备的间隔，默认为0，意思是找到新设备立即上报，否则根据传入的间隔上报
       */
      interval?: number
    }
  }
  /**
   * @since 1.1.0
   *
   * 开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索。
   *
   * **示例代码：**
   *
   ```javascript
   // 以微信硬件平台的蓝牙智能灯为例，主服务的 UUID 是 FEE7。传入这个参数，只搜索主服务 UUID 为 FEE7 的设备
   Taro.startBluetoothDevicesDiscovery({
     services: ['FEE7'],
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.startBluetoothDevicesDiscovery.html
   */
  function startBluetoothDevicesDiscovery(OBJECT?: startBluetoothDevicesDiscovery.Param): Promise<startBluetoothDevicesDiscovery.Promised>

  namespace stopBluetoothDevicesDiscovery {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopBluetoothDevicesDiscovery({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.stopBluetoothDevicesDiscovery.html
   */
  function stopBluetoothDevicesDiscovery(OBJECT?: stopBluetoothDevicesDiscovery.Param): Promise<stopBluetoothDevicesDiscovery.Promised>

  namespace getBluetoothDevices {
    type Promised = {
      /**
       * uuid 对应的的已连接设备列表
       */
      devices: PromisedPropDevices
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * uuid 对应的的已连接设备列表
     */
    type PromisedPropDevices = PromisedPropDevicesItem[]
    type PromisedPropDevicesItem = {
      /**
       * 蓝牙设备名称，某些设备可能没有
       */
      name: string
      /**
       * 用于区分设备的 id
       */
      deviceId: string
      /**
       * 当前蓝牙设备的信号强度
       */
      RSSI: number
      /**
       * 当前蓝牙设备的广播数据段中的ManufacturerData数据段 **（注意：vConsole 无法打印出 ArrayBuffer 类型数据）**
       */
      advertisData: ArrayBuffer
      /**
       * 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
       */
      advertisServiceUUIDs: any[]
      /**
       * 当前蓝牙设备的广播数据段中的LocalName数据段
       */
      localName: string
      /**
       * 当前蓝牙设备的广播数据段中的ServiceData数据段
       */
      serviceData: ArrayBuffer
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: Mac系统可能无法获取`advertisData`及`RSSI`，请使用真机调试
   * 2.  `tip`: 开发者工具和 Android 上获取到的`deviceId`为设备 MAC 地址，iOS 上则为设备 uuid。因此`deviceId`不能硬编码到代码中
   * 3.  `tip`: 注意该接口获取到的设备列表为**小程序蓝牙模块生效期间所有搜索到的蓝牙设备**，若在蓝牙模块使用流程结束后未及时调用 Taro.closeBluetoothAdapter 释放资源，会存在调用该接口会返回之前的蓝牙使用流程中搜索到的蓝牙设备，可能设备已经不在用户身边，无法连接。
   * 4.  `tips`: 蓝牙设备在被搜索到时，系统返回的 name 字段一般为广播包中的LocalName字段中的设备名称，而如果与蓝牙设备建立连接，系统返回的 name 字段会改为从蓝牙设备上获取到的GattName。若需要动态改变设备名称并展示，建议使用localName字段。
   *
   * **示例代码：**
   *
   ```javascript
   // ArrayBuffer转16进度字符串示例
   function ab2hex(buffer) {
     var hexArr = Array.prototype.map.call(
       new Uint8Array(buffer),
       function(bit) {
         return ('00' + bit.toString(16)).slice(-2)
       }
     )
     return hexArr.join('');
   }
   Taro.getBluetoothDevices({
     success: function (res) {
       console.log(res)
       if (res.devices[0]) {
         console.log(ab2hex(res.devices[0].advertisData))
       }
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getBluetoothDevices.html
   */
  function getBluetoothDevices(OBJECT?: getBluetoothDevices.Param): Promise<getBluetoothDevices.Promised>

  namespace onBluetoothDeviceFound {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 新搜索到的设备列表
       */
      devices: ParamParamPropDevices
    }
    /**
     * 新搜索到的设备列表
     */
    type ParamParamPropDevices = ParamParamPropDevicesItem[]
    type ParamParamPropDevicesItem = {
      /**
       * 蓝牙设备名称，某些设备可能没有
       */
      name: string
      /**
       * 用于区分设备的 id
       */
      deviceId: string
      /**
       * 当前蓝牙设备的信号强度
       */
      RSSI: number
      /**
       * 当前蓝牙设备的广播数据段中的ManufacturerData数据段 **（注意：vConsole 无法打印出 ArrayBuffer 类型数据）**
       */
      advertisData: ArrayBuffer
      /**
       * 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
       */
      advertisServiceUUIDs: any[]
      /**
       * 当前蓝牙设备的广播数据段中的LocalName数据段
       */
      localName: string
      /**
       * 当前蓝牙设备的广播数据段中的ServiceData数据段
       */
      serviceData: ArrayBuffer
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听寻找到新设备的事件
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: Mac系统可能无法获取`advertisData`及`RSSI`，请使用真机调试
   * 2.  `tip`: 开发者工具和 Android 上获取到的`deviceId`为设备 MAC 地址，iOS 上则为设备 uuid。因此`deviceId`不能硬编码到代码中
   * 3.  `tip`: 若在onBluetoothDeviceFound回调了某个设备，则此设备会添加到 Taro.getBluetoothDevices 接口获取到的数组中
   *
   * **示例代码：**
   *
   ```javascript
   // ArrayBuffer转16进度字符串示例
   function ab2hex(buffer) {
     var hexArr = Array.prototype.map.call(
       new Uint8Array(buffer),
       function(bit) {
         return ('00' + bit.toString(16)).slice(-2)
       }
     )
     return hexArr.join('');
   }
   Taro.onBluetoothDeviceFound(function(devices) {
     console.log('new device list has founded')
     console.dir(devices)
     console.log(ab2hex(devices[0].advertisData))
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.onBluetoothDeviceFound.html
   */
  function onBluetoothDeviceFound(CALLBACK: onBluetoothDeviceFound.Param): void

  namespace getConnectedBluetoothDevices {
    type Promised = {
      /**
       * 搜索到的设备列表
       */
      devices: PromisedPropDevices
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * 搜索到的设备列表
     */
    type PromisedPropDevices = PromisedPropDevicesItem[]
    type PromisedPropDevicesItem = {
      /**
       * 蓝牙设备名称，某些设备可能没有
       */
      name: string
      /**
       * 用于区分设备的 id
       */
      deviceId: string
    }
    type Param = {
      /**
       * 蓝牙设备主 service 的 uuid 列表
       */
      services: any[]
    }
  }
  /**
   * @since 1.1.0
   *
   * 根据 uuid 获取处于已连接状态的设备
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 开发者工具和 Android 上获取到的`deviceId`为设备 MAC 地址，iOS 上则为设备 uuid。因此`deviceId`不能硬编码到代码中
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getConnectedBluetoothDevices({
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.getConnectedBluetoothDevices.html
   */
  function getConnectedBluetoothDevices(OBJECT: getConnectedBluetoothDevices.Param): Promise<getConnectedBluetoothDevices.Promised>

  namespace createBLEConnection {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 getDevices 接口
       */
      deviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 连接低功耗蓝牙设备。
   *
   * > 若小程序在之前已有搜索过某个蓝牙设备，并成功建立链接，可直接传入之前搜索获取的deviceId直接尝试连接该设备，无需进行搜索操作。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 安卓手机上如果多次调用create创建连接，有可能导致系统持有同一设备多个连接的实例，导致调用close的时候并不能真正的断开与设备的连接。因此请保证尽量成对的调用create和close接口
   * 2.  `tip`: 蓝牙链接随时可能断开，建议监听 Taro.onBLEConnectionStateChange 回调事件，当蓝牙设备断开时按需执行重连操作
   * 3.  `tip`: 若对未连接的设备或已断开连接的设备调用数据读写操作的接口，会返回10006错误，详见错误码，建议进行重连操作
   *
   * **示例代码：**
   *
   ```javascript
   Taro.createBLEConnection({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.createBLEConnection.html
   */
  function createBLEConnection(OBJECT: createBLEConnection.Param): Promise<createBLEConnection.Promised>

  namespace closeBLEConnection {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 getDevices 接口
       */
      deviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 断开与低功耗蓝牙设备的连接
   *
   * **示例代码：**
   *
   ```javascript
   Taro.closeBLEConnection({
     deviceId:deviceId
     success: function (res) {
       console.log(res)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.closeBLEConnection.html
   */
  function closeBLEConnection(OBJECT: closeBLEConnection.Param): Promise<closeBLEConnection.Promised>

  namespace onBLEConnectionStateChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 连接目前的状态
       */
      connected: boolean
    }
  }
  /**
   * @since 1.1.1
   *
   * 监听低功耗蓝牙连接状态的改变事件，包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onBLEConnectionStateChange(function(res) {
     // 该方法回调中可以用于处理连接意外断开等异常情况
     console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLEConnectionStateChange.html
   */
  function onBLEConnectionStateChange(CALLBACK: onBLEConnectionStateChange.Param): void

  namespace getBLEDeviceServices {
    type Promised = {
      /**
       * 设备服务列表
       */
      services: PromisedPropServices
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * 设备服务列表
     */
    type PromisedPropServices = PromisedPropServicesItem[]
    type PromisedPropServicesItem = {
      /**
       * 蓝牙设备服务的 uuid
       */
      uuid: string
      /**
       * 该服务是否为主服务
       */
      isPrimary: boolean
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 getDevices 接口
       */
      deviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取蓝牙设备所有 service（服务）
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`:iOS平台上后续对特征值的read、write、notify，由于系统需要获取特征值实例，传入的 serviceId 与 characteristicId 必须由 getBLEDeviceServices 与 getBLEDeviceCharacteristics 中获取到后才能使用。建议双平台统一在建立链接后先执行 getBLEDeviceServices 与 getBLEDeviceCharacteristics 后再进行与蓝牙设备的数据交互
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBLEDeviceServices({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     success: function (res) {
       console.log('device services:', res.services)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceServices.html
   */
  function getBLEDeviceServices(OBJECT: getBLEDeviceServices.Param): Promise<getBLEDeviceServices.Promised>

  namespace getBLEDeviceCharacteristics {
    type Promised = {
      /**
       * 设备特征值列表
       */
      characteristics: PromisedPropCharacteristics
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    /**
     * 设备特征值列表
     */
    type PromisedPropCharacteristics = PromisedPropCharacteristicsItem[]
    type PromisedPropCharacteristicsItem = {
      /**
       * 蓝牙设备特征值的 uuid
       */
      uuid: string
      /**
       * 该特征值支持的操作类型
       */
      properties: PromisedPropCharacteristicsItemPropProperties
    }
    /**
     * 该特征值支持的操作类型
     */
    type PromisedPropCharacteristicsItemPropProperties = {
      /**
       * 该特征值是否支持 read 操作
       */
      read: boolean
      /**
       * 该特征值是否支持 write 操作
       */
      write: boolean
      /**
       * 该特征值是否支持 notify 操作
       */
      notify: boolean
      /**
       * 该特征值是否支持 indicate 操作
       */
      indicate: boolean
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙服务 uuid
       */
      serviceId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取蓝牙设备某个服务中的所有 characteristic（特征值）
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`:传入的serviceId需要在getBLEDeviceServices获取到
   * 2.  `tip`:iOS平台上后续对特征值的read、write、notify，由于系统需要获取特征值实例，传入的 serviceId 与 characteristicId 必须由 getBLEDeviceServices 与 getBLEDeviceCharacteristics 中获取到后才能使用。建议双平台统一在建立链接后先执行 getBLEDeviceServices 与 getBLEDeviceCharacteristics 后再进行与蓝牙设备的数据交互
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getBLEDeviceCharacteristics({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     success: function (res) {
       console.log('device getBLEDeviceCharacteristics:', res.characteristics)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEDeviceCharacteristics.html
   */
  function getBLEDeviceCharacteristics(OBJECT: getBLEDeviceCharacteristics.Param): Promise<getBLEDeviceCharacteristics.Promised>

  namespace readBLECharacteristicValue {
    type Promised = {
      /**
       * 错误码
       */
      errCode: number
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙特征值对应服务的 uuid
       */
      serviceId: string
      /**
       * 蓝牙特征值的 uuid
       */
      characteristicId: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持`read`才可以成功调用，具体参照 characteristic 的 properties 属性
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 并行调用多次读写接口存在读写失败的可能性。
   * 2.  `tip`: `read`接口读取到的信息需要在`onBLECharacteristicValueChange`方法注册的回调中获取。
   *
   * **示例代码：**
   *
   ```javascript
   // 必须在这里的回调才能获取
   Taro.onBLECharacteristicValueChange(function(characteristic) {
     console.log('characteristic value comed:', characteristic)
   })
         Taro.readBLECharacteristicValue({
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接  [  new  ]
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
     characteristicId: characteristicId,
     success: function (res) {
       console.log('readBLECharacteristicValue:', res.errCode)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.readBLECharacteristicValue.html
   */
  function readBLECharacteristicValue(OBJECT: readBLECharacteristicValue.Param): Promise<readBLECharacteristicValue.Promised>

  namespace writeBLECharacteristicValue {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙特征值对应服务的 uuid
       */
      serviceId: string
      /**
       * 蓝牙特征值的 uuid
       */
      characteristicId: string
      /**
       * 蓝牙设备特征值对应的二进制值
       */
      value: ArrayBuffer
    }
  }
  /**
   * @since 1.1.0
   *
   * 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持`write`才可以成功调用，具体参照 characteristic 的 properties 属性
   *
   * _tips: 并行调用多次读写接口存在读写失败的可能性_
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 并行调用多次读写接口存在读写失败的可能性。
   * 2.  `tip`: 小程序不会对写入数据包大小做限制，但系统与蓝牙设备会确定蓝牙4.0单次传输的数据大小，超过最大字节数后会发生写入错误，建议每次写入不超过20字节。
   * 3.  `tip`: 安卓平台上，在调用notify成功后立即调用write接口，在部分机型上会发生 10008 系统错误
   * 4.  `bug`: 若单次写入数据过长，iOS平台上存在系统不会有任何回调的情况(包括错误回调)。
   *
   * **示例代码：**
   *
   ```javascript
   // 向蓝牙设备发送一个0x00的16进制数据
   let buffer = new ArrayBuffer(1)
   let dataView = new DataView(buffer)
   dataView.setUint8(0, 0)
         Taro.writeBLECharacteristicValue({
     // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
     characteristicId: characteristicId,
     // 这里的value是ArrayBuffer类型
     value: buffer,
     success: function (res) {
       console.log('writeBLECharacteristicValue success', res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.writeBLECharacteristicValue.html
   */
  function writeBLECharacteristicValue(OBJECT: writeBLECharacteristicValue.Param): Promise<writeBLECharacteristicValue.Promised>

  namespace notifyBLECharacteristicValueChange {
    type Promised = {
      /**
       * 成功：ok，错误：详细信息
       */
      errMsg: string
    }
    type Param = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 蓝牙特征值对应服务的 uuid
       */
      serviceId: string
      /**
       * 蓝牙特征值的 uuid
       */
      characteristicId: string
      /**
       * true: 启用 notify; false: 停用 notify
       */
      state: boolean
    }
  }
  /**
   * @since 1.1.1
   *
   * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持`notify`或者`indicate`才可以成功调用，具体参照 characteristic 的 properties 属性
   *
   * 另外，必须先启用`notify`才能监听到设备 characteristicValueChange 事件
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 订阅操作成功后需要设备主动更新特征值的value，才会触发 Taro.onBLECharacteristicValueChange 回调。
   * 2.  `tip`: 安卓平台上，在调用notify成功后立即调用write接口，在部分机型上会发生 10008 系统错误
   *
   * **示例代码：**
   *
   ```javascript
   Taro.notifyBLECharacteristicValueChange({
     state: true, // 启用 notify 功能
     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
     deviceId: deviceId,
     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
     serviceId: serviceId,
     // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
     characteristicId: characteristicId,
     success: function (res) {
       console.log('notifyBLECharacteristicValueChange success', res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.notifyBLECharacteristicValueChange.html
   */
  function notifyBLECharacteristicValueChange(OBJECT: notifyBLECharacteristicValueChange.Param): Promise<notifyBLECharacteristicValueChange.Promised>

  namespace onBLECharacteristicValueChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 蓝牙设备 id，参考 device 对象
       */
      deviceId: string
      /**
       * 特征值所属服务 uuid
       */
      serviceId: string
      /**
       * 特征值 uuid
       */
      characteristicId: string
      /**
       * 特征值最新的值 **（注意：vConsole 无法打印出 ArrayBuffer 类型数据）**
       */
      value: ArrayBuffer
    }
  }
  /**
   * @since 1.1.0
   *
   * 监听低功耗蓝牙设备的特征值变化。必须先启用`notify`接口才能接收到设备推送的notification。
   *
   * **示例代码：**
   *
   ```javascript
   // ArrayBuffer转16进度字符串示例
   function ab2hex(buffer) {
     var hexArr = Array.prototype.map.call(
       new Uint8Array(buffer),
       function(bit) {
         return ('00' + bit.toString(16)).slice(-2)
       }
     )
     return hexArr.join('');
   }
   Taro.onBLECharacteristicValueChange(function(res) {
     console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
     console.log(ab2hext(res.value))
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.onBLECharacteristicValueChange.html
   */
  function onBLECharacteristicValueChange(CALLBACK: onBLECharacteristicValueChange.Param): void

  namespace startBeaconDiscovery {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * iBeacon设备广播的 uuids
       */
      uuids: string[]
    }
  }
  /**
   * @since 1.2.0
   *
   * 开始搜索附近的`iBeacon`设备
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startBeaconDiscovery({
       success(res) {
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.startBeaconDiscovery.html
   */
  function startBeaconDiscovery(OBJECT: startBeaconDiscovery.Param): Promise<startBeaconDiscovery.Promised>

  namespace stopBeaconDiscovery {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 停止搜索附近的`iBeacon`设备
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.stopBeaconDiscovery.html
   */
  function stopBeaconDiscovery(OBJECT?: stopBeaconDiscovery.Param): Promise<stopBeaconDiscovery.Promised>

  namespace getBeacons {
    type Promised = {
      /**
       * iBeacon 设备列表
       */
      beacons: PromisedPropBeacons
      /**
       * 调用结果
       */
      errMsg: string
    }
    /**
     * iBeacon 设备列表
     */
    type PromisedPropBeacons = PromisedPropBeaconsItem[]
    type PromisedPropBeaconsItem = {
      /**
       * iBeacon 设备广播的 uuid
       */
      uuid: string
      /**
       * iBeacon 设备的主 id
       */
      major: string
      /**
       * iBeacon 设备的次 id
       */
      minor: string
      /**
       * 表示设备距离的枚举值
       */
      proximity: number
      /**
       * iBeacon 设备的距离
       */
      accuracy: number
      /**
       * 表示设备的信号强度
       */
      rssi: number
    }
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 获取所有已搜索到的`iBeacon`设备
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.getBeacons.html
   */
  function getBeacons(OBJECT?: getBeacons.Param): Promise<getBeacons.Promised>

  namespace onBeaconUpdate {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 当前搜寻到的所有 iBeacon 设备列表
       */
      beacons: ParamParamPropBeacons
    }
    /**
     * 当前搜寻到的所有 iBeacon 设备列表
     */
    type ParamParamPropBeacons = ParamParamPropBeaconsItem[]
    type ParamParamPropBeaconsItem = {
      /**
       * iBeacon 设备广播的 uuid
       */
      uuid: string
      /**
       * iBeacon 设备的主 id
       */
      major: string
      /**
       * iBeacon 设备的次 id
       */
      minor: string
      /**
       * 表示设备距离的枚举值
       */
      proximity: number
      /**
       * iBeacon 设备的距离
       */
      accuracy: number
      /**
       * 表示设备的信号强度
       */
      rssi: number
    }
  }
  /**
   * @since 1.2.0
   *
   * 监听 `iBeacon` 设备的更新事件
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconUpdate.html
   */
  function onBeaconUpdate(CALLBACK: onBeaconUpdate.Param): void

  namespace onBeaconServiceChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 服务目前是否可用
       */
      available: boolean
      /**
       * 目前是否处于搜索状态
       */
      discovering: boolean
    }
  }
  /**
   * @since 1.2.0
   *
   * 监听 `iBeacon` 服务的状态变化
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconServiceChange.html
   */
  function onBeaconServiceChange(CALLBACK: onBeaconServiceChange.Param): void

  namespace setKeepScreenOn {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 是否保持屏幕常亮
       */
      keepScreenOn: boolean
    }
  }
  /**
   * @since 1.4.0
   *
   * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效。
   *
   * **示例代码：**
   *
   ```javascript
   // 保持屏幕常亮
   Taro.setKeepScreenOn({
       keepScreenOn: true
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setKeepScreenOn.html
   */
  function setKeepScreenOn(OBJECT: setKeepScreenOn.Param): Promise<setKeepScreenOn.Promised>

  /**
   * @since 1.4.0
   *
   * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onUserCaptureScreen(function(res) {
       console.log('用户截屏了')
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.onUserCaptureScreen.html
   */
  function onUserCaptureScreen(CALLBACK: any): void

  namespace addPhoneContact {
    type Param = {
      /**
       * 头像本地文件路径
       */
      photoFilePath?: string
      /**
       * 昵称
       */
      nickName?: string
      /**
       * 姓氏
       */
      lastName?: string
      /**
       * 中间名
       */
      middleName?: string
      /**
       * 名字
       */
      firstName: string
      /**
       * 备注
       */
      remark?: string
      /**
       * 手机号
       */
      mobilePhoneNumber?: string
      /**
       * 微信号
       */
      weChatNumber?: string
      /**
       * 联系地址国家
       */
      addressCountry?: string
      /**
       * 联系地址省份
       */
      addressState?: string
      /**
       * 联系地址城市
       */
      addressCity?: string
      /**
       * 联系地址街道
       */
      addressStreet?: string
      /**
       * 联系地址邮政编码
       */
      addressPostalCode?: string
      /**
       * 公司
       */
      organization?: string
      /**
       * 职位
       */
      title?: string
      /**
       * 工作传真
       */
      workFaxNumber?: string
      /**
       * 工作电话
       */
      workPhoneNumber?: string
      /**
       * 公司电话
       */
      hostNumber?: string
      /**
       * 电子邮件
       */
      email?: string
      /**
       * 网站
       */
      url?: string
      /**
       * 工作地址国家
       */
      workAddressCountry?: string
      /**
       * 工作地址省份
       */
      workAddressState?: string
      /**
       * 工作地址城市
       */
      workAddressCity?: string
      /**
       * 工作地址街道
       */
      workAddressStreet?: string
      /**
       * 工作地址邮政编码
       */
      workAddressPostalCode?: string
      /**
       * 住宅传真
       */
      homeFaxNumber?: string
      /**
       * 住宅电话
       */
      homePhoneNumber?: string
      /**
       * 住宅地址国家
       */
      homeAddressCountry?: string
      /**
       * 住宅地址省份
       */
      homeAddressState?: string
      /**
       * 住宅地址城市
       */
      homeAddressCity?: string
      /**
       * 住宅地址街道
       */
      homeAddressStreet?: string
      /**
       * 住宅地址邮政编码
       */
      homeAddressPostalCode?: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 调用后，用户可以选择将该表单以“新增联系人”或“添加到已有联系人”的方式，写入手机系统通讯录，完成手机通讯录联系人和联系方式的增加。
   *
   * **回调结果：**
   *
   *   回调类型  |  errMsg           |  说明
   * ------------|-------------------|-----------------------
   *   success   |  ok               |  添加成功
   *   fail      |  fail cancel      |  用户取消操作
   *   fail      |  fail ${detail}   |调用失败，detail 加上详细信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/contact/wx.addPhoneContact.html
   */
  function addPhoneContact(OBJECT: addPhoneContact.Param): Promise<any>

  namespace getHCEState {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       */
      errCode: number
    }
    type Param = {}
  }
  /**
   * @since 1.7.0
   *
   * 判断当前设备是否支持 HCE 能力。
   *
   * **success返回参数说明：**
   *
   ```javascript
   Taro.getHCEState({
     success: function(res) {
       console.log(res.errCode)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.getHCEState.html
   */
  function getHCEState(OBJECT?: getHCEState.Param): Promise<getHCEState.Promised>

  namespace startHCE {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       */
      errCode: number
    }
    type Param = {
      /**
       * 需要注册到系统的 AID 列表，每个 AID 为 String 类型
       */
      aid_list: any[]
    }
  }
  /**
   * @since 1.7.0
   *
   * 初始化 NFC 模块。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startHCE({
     aid_list: ['F222222222']
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.startHCE.html
   */
  function startHCE(OBJECT: startHCE.Param): Promise<startHCE.Promised>

  namespace stopHCE {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       */
      errCode: number
    }
    type Param = {}
  }
  /**
   * @since 1.7.0
   *
   * 关闭 NFC 模块。仅在安卓系统下有效。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopHCE({
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.stopHCE.html
   */
  function stopHCE(OBJECT?: stopHCE.Param): Promise<stopHCE.Promised>

  namespace onHCEMessage {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 消息类型
       */
      messageType: number
      /**
       * 客户端接收到 NFC 设备的指令，此参数当且仅当 `messageType=1` 时有效
       */
      data: ArrayBuffer
      /**
       * 此参数当且仅当 `messageType=2` 时有效
       */
      reason: number
    }
  }
  /**
   * @since 1.7.0
   *
   * 监听 NFC 设备的消息回调，并在回调中处理。返回参数中 `messageType` 表示消息类型，目前有如下值：
   *
   * *   1：消息为HCE Apdu Command类型，小程序需对此指令进行处理，并调用 `sendHCEMessage` 接口返回处理指令；
   * *   2：消息为设备离场事件
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.onHCEMessage.html
   */
  function onHCEMessage(CALLBACK: onHCEMessage.Param): void

  namespace sendHCEMessage {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 错误码
       *
       * **errCode列表：**
       *
       * 每个接口调用的时候，都会返回 `errCode` 字段。
       *
       *   错误码  |  说明
       * ----------|---------------------------
       *   0       |  Ok
       *   13000   |  当前设备不支持 NFC
       *   13001   |当前设备支持 NFC，但系统NFC开关未开启
       *   13002   |当前设备支持 NFC，但不支持HCE
       *   13003   |  AID 列表参数格式错误
       *   13004   |未设置微信为默认NFC支付应用
       *   13005   |  返回的指令不合法
       *   13006   |  注册 AID 失败
       */
      errCode: number
    }
    type Param = {
      /**
       * 二进制数据
       */
      data: ArrayBuffer
    }
  }
  /**
   * @since 1.7.0
   *
   * 发送 NFC 消息。仅在安卓系统下有效。
   *
   * **success返回参数说明：**
   *
   ```javascript
   const buffer = new ArrayBuffer(1)
   const dataView = new DataView(buffer)
   dataView.setUint8(0, 0)
         Taro.startHCE({
     success: function(res) {
       Taro.onHCEMessage(function(res) {
         if (res.messageType === 1) {
           Taro.sendHCEMessage({data: buffer})
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.sendHCEMessage.html
   */
  function sendHCEMessage(OBJECT: sendHCEMessage.Param): Promise<sendHCEMessage.Promised>

  namespace startWifi {
    type Param = {}
  }
  /**
   * @since 1.6.0
   *
   * 初始化 Wi-Fi 模块。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startWifi({
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.startWifi.html
   */
  function startWifi(OBJECT?: startWifi.Param): Promise<any>

  namespace stopWifi {
    type Param = {}
  }
  /**
   * @since 1.6.0
   *
   * 关闭 Wi-Fi 模块。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.stopWifi({
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.stopWifi.html
   */
  function stopWifi(OBJECT?: stopWifi.Param): Promise<any>

  namespace connectWifi {
    type Param = {
      /**
       * Wi-Fi 设备ssid
       */
      SSID: string
      /**
       * Wi-Fi 设备bssid
       */
      BSSID: string
      /**
       * Wi-Fi 设备密码
       */
      password?: string
    }
  }
  /**
   * @since 1.6.0
   *
   * 连接 Wi-Fi。若已知 Wi-Fi 信息，可以直接利用该接口连接。仅 Android 与 iOS 11 以上版本支持。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.connectWifi({
     SSID: '',
     BSSID: '',
     success: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html
   */
  function connectWifi(OBJECT: connectWifi.Param): Promise<any>

  namespace getWifiList {
    type Param = {}
  }
  /**
   * @since 1.6.0
   *
   * 请求获取 Wi-Fi 列表，在 `onGetWifiList` 注册的回调中返回 wifiList 数据。iOS 将跳转到系统的 Wi-Fi 界面，Android 不会跳转。 **iOS 11.0 及 iOS 11.1 两个版本因系统问题，该方法失效。但在 iOS 11.2 中已修复。**
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getWifiList.html
   */
  function getWifiList(OBJECT?: getWifiList.Param): Promise<any>

  namespace onGetWifiList {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * Wi-Fi 列表数据
       */
      wifiList: ParamParamPropWifiList
    }
    /**
     * Wi-Fi 列表数据
     */
    type ParamParamPropWifiList = ParamParamPropWifiListItem[]
    type ParamParamPropWifiListItem = {
      /**
       * Wi-Fi 的SSID
       */
      SSID: string
      /**
       * Wi-Fi 的BSSID
       */
      BSSID: string
      /**
       * Wi-Fi 是否安全
       */
      secure: boolean
      /**
       * Wi-Fi 信号强度
       */
      signalStrength: number
    }
  }
  /**
   * @since 1.6.0
   *
   * 监听在获取到 Wi-Fi 列表数据时的事件，在回调中将返回 wifiList。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onGetWifiList.html
   */
  function onGetWifiList(CALLBACK: onGetWifiList.Param): void

  namespace setWifiList {
    type Param = {
      /**
       * 提供预设的 Wi-Fi 信息列表
       */
      wifiList: ParamPropWifiList
    }
    /**
     * 提供预设的 Wi-Fi 信息列表
     */
    type ParamPropWifiList = ParamPropWifiListItem[]
    type ParamPropWifiListItem = {
      /**
       * Wi-Fi 设备ssid
       */
      SSID: string
      /**
       * Wi-Fi 设备bssid
       */
      BSSID: string
      /**
       * Wi-Fi 设备密码
       */
      password: string
    }
  }
  /**
   * @since 1.6.0
   *
   * **iOS特有接口** 在 `onGetWifiList` 回调后，利用接口设置 wifiList 中 AP 的相关信息。
   *
   * 注意：
   *
   * 1.  该接口只能在 `onGetWifiList` 回调之后才能调用。
   * 2.  此时客户端会挂起，等待小程序设置 Wi-Fi 信息，请务必尽快调用该接口，若无数据请传入一个空数组。
   * 3.  有可能随着周边 Wi-Fi 列表的刷新，单个流程内收到多次带有存在重复的 Wi-Fi 列表的回调。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.onGetWifiList(function(res) {
     if (res.wifiList.length) {
       Taro.setWifiList({
         wifiList: [{
           SSID: res.wifiList[0].SSID,
           BSSID: res.wifiList[0].BSSID,
           password: '123456'
         }]
       })
     } else {
       Taro.setWifiList({
         wifiList: []
       })
     }
   })
   Taro.getWifiList()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.setWifiList.html
   */
  function setWifiList(OBJECT: setWifiList.Param): Promise<any>

  namespace onWifiConnected {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * Wi-Fi 信息
       */
      wifi: ParamParamPropWifi
    }
    /**
     * Wi-Fi 信息
     */
    type ParamParamPropWifi = {
      /**
       * Wi-Fi 的SSID
       */
      SSID: string
      /**
       * Wi-Fi 的BSSID
       */
      BSSID: string
      /**
       * Wi-Fi 是否安全
       */
      secure: boolean
      /**
       * Wi-Fi 信号强度
       */
      signalStrength: number
    }
  }
  /**
   * @since 1.6.0
   *
   * 监听连接上 Wi-Fi 的事件。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onWifiConnected.html
   */
  function onWifiConnected(CALLBACK: onWifiConnected.Param): void

  namespace getConnectedWifi {
    type Promised = {
      /**
       * Wi-Fi 信息
       */
      wifi: PromisedPropWifi
    }
    /**
     * Wi-Fi 信息
     */
    type PromisedPropWifi = {
      /**
       * Wi-Fi 的SSID
       */
      SSID: string
      /**
       * Wi-Fi 的BSSID
       */
      BSSID: string
      /**
       * Wi-Fi 是否安全
       */
      secure: boolean
      /**
       * Wi-Fi 信号强度
       */
      signalStrength: number
    }
    type Param = {}
  }
  /**
   * @since 1.6.0
   *
   * 获取已连接中的 Wi-Fi 信息
   *
   * **errCode列表：**
   *
   * 每个接口调用的时候，都会返回 `errCode` 字段。
   *
   *   错误码  |  说明                    |  备注
   * ----------|--------------------------|------------------------------
   *   0       |  ok                      |  正常
   *   12000   |  not init                |  未先调用startWifi接口
   *   12001   |  system not support      |  当前系统不支持相关能力
   *   12002   |  password error          |  Wi-Fi 密码错误
   *   12003   |  connection timeout      |  连接超时
   *   12004   |  duplicate request       |  重复连接 Wi-Fi
   *   12005   |  wifi not turned on      |Android特有，未打开 Wi-Fi 开关
   *   12006   |  gps not turned on       |Android特有，未打开 GPS 定位开关
   *   12007   |  user denied             |  用户拒绝授权链接 Wi-Fi
   *   12008   |  invalid SSID            |  无效SSID
   *   12009   |  system config err       | 系统运营商配置拒绝连接 Wi-Fi
   *   12010   |  system internal error   |系统其他错误，需要在errmsg打印具体的错误原因
   *   12011   |  weapp in background     |  应用在后台无法配置 Wi-Fi
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getConnectedWifi.html
   */
  function getConnectedWifi(OBJECT?: getConnectedWifi.Param): Promise<getConnectedWifi.Promised>

  namespace showToast {
    type Param = {
      /**
       * 提示的内容
       */
      title: string
      /**
       * 图标，有效值 "success", "loading", "none"
       *
       * **icon有效值：**
       *
       *   有效值    |  说明                                 | 最低版本
       * ------------|---------------------------------------|----------
       *   success   |显示成功图标，此时 title 文本最多显示 7 个汉字长度。默认值|
       *   loading   |显示加载图标，此时 title 文本最多显示 7 个汉字长度。|
       *   none      |不显示图标，此时 title 文本最多可显示两行|  1.9.0
       */
      icon?: string
      /**
       * 自定义图标的本地路径，image 的优先级高于 icon
       *
       * @since 1.1.0
       */
      image?: string
      /**
       * 提示的延迟时间，单位毫秒，默认：1500
       */
      duration?: number
      /**
       * 是否显示透明蒙层，防止触摸穿透，默认：false
       */
      mask?: boolean
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 显示消息提示框
   *
   * **示例代码：**
   *
   ```javascript
   Taro.showToast({
     title: '成功',
     icon: 'success',
     duration: 2000
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
   */
  function showToast(OBJECT: showToast.Param): Promise<any>

  namespace showLoading {
    type Param = {
      /**
       * 提示的内容
       */
      title: string
      /**
       * 是否显示透明蒙层，防止触摸穿透，默认：false
       */
      mask?: boolean
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * @since 1.1.0
   *
   * 显示 loading 提示框, 需主动调用 [Taro.hideLoading](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideLoading.html) 才能关闭提示框
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html
   */
  function showLoading(OBJECT?: showLoading.Param): Promise<any>

  /**
   * 隐藏消息提示框
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideToast.html
   */
  function hideToast(): void

  /**
   * @since 1.1.0
   *
   * 隐藏 loading 提示框
   *
   * **示例：**
   *
   ```javascript
   Taro.showLoading({
     title: '加载中',
   })
         setTimeout(function(){
     Taro.hideLoading()
   },2000)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideLoading.html
   */
  function hideLoading(): void

  namespace showModal {
    type Promised = {
      /**
       * 为 true 时，表示用户点击了确定按钮
       */
      confirm: boolean
      /**
       * 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
       *
       * @since 1.1.0
       */
      cancel: boolean
    }
    type Param = {
      /**
       * 提示的标题
       */
      title: string
      /**
       * 提示的内容
       */
      content: string
      /**
       * 是否显示取消按钮，默认为 true
       */
      showCancel?: boolean
      /**
       * 取消按钮的文字，默认为"取消"，最多 4 个字符
       */
      cancelText?: string
      /**
       * 取消按钮的文字颜色，默认为"#000000"
       */
      cancelColor?: string
      /**
       * 确定按钮的文字，默认为"确定"，最多 4 个字符
       */
      confirmText?: string
      /**
       * 确定按钮的文字颜色，默认为"#3CC51F"
       */
      confirmColor?: string
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * ​显示模态弹窗
   *
   * **示例代码：**
   *
   ```javascript
   Taro.showModal({
     title: '提示',
     content: '这是一个模态弹窗',
     success: function(res) {
       if (res.confirm) {
         console.log('用户点击确定')
       } else if (res.cancel) {
         console.log('用户点击取消')
       }
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
   */
  function showModal(OBJECT: showModal.Param): Promise<showModal.Promised>

  namespace showActionSheet {
    type Promised = {
      /**
       * 用户点击的按钮，从上到下的顺序，从0开始
       */
      tapIndex: number
    }
    type Param = {
      /**
       * 按钮的文字数组，数组长度最大为6个
       */
      itemList: string[]
      /**
       * 按钮的文字颜色，默认为"#000000"
       */
      itemColor?: string
      /**
       * 接口调用成功的回调函数
       */
      success?: Param0PropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: Param0PropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: Param0PropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type Param0PropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type Param0PropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type Param0PropComplete = () => any
  }
  /**
   * ​显示操作菜单
   *
   * **Bug & Tip：**
   *
   * 1.  `bug`: `Android` `6.3.30`，Taro.showModal 的返回的 confirm 一直为 true；
   * 2.  `tip`: Taro.showActionSheet 点击取消或蒙层时，回调 `fail`, errMsg 为 "showActionSheet:fail cancel"；
   * 3.  `tip`: Taro.showLoading 和 Taro.showToast 同时只能显示一个，但 Taro.hideToast/Taro.hideLoading 也应当配对使用；
   * 4.  `tip`: `iOS` Taro.showModal 点击蒙层不会关闭模态弹窗，所以尽量避免使用“取消”分支中实现业务逻辑。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.showActionSheet({
     itemList: ['A', 'B', 'C'],
     success: function(res) {
       console.log(res.tapIndex)
     },
     fail: function(res) {
       console.log(res.errMsg)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showActionSheet.html
   */
  function showActionSheet(OBJECT: showActionSheet.Param): Promise<showActionSheet.Promised>

  namespace setTopBarText {
    type Param = {
      /**
       * 置顶栏文字内容
       */
      text: string
    }
  }
  /**
   * @since 1.4.3
   *
   * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容。**注意：调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，会回调 fail，errMsg："setTopBarText: fail invoke too frequently"**
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setTopBarText({
     text: 'hello, world!'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/sticky/wx.setTopBarText.html
   */
  function setTopBarText(OBJECT: setTopBarText.Param): Promise<any>

  namespace setNavigationBarTitle {
    type Param = {
      /**
       * 页面标题
       */
      title: string
    }
  }
  /**
   * 动态设置当前页面的标题。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setNavigationBarTitle({
     title: '当前页面'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarTitle.html
   */
  function setNavigationBarTitle(OBJECT: setNavigationBarTitle.Param): Promise<any>

  /**
   * 在当前页面显示导航条加载动画。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.showNavigationBarLoading.html
   */
  function showNavigationBarLoading(): void

  /**
   * 隐藏导航条加载动画。
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideNavigationBarLoading.html
   */
  function hideNavigationBarLoading(): void

  namespace setNavigationBarColor {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
       */
      frontColor: string
      /**
       * 背景颜色值，有效值为十六进制颜色
       */
      backgroundColor: string
      /**
       * 动画效果
       *
       * **animation.timingFunc 有效值：**
       *
       *   值          |  说明
       * --------------|-------------------
       *   linear      |动画从头到尾的速度是相同的。
       *   easeIn      |  动画以低速开始
       *   easeOut     |  动画以低速结束。
       *   easeInOut   |动画以低速开始和结束。
       */
      animation?: ParamPropAnimation
    }
    /**
     * 动画效果
     *
     * **animation.timingFunc 有效值：**
     *
     * 值          |  说明
     * --------------|-------------------
     * linear      |动画从头到尾的速度是相同的。
     * easeIn      |  动画以低速开始
     * easeOut     |  动画以低速结束。
     * easeInOut   |动画以低速开始和结束。
     */
    type ParamPropAnimation = {
      /**
       * 动画变化时间，默认0，单位：毫秒
       */
      duration?: number
      /**
       * 动画变化方式，默认 linear
       */
      timingFunc?: string
    }
  }
  /**
   * @since 1.4.0
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setNavigationBarColor({
       frontColor: '#ffffff',
       backgroundColor: '#ff0000',
       animation: {
           duration: 400,
           timingFunc: 'easeIn'
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarColor.html
   */
  function setNavigationBarColor(OBJECT: setNavigationBarColor.Param): Promise<setNavigationBarColor.Promised>

  namespace setBackgroundTextStyle {
    type Param = {
      /**
       * 下拉背景字体、loading 图的样式。
       */
      textStyle: 'dark' | 'light'
    }
  }

  /**
   * @since 2.1.0
   *
   * 动态设置下拉背景字体、loading 图的样式
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setBackgroundTextStyle({
     textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundTextStyle.html
   */
  function setBackgroundTextStyle(OBJECT: setBackgroundTextStyle.Param): Promise<any>

  namespace setBackgroundColor {
    type Param = {
      /**
       * 窗口的背景色，必须为十六进制颜色值
       */
      backgroundColor?: string
      /**
       * 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
       */
      backgroundColorTop?: string
      /**
       * 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
       */
      backgroundColorBottom?: string
    }
  }

  /**
   * @since 2.1.0
   *
   * 动态设置窗口的背景色
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setBackgroundColor({
     backgroundColor: '#ffffff', // 窗口的背景色为白色
     backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
     backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundColor.html
   */
  function setBackgroundColor(OBJECT: setBackgroundColor.Param): Promise<any>

  namespace setTabBarBadge {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
      /**
       * 显示的文本，超过 3 个字符则显示成“…”
       */
      text: string
    }
  }
  /**
   * @since 1.9.0
   *
   * 为 tabBar 某一项的右上角添加文本
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setTabBarBadge({
     index: 0,
     text: '1'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html
   */
  function setTabBarBadge(OBJECT: setTabBarBadge.Param): Promise<any>

  namespace removeTabBarBadge {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 移除 tabBar 某一项右上角的文本
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.removeTabBarBadge.html
   */
  function removeTabBarBadge(OBJECT: removeTabBarBadge.Param): Promise<any>

  namespace showTabBarRedDot {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 显示 tabBar 某一项的右上角的红点
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.showTabBarRedDot.html
   */
  function showTabBarRedDot(OBJECT: showTabBarRedDot.Param): Promise<any>

  namespace hideTabBarRedDot {
    type Param = {
      /**
       * tabBar的哪一项，从左边算起
       */
      index: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 隐藏 tabBar 某一项的右上角的红点
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.hideTabBarRedDot.html
   */
  function hideTabBarRedDot(OBJECT: hideTabBarRedDot.Param): Promise<any>

  namespace setTabBarStyle {
    type Param = {
      /**
       * tab 上的文字默认颜色
       */
      color?: string
      /**
       * tab 上的文字选中时的颜色
       */
      selectedColor?: string
      /**
       * tab 的背景色
       */
      backgroundColor?: string
      /**
       * tabbar上边框的颜色， 仅支持 black/white
       */
      borderStyle?: string
    }
  }
  /**
   * @since 1.9.0
   *
   * 动态设置 tabBar 的整体样式
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setTabBarStyle({
       color: '#FF0000',
       selectedColor: '#00FF00',
       backgroundColor: '#0000FF',
       borderStyle: 'white'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarStyle.html
   */
  function setTabBarStyle(OBJECT?: setTabBarStyle.Param): Promise<any>

  namespace setTabBarItem {
    type Param = {
      /**
       * tabBar 的哪一项，从左边算起
       */
      index: number
      /**
       * tab 上按钮文字
       */
      text?: string
      /**
       * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
       */
      iconPath?: string
      /**
       * 选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
       */
      selectedIconPath?: string
    }
  }
  /**
   * @since 1.9.0
   *
   * 动态设置 tabBar 某一项的内容
   *
   * **示例代码：**
   *
   ```javascript
   Taro.setTabBarItem({
       index: 0,
       text: 'text',
       iconPath: '/path/to/iconPath',
       selectedIconPath: '/path/to/selectedIconPath'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarItem.html
   */
  function setTabBarItem(OBJECT: setTabBarItem.Param): Promise<any>

  namespace showTabBar {
    type Param = {
      /**
       * 是否需要动画效果，默认无
       */
      animation?: boolean
    }
  }
  /**
   * @since 1.9.0
   *
   * 显示 tabBar
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.showTabBar.html
   */
  function showTabBar(OBJECT?: showTabBar.Param): Promise<any>

  namespace hideTabBar {
    type Param = {
      /**
       * 是否需要动画效果，默认无
       */
      animation?: boolean
    }
  }
  /**
   * @since 1.9.0
   *
   * 隐藏 tabBar
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.hideTabBar.html
   */
  function hideTabBar(OBJECT?: hideTabBar.Param): Promise<any>

  namespace getMenuButtonBoundingClientRect {
    type Return = {
      /**
       * 宽度，单位：px
       */
      width: number
      /**
       * 高度，单位：px
       */
      height: number
      /**
       * 	上边界坐标，单位：px
       */
      top: number
      /**
       * 	右边界坐标，单位：px
       */
      right: number
      /**
       * 	下边界坐标，单位：px
       */
      bottom: number
      /**
       * 	左边界坐标，单位：px
       */
      left: number
    }
  }
  /**
   * @since 2.1.0
   *
   * 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html
   */
  function getMenuButtonBoundingClientRect(): getMenuButtonBoundingClientRect.Return

  namespace navigateTo {
    type Param = {
      /**
       * 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔；如 'path?key=value&key2=value2'
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 保留当前页面，跳转到应用内的某个页面，使用`Taro.navigateBack`可以返回到原页面。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.navigateTo({
     url: 'test?id=1'
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   //test.js
   Page({
     onLoad: function(option){
       console.log(option.query)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
   */
  function navigateTo(OBJECT: navigateTo.Param): Promise<any>

  namespace redirectTo {
    type Param = {
      /**
       * 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔；如 'path?key=value&key2=value2'
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 关闭当前页面，跳转到应用内的某个页面。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.redirectTo({
     url: 'test?id=1'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html
   */
  function redirectTo(OBJECT: redirectTo.Param): Promise<any>

  namespace reLaunch {
    type Param = {
      /**
       * 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用`?`分隔，参数键与参数值用`=`相连，不同参数用`&`分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * @since 1.1.0
   *
   * 关闭所有页面，打开到应用内的某个页面。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.reLaunch({
     url: 'test?id=1'
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   //test.js
   Page({
     onLoad: function(option){
       console.log(option.query)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html
   */
  function reLaunch(OBJECT: reLaunch.Param): Promise<any>

  namespace switchTab {
    type Param = {
      /**
       * 需要跳转的 tabBar 页面的路径（需在 app.json 的 [tabBar](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#tabbar) 字段定义的页面），路径后不能带参数
       */
      url: string
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   *
   * **示例代码：**
   *
   ```json
   {
     "tabBar": {
       "list": [{
         "pagePath": "index",
         "text": "首页"
       },{
         "pagePath": "other",
         "text": "其他"
       }]
     }
   }
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Taro.switchTab({
     url: '/index'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
   */
  function switchTab(OBJECT: switchTab.Param): Promise<any>

  namespace navigateBack {
    type Param = {
      /**
       * 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
       *
       * @default 1
       */
      delta?: number
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 [`getCurrentPages()`](https://developers.weixin.qq.com/miniprogram/dev/reference/api/getCurrentPages.html) 获取当前的页面栈，决定需要返回几层。
   *
   * **Tip：**
   *
   * 1.  `tip`: Taro.navigateTo 和 Taro.redirectTo 不允许跳转到 tabbar 页面，只能用 Taro.switchTab 跳转到 tabbar 页面
   *
   * **示例代码：**
   *
   ```javascript
   // 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码
         // 此处是A页面
   Taro.navigateTo({
     url: 'B?id=1'
   })
         // 此处是B页面
   Taro.navigateTo({
     url: 'C?id=1'
   })
         // 在C页面内 navigateBack，将返回A页面
   Taro.navigateBack({
     delta: 2
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html
   */
  function navigateBack(OBJECT?: navigateBack.Param): Promise<any>

  namespace createAnimation {
    type Param = {
      /**
       * 动画持续时间，单位ms
       *
       * @default 400
       */
      duration?: number
      /**
       * 定义动画的效果
       *
       * **timingFunction 有效值：**
       *
       *   值            |  说明
       * ----------------|--------------------------
       *   linear        |动画从头到尾的速度是相同的
       *   ease          |动画以低速开始，然后加快，在结束前变慢
       *   ease-in       |  动画以低速开始
       *   ease-in-out   |  动画以低速开始和结束
       *   ease-out      |  动画以低速结束
       *   step-start    |动画第一帧就跳至结束状态直到结束
       *   step-end      |动画一直保持开始状态，最后一帧跳到结束状态
       *
       * @default linear
       */
      timingFunction?: string
      /**
       * 动画延迟时间，单位 ms
       *
       * @default 0
       */
      delay?: number
      /**
       * 设置transform-origin
       *
       * @default 50% 50% 0
       */
      transformOrigin?: string
    }
  }
  /**
   * 创建一个动画实例[animation](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/Animation.html)。调用实例的方法来描述动画。最后通过动画实例的`export`方法导出动画数据传递给组件的`animation`属性。
   *
   * **注意: `export` 方法每次调用后会清掉之前的动画操作**
   *
   * **timingFunction 有效值：**
   *
   ```javascript
   var animation = Taro.createAnimation({
     transformOrigin: "50% 50%",
     duration: 1000,
     timingFunction: "ease",
     delay: 0
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html
   */
  function createAnimation(OBJECT: createAnimation.Param): Animation

  class Animation {
    /**
     * 导出动画队列
     * export 方法每次调用后会清掉之前的动画操作
     */
    export(): object[]
    /**
     * 表示一组动画完成
     * 可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画
     * @param obj
     */
    step(obj: object): any
    /**
     * 透明度，参数范围 0~1
     */
    opacity(value: any): any
    /**
     * 颜色值
     */
    backgroundColor(color: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    width(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    height(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    top(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    left(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    bottom(length: any): any
    /**
     * 长度值，如果传入 Number 则默认使用 px，可传入其他自定义单位的长度值
     */
    right(length: any): any
    /**
     * deg的范围-180~180，从原点顺时针旋转一个deg角度
     */
    rotate(deg: any): any
    /**
     * deg的范围-180~180，在X轴旋转一个deg角度
     */
    rotateX(deg: any): any
    /**
     * deg的范围-180~180，在Y轴旋转一个deg角度
     */
    rotateY(deg: any): any
    /**
     * deg的范围-180~180，在Z轴旋转一个deg角度
     */
    rotateZ(deg: any): any
    /**
     * 同[transform-function rotate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d)
     */
    rotate3d(x: any, y: any, z: any, deg: any): any
    /**
     * 一个参数时，表示在X轴、Y轴同时缩放sx倍数；两个参数时表示在X轴缩放sx倍数，在Y轴缩放sy倍数
     */
    scale(sx: any, sy?: any): any
    /**
     * 在X轴缩放sx倍数
     */
    scaleX(sx: any): any
    /**
     * 在Y轴缩放sy倍数
     */
    scaleY(sy: any): any
    /**
     * 在Z轴缩放sy倍数
     */
    scaleZ(sz: any): any
    /**
     * 在X轴缩放sx倍数，在Y轴缩放sy倍数，在Z轴缩放sz倍数
     */
    scale3d(sx: any, sy: any, sz: any): any
    /**
     * 一个参数时，表示在X轴偏移tx，单位px；两个参数时，表示在X轴偏移tx，在Y轴偏移ty，单位px。
     */
    translate(tx: any, ty?: any): any
    /**
     * 在X轴偏移tx，单位px
     */
    translateX(tx: any): any
    /**
     * 在Y轴偏移tx，单位px
     */
    translateY(ty: any): any
    /**
     * 在Z轴偏移tx，单位px
     */
    translateZ(tz: any): any
    /**
     * 在X轴偏移tx，在Y轴偏移ty，在Z轴偏移tz，单位px
     */
    translate3d(tx: any, ty: any, tz: any): any
    /**
     * 参数范围-180~180；一个参数时，Y轴坐标不变，X轴坐标延顺时针倾斜ax度；两个参数时，分别在X轴倾斜ax度，在Y轴倾斜ay度
     */
    skew(ax: any, ay?: any): any
    /**
     * 参数范围-180~180；Y轴坐标不变，X轴坐标延顺时针倾斜ax度
     */
    skewX(ax: any): any
    /**
     * 参数范围-180~180；X轴坐标不变，Y轴坐标延顺时针倾斜ay度
     */
    skewY(ay: any): any
    /**
     * 同[transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix)
     */
    matrix(a: any, b: any, c: any, d: any, tx: any, ty: any): any
    /**
     * 同[transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d)
     */
    matrix3d(): any
  }
  namespace pageScrollTo {
    type Param = {
      /**
       * 滚动到页面的目标位置（单位px）
       */
      scrollTop: number
      /**
       * 滚动动画的时长，默认300ms，单位 ms
       */
      duration?: number
    }
  }
  /**
   * @since 1.4.0
   *
   * 将页面滚动到目标位置。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.pageScrollTo({
     scrollTop: 0,
     duration: 300
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/scroll/wx.pageScrollTo.html
   */
  function pageScrollTo(OBJECT: pageScrollTo.Param): void

  /**
   * @since 微信小程序 2.7.0
   *
   * 创建离屏 canvas 实例
   */
  function createOffscreenCanvas(): OffscreenCanvas

  /**
   *
   * **定义：**
   *
   * 创建 canvas 绘图上下文（指定 canvasId）。在自定义组件下，第二个参数传入组件实例this，以操作组件内 `<canvas/>` 组件
   *
   * **Tip**: 需要指定 canvasId，该绘图上下文只作用于对应的 `<canvas/>`
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.createCanvasContext.html
   */
  function createCanvasContext(canvasId: string, componentInstance: any): CanvasContext

  namespace canvasToTempFilePath {
    type Param0 = {
      /**
       * 画布x轴起点（默认0）
       *
       * @since 1.2.0
       */
      x?: number
      /**
       * 画布y轴起点（默认0）
       *
       * @since 1.2.0
       */
      y?: number
      /**
       * 画布宽度（默认为canvas宽度-x）
       *
       * @since 1.2.0
       */
      width?: number
      /**
       * 画布高度（默认为canvas高度-y）
       *
       * @since 1.2.0
       */
      height?: number
      /**
       * 输出图片宽度（默认为width）
       *
       * @since 1.2.0
       */
      destWidth?: number
      /**
       * 输出图片高度（默认为height）
       *
       * @since 1.2.0
       */
      destHeight?: number
      /**
       * 画布标识，传入 [`<canvas/>`](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的 canvas-id
       */
      canvasId: string
      /**
       * 目标文件的类型，只支持 'jpg' 或 'png'。默认为 'png'
       *
       * @since 1.7.0
       */
      fileType?: string
      /**
       * 图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
       *
       * @since 1.7.0
       */
      quality?: number
      /**
       * 接口调用成功的回调函数
       */
      success?: Param0PropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: Param0PropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: Param0PropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type Param0PropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type Param0PropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type Param0PropComplete = () => any
  }
  /**
   * 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 在 `draw` 回调里调用该方法才能保证图片导出成功。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.canvasToTempFilePath({
     x: 100,
     y: 200,
     width: 50,
     height: 50,
     destWidth: 100,
     destHeight: 100,
     canvasId: 'myCanvas',
     success: function(res) {
       console.log(res.tempFilePath)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html
   */
  function canvasToTempFilePath(OBJECT: canvasToTempFilePath.Param0, instance?: any): void

  namespace canvasGetImageData {
    type Promised = {
      /**
       * errMsg
       */
      errMsg: string
      /**
       * 图像数据矩形的宽度
       */
      width: number
      /**
       * 图像数据矩形的高度
       */
      height: number
      /**
       * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
       */
      data: Uint8ClampedArray
    }
    type Param = {
      /**
       * 画布标识，传入 [`<canvas />`](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的 canvas-id
       */
      canvasId: string
      /**
       * 将要被提取的图像数据矩形区域的左上角 x 坐标
       */
      x: number
      /**
       * 将要被提取的图像数据矩形区域的左上角 y 坐标
       */
      y: number
      /**
       * 将要被提取的图像数据矩形区域的宽度
       */
      width: number
      /**
       * 将要被提取的图像数据矩形区域的高度
       */
      height: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 返回一个数组，用来描述 canvas 区域隐含的像素数据
   *
   * **示例代码：**
   *
   ```javascript
   Taro.canvasGetImageData({
     canvasId: 'myCanvas',
     x: 0,
     y: 0,
     width: 100,
     height: 100,
     success(res) {
       console.log(res.width) // 100
       console.log(res.height) // 100
       console.log(res.data instanceof Uint8ClampedArray) // true
       console.log(res.data.length) // 100   100   4
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasGetImageData.html
   */
  function canvasGetImageData(OBJECT: canvasGetImageData.Param): Promise<canvasGetImageData.Promised>

  namespace canvasPutImageData {
    type Param = {
      /**
       * 画布标识，传入 [`<canvas />`](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的 canvas-id
       */
      canvasId: string
      /**
       * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
       */
      data: Uint8ClampedArray
      /**
       * 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
       */
      x: number
      /**
       * 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
       */
      y: number
      /**
       * 源图像数据矩形区域的宽度
       */
      width: number
      /**
       * 源图像数据矩形区域的高度
       */
      height?: number
    }
  }
  /**
   * @since 1.9.0
   *
   * 将像素数据绘制到画布的方法
   *
   * **示例代码：**
   *
   ```javascript
   const data = new Uint8ClampedArray([255, 0, 0, 1])
   Taro.canvasPutImageData({
     canvasId: 'myCanvas',
     x: 0,
     y: 0,
     width: 1,
     data: data,
     success(res) {}
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasPutImageData.html
   */
  function canvasPutImageData(OBJECT: canvasPutImageData.Param): Promise<any>

  namespace startPullDownRefresh {
    type Promised = {
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startPullDownRefresh()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.startPullDownRefresh.html
   */
  function startPullDownRefresh(OBJECT?: startPullDownRefresh.Param): Promise<startPullDownRefresh.Promised>

  /**
   * 停止当前页面下拉刷新。
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     onPullDownRefresh: function(){
       Taro.stopPullDownRefresh()
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.stopPullDownRefresh.html
   */
  function stopPullDownRefresh(): void

  /**
   * 收起键盘。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.hideKeyboard()
   ```
   * @see https://developers.weixin.qq.com/minigame/dev/api/ui/keyboard/wx.hideKeyboard.html
   */
  function hideKeyboard(): void

  /**
   * @since 1.4.0
   *
   * 返回一个SelectorQuery对象实例。可以在这个实例上使用`select`等方法选择节点，并使用`boundingClientRect`等方法选择需要查询的信息。
   *
   * **selectorQuery.in(component)：**
   *
   * @since 1.6.0
   *
   * 将选择器的选取范围更改为自定义组件`component`内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点。）
   *
   * **selectorQuery.select(selector)：**
   *
   * 在当前页面下选择第一个匹配选择器`selector`的节点，返回一个`NodesRef`对象实例，可以用于获取节点信息。
   *
   * `selector`类似于CSS的选择器，但仅支持下列语法。
   *
   * *   ID选择器：`#the-id`
   * *   class选择器（可以连续指定多个）：`.a-class.another-class`
   * *   子元素选择器：`.the-parent > .the-child`
   * *   后代选择器：`.the-ancestor .the-descendant`
   * *   跨自定义组件的后代选择器：`.the-ancestor >>> .the-descendant`
   * *   多选择器的并集：`#a-node, .some-other-nodes`
   *
   * **selectorQuery.selectAll(selector)：**
   *
   * 在当前页面下选择匹配选择器`selector`的节点，返回一个`NodesRef`对象实例。 与`selectorQuery.selectNode(selector)`不同的是，它选择所有匹配选择器的节点。
   *
   * **selectorQuery.selectViewport()：**
   *
   * 选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息，返回一个`NodesRef`对象实例。
   *
   * **nodesRef.boundingClientRect([callback])：**
   *
   * 添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。其功能类似于DOM的getBoundingClientRect。返回值是nodesRef对应的selectorQuery。
   *
   * 返回的节点信息中，每个节点的位置用`left`、`right`、`top`、`bottom`、`width`、`height`字段描述。如果提供了callback回调函数，在执行selectQuery的exec方法后，节点信息会在callback中返回。
   *
   * **nodesRef.scrollOffset([callback])：**
   *
   * 添加节点的滚动位置查询请求，以像素为单位。节点必须是`scroll-view`或者viewport。返回值是nodesRef对应的selectorQuery。
   *
   * 返回的节点信息中，每个节点的滚动位置用`scrollLeft`、`scrollTop`字段描述。如果提供了callback回调函数，在执行selectQuery的exec方法后，节点信息会在callback中返回。
   *
   * **selectorQuery.exec([callback])：**
   *
   * 执行所有的请求，请求结果按请求次序构成数组，在callback的第一个参数中返回。
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     queryMultipleNodes: function(){
       var query = Taro.createSelectorQuery()
       query.select('#the-id').boundingClientRect()
       query.selectViewport().scrollOffset()
       query.exec(function(res){
         res[0].top       // #the-id节点的上边界坐标
         res[1].scrollTop // 显示区域的竖直滚动位置
       })
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Component({
     queryMultipleNodes: function(){
       var query = Taro.createSelectorQuery().in(this)
       query.select('#the-id').boundingClientRect(function(res){
         res.top // 这个组件内 #the-id 节点的上边界坐标
       }).exec()
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     getRect: function(){
       Taro.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
         rect.id      // 节点的ID
         rect.dataset // 节点的dataset
         rect.left    // 节点的左边界坐标
         rect.right   // 节点的右边界坐标
         rect.top     // 节点的上边界坐标
         rect.bottom  // 节点的下边界坐标
         rect.width   // 节点的宽度
         rect.height  // 节点的高度
       }).exec()
     },
     getAllRects: function(){
       Taro.createSelectorQuery().selectAll('.a-class').boundingClientRect(function(rects){
         rects.forEach(function(rect){
           rect.id      // 节点的ID
           rect.dataset // 节点的dataset
           rect.left    // 节点的左边界坐标
           rect.right   // 节点的右边界坐标
           rect.top     // 节点的上边界坐标
           rect.bottom  // 节点的下边界坐标
           rect.width   // 节点的宽度
           rect.height  // 节点的高度
         })
       }).exec()
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     getScrollOffset: function(){
       Taro.createSelectorQuery().selectViewport().scrollOffset(function(res){
         res.id      // 节点的ID
         res.dataset // 节点的dataset
         res.scrollLeft // 节点的水平滚动位置
         res.scrollTop  // 节点的竖直滚动位置
       }).exec()
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Page({
     getFields: function(){
       Taro.createSelectorQuery().select('#the-id').fields({
         dataset: true,
         size: true,
         scrollOffset: true,
         properties: ['scrollX', 'scrollY']
       }, function(res){
         res.dataset    // 节点的dataset
         res.width      // 节点的宽度
         res.height     // 节点的高度
         res.scrollLeft // 节点的水平滚动位置
         res.scrollTop  // 节点的竖直滚动位置
         res.scrollX    // 节点 scroll-x 属性的当前值
         res.scrollY    // 节点 scroll-x 属性的当前值
       }).exec()
     }
   })
   ```
   */
  interface nodesRef {
    boundingClientRect: (callback?: clientRectCallback) => nodesRef
    scrollOffset: (callback?: scrollCallback) => nodesRef
    fields: (fields: fieldsObject, callback?: fieldCallback) => nodesRef
    exec: (callback?: execCallback) => void
  }

  interface baseElement {
    id: string
    dataset: object
  }

  interface rectElement {
    left: number
    right: number
    top: number
    bottom: number
  }

  interface sizeElement {
    width: number
    height: number
  }

  interface scrollElement {
    scrollLeft: number
    scrollTop: number
  }
  interface clientRectElement extends baseElement, rectElement, sizeElement {}

  interface scrollOffsetElement extends baseElement, scrollElement {}

  interface fieldsObject {
    id?: boolean
    dataset?: boolean
    rect?: boolean
    size?: boolean
    scrollOffset?: boolean
    properties?: string[]
    computedStyle?: string[]
  }

  interface fieldElement extends baseElement, rectElement, sizeElement {
    [key: string]: any
  }

  type execObject = clientRectElement & scrollOffsetElement & fieldElement
  type clientRectCallback = (rect: clientRectElement | clientRectElement[]) => void
  type scrollCallback = (res: scrollOffsetElement | scrollOffsetElement[]) => void
  type fieldCallback = (res: fieldElement | fieldElement[]) => void
  type execCallback = (res: execObject | execObject[]) => void

  function createSelectorQuery(): SelectorQuery

  class SelectorQuery {
    /**
     * 参考下面详细介绍
     */
    in(component?: any): SelectorQuery
    /**
     * 参考下面详细介绍
     */
    select(selector: string): nodesRef
    /**
     * 参考下面详细介绍
     */
    selectAll(selector: string): nodesRef
    /**
     * 参考下面详细介绍
     */
    selectViewport(): nodesRef
    /**
     * 参考下面详细介绍
     */
    exec(callback?: execCallback): void
  }
  namespace getExtConfig {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 第三方平台自定义的数据
       */
      extConfig: any
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 获取[第三方平台](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/ext.html)自定义的数据字段。
   *
   * **Bug & Tip：**
   *
   * 1.  `Taro.getExtConfig` 暂时无法通过 `Taro.canIUse` 判断是否兼容，开发者需要自行判断 `Taro.getExtConfig` 是否存在来兼容
   *
   * **示例代码：**
   *
   ```javascript
   if(Taro.getExtConfig) {
     Taro.getExtConfig({
       success: function (res) {
         console.log(res.extConfig)
       }
     })
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfig.html
   */
  function getExtConfig(OBJECT?: getExtConfig.Param): Promise<getExtConfig.Promised>

  namespace getExtConfigSync {
    type Return = {
      /**
       * 第三方平台自定义的数据
       */
      extConfig: any
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取[第三方平台](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/ext.html)自定义的数据字段的同步接口。
   *
   * **Bug & Tip：**
   *
   * 1.  `Taro.getExtConfigSync` 暂时无法通过 `Taro.canIUse` 判断是否兼容，开发者需要自行判断 `Taro.getExtConfigSync` 是否存在来兼容
   *
   * **示例代码：**
   *
   ```javascript
   let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}
   console.log(extConfig)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfigSync.html
   */
  function getExtConfigSync(): getExtConfigSync.Return

  namespace getLogManager {
    type Param = {
      /**
       * @since 2.3.2
       *
       * 取值为0/1，取值为0表示是否会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志，取值为1则不会。默认值是 0
       */
      level?: number
    }
    type Return = {
      /**
       * 写 debug 日志
       */
      debug(...args: any[]): void
      /**
       * 写 info 日志
       */
      info(...args: any[]): void
      /**
       * 写 log 日志
       */
      log(...args: any[]): void
      /**
       * 写 warn 日志
       */
      warn(...args: any[]): void
    }
  }
  /**
   * @since 2.1.0
   *
   * 获取日志管理器对象。
   *
   * **示例代码：**
   *
   ```javascript
   const logger = Taro.getLogManager({level: 1})
   logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
   logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
   logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
   logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html
   */
  function getLogManager(OBJECT?: getLogManager.Param): getLogManager.Return

  namespace login {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
       */
      code: string
    }
    type Param = {
      /**
       * 超时时间，单位 ms
       *
       * @since 1.9.90
       */
      timeout?: number
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 登录接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: Promised) => void
    /**
     * 登录接口调用失败的回调函数
     */
    type ParamPropFail = (err: Promised) => void
    /**
     * 登录接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = (err: Promised) => void
  }
  /**
   * 调用接口Taro.login() 获取**临时登录凭证（code）**
   *
   * **示例代码：**
   *
   ```javascript
   //app.js
   App({
     onLaunch: function() {
       Taro.login({
         success: function(res) {
           if (res.code) {
             //发起网络请求
             Taro.request({
               url: 'https://test.com/onLogin',
               data: {
                 code: res.code
               }
             })
           } else {
             console.log('登录失败！' + res.errMsg)
           }
         }
       });
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
   */
  function login(OBJECT?: login.Param): Promise<login.Promised>

  namespace checkSession {
    type Param = {}
  }
  /**
   * 校验用户当前session_key是否有效。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.checkSession({
     success: function(){
       //session_key 未过期，并且在本生命周期一直有效
     },
     fail: function(){
       // session_key 已经失效，需要重新执行登录流程
       Taro.login() //重新登录
       ....
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.checkSession.html
   */
  function checkSession(OBJECT?: checkSession.Param): Promise<any>

  namespace authorize {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 需要获取权限的scope，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html#scope-列表)
       */
      scope: string
    }
  }
  /**
   * @since 1.2.0
   *
   * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
   *
   * **示例代码：**
   *
   ```javascript
   // 可以通过 Taro.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
   Taro.getSetting({
       success(res) {
           if (!res.authSetting['scope.record']) {
               Taro.authorize({
                   scope: 'scope.record',
                   success() {
                       // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
                       Taro.startRecord()
                   }
               })
           }
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
   */
  function authorize(OBJECT: authorize.Param): Promise<authorize.Promised>

  namespace getUserInfo {
    type Promised = {
      /**
       * 用户信息对象，不包含 openid 等敏感信息
       */
      userInfo: PromisedPropUserInfo
      /**
       * 不包括敏感信息的原始数据字符串，用于计算签名。
       */
      rawData: string
      /**
       * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 [signature](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)。
       */
      signature: string
      /**
       * 包括敏感数据在内的完整用户信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      encryptedData: string
      /**
       * 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      iv: string
      /**
       * 敏感数据对应的云 ID，开通[云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud)
       */
      cloudID: string
    }
    /**
     * 用户信息对象，不包含 openid 等敏感信息
     */
    type PromisedPropUserInfo = {
      /**
       * 用户昵称
       */
      nickName: string
      /**
       * 用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
       */
      avatarUrl: string
      /**
       * 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
       */
      gender: 0 | 1 | 2
      /**
       * 用户所在城市
       */
      city: string
      /**
       * 用户所在省份
       */
      province: string
      /**
       * 用户所在国家
       */
      country: string
      /**
       * 用户的语言，简体中文为zh_CN
       */
      language: string
    }
    type Param = {
      /**
       * 是否带上登录态信息
       *
       * @since 1.1.0
       */
      withCredentials?: boolean
      /**
       * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。
       *
       * @since 1.3.0
       */
      lang?: string
      /**
       * 超时时间，单位 ms
       *
       * @since 1.9.90
       */
      timeout?: number
      success?: ParamPropSuccess
      fail?: ParamPropFail
      complete?: ParamPropComplete
    }
    /**
     * 获取用户信息接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: Promised) => void
    /**
     * 获取用户信息接口调用失败的回调函数
     */
    type ParamPropFail = (err: Promised) => void
    /**
     * 获取用户信息接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = (err: Promised) => void
  }
  /**
   * 获取用户信息，withCredentials 为 true 时需要先调用 [Taro.login](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) 接口。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userInfo
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getUserInfo({
     success: function(res) {
       var userInfo = res.userInfo
       var nickName = userInfo.nickName
       var avatarUrl = userInfo.avatarUrl
       var gender = userInfo.gender //性别 0：未知、1：男、2：女
       var province = userInfo.province
       var city = userInfo.city
       var country = userInfo.country
     }
   })
   ```
   *
   * **示例代码：**
   *
   ```json
   {
       "openId": "OPENID",
       "nickName": "NICKNAME",
       "gender": GENDER,
       "city": "CITY",
       "province": "PROVINCE",
       "country": "COUNTRY",
       "avatarUrl": "AVATARURL",
       "unionId": "UNIONID",
       "watermark":
       {
           "appid":"APPID",
       "timestamp":TIMESTAMP
       }
   }
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html
   */
  function getUserInfo(OBJECT?: getUserInfo.Param): Promise<getUserInfo.Promised>

  namespace checkIsSupportFacialRecognition {
    type Promised = {
      errMsg: string
      errCode: number
    }
    type Param = {
      checkAliveType?: number
    }
  }
  function checkIsSupportFacialRecognition(OBJECT?: checkIsSupportFacialRecognition.Param): Promise<checkIsSupportFacialRecognition.Promised>

  namespace startFacialRecognitionVerify {
    type Promised = {
      errMsg: string
      errCode: number
      verifyResult: string
    }
    type Param = {
      name: string
      idCardNumber: string
      checkAliveType?: number
    }
  }
  function startFacialRecognitionVerify(OBJECT?: startFacialRecognitionVerify.Param): Promise<startFacialRecognitionVerify.Promised>

  namespace startFacialRecognitionVerifyAndUploadVideo {
    type Promised = {
      errMsg: string
      errCode: number
      verifyResult: string
    }
    type Param = {
      name: string
      idCardNumber: string
      checkAliveType?: number
    }
  }
  function startFacialRecognitionVerifyAndUploadVideo(OBJECT?: startFacialRecognitionVerifyAndUploadVideo.Param): Promise<startFacialRecognitionVerifyAndUploadVideo.Promised>

  namespace requestPayment {
    type Param = {
      /**
       * 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
       */
      timeStamp: string
      /**
       * 随机字符串，长度为32个字符以下。
       */
      nonceStr: string
      /**
       * 统一下单接口返回的 prepay\_id 参数值，提交格式如：prepay\_id=_*_
       */
      package: string
      /**
       * 签名算法，暂支持 MD5
       */
      signType: string
      /**
       * 签名,具体签名方案参见[小程序支付接口文档](https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3);
       */
      paySign: string
      /**
       * 接口调用成功的回调函数
       */
      success?: ParamPropSuccess
      /**
       * 接口调用失败的回调函数
       */
      fail?: ParamPropFail
      /**
       * 接口调用结束的回调函数（调用成功、失败都会执行）
       */
      complete?: ParamPropComplete
    }
    /**
     * 接口调用成功的回调函数
     */
    type ParamPropSuccess = (res: any) => any
    /**
     * 接口调用失败的回调函数
     */
    type ParamPropFail = (err: any) => any
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    type ParamPropComplete = () => any
  }
  /**
   * 发起微信支付。
   *
   * **回调结果：**
   *
   *   回调类型  |  errMsg                                 |  说明
   * ------------|-----------------------------------------|------------------------------------------
   *   success   |  requestPayment:ok                      |  调用支付成功
   *   fail      |  requestPayment:fail cancel             |  用户取消支付
   *   fail      |  requestPayment:fail (detail message)   |调用支付失败，其中 detail message 为后台返回的详细失败原因
   *
   * **Bug & Tip：**
   *
   * 1.  `bug`: 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
   *
   * **示例代码：**
   *
   ```javascript
   Taro.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success':function(res){
      },
      'fail':function(res){
      }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/payment/wx.requestPayment.html
   */
  function requestPayment(OBJECT: requestPayment.Param): Promise<any>

  namespace showShareMenu {
    type Param = {
      /**
       * 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html)
       */
      withShareTicket?: boolean
    }
  }
  /**
   * @since 1.1.0
   *
   * 显示当前页面的转发按钮
   *
   * **示例代码：**
   *
   ```javascript
   Taro.showShareMenu({
     withShareTicket: true
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html
   */
  function showShareMenu(OBJECT?: showShareMenu.Param): Promise<any>

  namespace hideShareMenu {
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 隐藏转发按钮
   *
   * **示例代码：**
   *
   ```javascript
   Taro.hideShareMenu()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.hideShareMenu.html
   */
  function hideShareMenu(OBJECT?: hideShareMenu.Param): Promise<any>

  namespace updateShareMenu {
    type Param = {
      /**
       * 是否使用带 shareTicket 的转发[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html)
       */
      withShareTicket?: boolean
    }
  }
  /**
   * @since 1.2.0
   *
   * 更新转发属性
   *
   * **示例代码：**
   *
   ```javascript
   Taro.updateShareMenu({
     withShareTicket: true,
     success() {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.updateShareMenu.html
   */
  function updateShareMenu(OBJECT?: updateShareMenu.Param): Promise<any>

  namespace getShareInfo {
    type Promised = {
      /**
       * 错误信息
       */
      errMsg: string
      /**
       * 包括敏感数据在内的完整转发信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       *
       * **encryptedData 解密后为一个 JSON 结构，包含字段如下：**
       *
       *   字段      |  说明
       * ------------|------------------
       *   openGId   |群对当前小程序的唯一 ID
       *
       * **Tip:** 如需要展示群名称，可以使用[开放数据组件](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)
       */
      encryptedData: string
      /**
       * 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      iv: string
      /**
       * 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud)
       */
      cloudID: string
    }
    type Param = {
      /**
       * shareTicket
       */
      shareTicket: string
      /**
       * 超时时间，单位 ms
       *
       * @since 1.9.90
       */
      timeout?: number
    }
  }
  /**
   * @since 1.1.0
   *
   * 获取转发详细信息
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.getShareInfo.html
   */
  function getShareInfo(OBJECT: getShareInfo.Param): Promise<getShareInfo.Promised>

  namespace chooseAddress {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 收货人姓名
       */
      userName: string
      /**
       * 邮编
       */
      postalCode: string
      /**
       * 国标收货地址第一级地址
       */
      provinceName: string
      /**
       * 国标收货地址第二级地址
       */
      cityName: string
      /**
       * 国标收货地址第三级地址
       */
      countyName: string
      /**
       * 详细收货地址信息
       */
      detailInfo: string
      /**
       * 收货地址国家码
       */
      nationalCode: string
      /**
       * 收货人手机号码
       */
      telNumber: string
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.address
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseAddress({
     success: function (res) {
       console.log(res.userName)
       console.log(res.postalCode)
       console.log(res.provinceName)
       console.log(res.cityName)
       console.log(res.countyName)
       console.log(res.detailInfo)
       console.log(res.nationalCode)
       console.log(res.telNumber)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html
   */
  function chooseAddress(OBJECT?: chooseAddress.Param): Promise<chooseAddress.Promised>

  namespace addCard {
    type Promised = {
      /**
       * 卡券添加结果列表，列表内对象说明请详见[返回对象说明](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html)
       */
      cardList: PromisedPropCardList
    }
    /**
     * 卡券添加结果列表，列表内对象说明请详见[返回对象说明](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html)
     */
    type PromisedPropCardList = PromisedPropCardListItem[]
    type PromisedPropCardListItem = {
      /**
       * 加密 code，为用户领取到卡券的code加密后的字符串，解密请参照：[code 解码接口](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1499332673_Unm7V)
       */
      code: string
      /**
       * 用户领取到卡券的Id
       */
      cardId: string
      /**
       * 用户领取到卡券的扩展参数，与调用时传入的参数相同
       */
      cardExt: string
      /**
       * 是否成功
       */
      isSuccess: boolean
    }
    type Param = {
      /**
       * 需要添加的卡券列表，列表内对象说明请参见[请求对象说明](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html)
       */
      cardList: ParamPropCardList
    }
    /**
     * 需要添加的卡券列表，列表内对象说明请参见[请求对象说明](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html)
     */
    type ParamPropCardList = ParamPropCardListItem[]
    type ParamPropCardListItem = {
      /**
       * 卡券 Id
       */
      cardId: string
      /**
       * 卡券的扩展参数
       *
       * **cardExt 说明：**
       *
       *   参数                   |  类型     |  必填 |是否参与签名|  说明
       * -------------------------|-----------|-------|-----------|-----------------------------------------------------------------------------------------------------------------------------
       *   code                   |  String   |  否   |  是       |用户领取的 code，仅自定义 code 模式的卡券须填写，非自定义 code 模式卡券不可填写，[详情](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1451025056)
       *   openid                 |  String   |  否   |  是       |  指定领取者的openid，只有该用户能领取。 bind_openid 字段为 true 的卡券必须填写，bind_openid 字段为 false 不可填写。
       *   timestamp              |  Number   |  是   |  是       |  时间戳，东八区时间,UTC+8，单位为秒
       *   nonce_str              |  String   |  否   |  是       |随机字符串，由开发者设置传入，加强安全性（若不填写可能被重放请求）。随机字符串，不长于 32 位。推荐使用大小写字母和数字，不同添加请求的 nonce_str 须动态生成，若重复将会导致领取失败。
       *   fixed_begintimestamp   |  Number   |  否   |  否       |卡券在第三方系统的实际领取时间，为东八区时间戳（UTC+8,精确到秒）。当卡券的有效期类为 DATE_TYPE_FIX_TERM 时专用，标识卡券的实际生效时间，用于解决商户系统内起始时间和领取微信卡券时间不同步的问题。
       *   outer_str              |  String   |  否   |  否       |  领取渠道参数，用于标识本次领取的渠道值。
       *   signature              |  String   |  是   |  -        |签名，商户将接口列表中的参数按照指定方式进行签名,签名方式使用 SHA1，具体签名方案参见：[卡券签名](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)
       *
       * **注：cardExt 需进行 JSON 序列化为字符串传入**
       */
      cardExt: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 批量添加卡券。
   *
   * **回调结果：**
   *
   *   回调类型  |  errMsg                          |  说明
   * ------------|----------------------------------|------------------------------------------
   *   success   |  addCard:ok                      |  添加卡券成功
   *   fail      |  addCard:fail cancel             |  用户取消添加卡券
   *   fail      |  addCard:fail (detail message)   |添加卡券失败，其中 detail message 为后台返回的详细失败原因
   *
   * **示例代码：**
   *
   ```javascript
   Taro.addCard({
     cardList: [
       {
         cardId: '',
         cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
       }, {
         cardId: '',
         cardExt: '{"code": "", "openid": "", "timestamp": "", "signature":""}'
       }
     ],
     success: function(res) {
       console.log(res.cardList) // 卡券添加结果
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.addCard.html
   */
  function addCard(OBJECT: addCard.Param): Promise<addCard.Promised>

  namespace openCard {
    type Param = {
      /**
       * 需要打开的卡券列表，列表内参数详见[openCard 请求对象说明](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.openCard.html)
       */
      cardList: ParamPropCardList
    }
    /**
     * 需要打开的卡券列表，列表内参数详见[openCard 请求对象说明](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.openCard.html)
     */
    type ParamPropCardList = ParamPropCardListItem[]
    type ParamPropCardListItem = {
      /**
       * 需要打开的卡券 Id
       */
      cardId: string
      /**
       * 由 addCard 的返回对象中的加密 code 通过解密后得到，解密请参照：[code 解码接口](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1499332673_Unm7V)
       */
      code: string
    }
  }
  /**
   * @since 1.1.0
   *
   * 查看微信卡包中的卡券。
   *
   * **Tip：**
   *
   * 1.  `tip`: 目前只有认证小程序才能使用卡券接口，可参考[指引](https://mp.weixin.qq.com/debug/wxadoc/product/renzheng.html)进行认证。
   * 2.  `tip`: 了解更多信息，请查看[微信卡券接口文档](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1490190158&version=1&lang=zh_CN&platform=2)
   *
   * **示例代码：**
   *
   ```javascript
   Taro.openCard({
     cardList: [
       {
         cardId: '',
         code: ''
       }, {
         cardId: '',
         code: ''
       }
     ],
     success: function(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/card/wx.openCard.html
   */
  function openCard(OBJECT: openCard.Param): Promise<any>

  namespace openSetting {
    type Promised = {
      /**
       * 用户授权结果，其中 key 为 scope 值，value 为 Bool 值，表示用户是否允许授权，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
       */
      authSetting: any
    }
    type Param = {}
  }
  /**
   * @since 1.1.0
   *
   * 调起客户端小程序设置界面，返回用户设置的操作结果。
   *
   * 注：设置界面只会出现小程序已经向用户请求过的权限。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.openSetting({
     success: (res) => {
              // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
           }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html
   */
  function openSetting(OBJECT?: openSetting.Param): Promise<openSetting.Promised>

  namespace getSetting {
    type Promised = {
      /**
       * 用户授权结果，其中 key 为 scope 值，value 为 Bool 值，表示用户是否允许授权，详见 [scope 列表](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)
       */
      authSetting: any
    }
    type Param = {}
  }
  /**
   * @since 1.2.0
   *
   * 获取用户的当前设置。
   *
   * 注：返回值中只会出现小程序已经向用户请求过的权限。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSetting({
     success: (res) => {
              // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
           }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.getSetting.html
   */
  function getSetting(OBJECT?: getSetting.Param): Promise<getSetting.Promised>

  namespace getWeRunData {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
      /**
       * 包括敏感数据在内的完整用户信息的加密数据，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       *
       * **encryptedData：**
       *
       * encryptedData 解密后为以下 json 结构，详见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       *
       *   属性                       |  类型          |  说明
       * -----------------------------|----------------|-------------------
       *   stepInfoList               |  ObjectArray   |用户过去三十天的微信运动步数
       *   stepInfoList[].timestamp   |  Number        |时间戳，表示数据对应的时间
       *   stepInfoList[].step        |  Number        |  微信运动步数
       */
      encryptedData: string
      /**
       * 加密算法的初始向量，详细见[加密数据解密算法](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)
       */
      iv: string
      /**
       * 敏感数据对应的云 ID，开通云开发的小程序才会返回，可通过云调用直接获取开放数据，详细见[云调用直接获取开放数据](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#method-cloud)
       */
      cloudID: string
    }
    type Param = {
      /**
       * 超时时间，单位 ms
       *
       * @since 1.9.90
       */
      timeout?: number
    }
  }
  /**
   * @since 1.2.0
   *
   * 获取用户过去三十天微信运动步数，需要先调用 [Taro.login](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) 接口。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.werun
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getWeRunData({
       success(res) {
           const encryptedData = res.encryptedData
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/werun/wx.getWeRunData.html
   */
  function getWeRunData(OBJECT?: getWeRunData.Param): Promise<getWeRunData.Promised>

  namespace navigateToMiniProgram {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 要打开的小程序 appId
       */
      appId: string
      /**
       * 打开的页面路径，如果为空则打开首页
       */
      path?: string
      /**
       * 需要传递给目标小程序的数据，目标小程序可在 `App.onLaunch()`，`App.onShow()` 中获取到这份数据。[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html)
       */
      extraData?: any
      /**
       * 要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） ，仅在当前小程序为开发版或体验版时此参数有效；如果当前小程序是体验版或正式版，则打开的小程序必定是正式版。默认值 release
       */
      envVersion?: string
    }
  }
  /**
   * @since 1.3.0
   * >
   * > iOS 微信客户端 6.5.9 版本开始支持，Android 客户端即将在 6.5.10 版本开始支持，请先使用 iOS 客户端进行调试
   *
   * 打开同一公众号下关联的另一个小程序。**（注：必须是同一公众号下，而非同个 open 账号下）**
   *
   * **Bug & Tip：**
   *
   * 1.  `tip`: 在开发者工具上调用此 API 并不会真实的跳转到另外的小程序，但是开发者工具会校验本次调用跳转是否成功[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#小程序跳转的调试支持)
   * 2.  `tip`: 开发者工具上支持被跳转的小程序处理接收参数的调试[详情](https://developers.weixin.qq.com/miniprogram/dev/devtools/different.html#小程序跳转的调试支持)
   * 3.  `tip`: 只有同一公众号下的关联的小程序之间才可相互跳转 [详情](https://mp.weixin.qq.com/debug/wxadoc/introduction/index.html#%E5%85%AC%E4%BC%97%E5%8F%B7%E5%85%B3%E8%81%94%E5%B0%8F%E7%A8%8B%E5%BA%8F)
   *
   * **示例代码：**
   *
   ```javascript
   Taro.navigateToMiniProgram({
     appId: '',
     path: 'pages/index/index?id=123',
     extraData: {
       foo: 'bar'
     },
     envVersion: 'develop',
     success(res) {
       // 打开成功
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html
   */
  function navigateToMiniProgram(OBJECT: navigateToMiniProgram.Param): Promise<navigateToMiniProgram.Promised>

  namespace navigateBackMiniProgram {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 需要返回给上一个小程序的数据，上一个小程序可在 `App.onShow()` 中获取到这份数据。[详情](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html)
       */
      extraData?: any
    }
  }
  /**
   * @since 1.3.0
   * >
   * > iOS 微信客户端 6.5.9 版本开始支持，Android 客户端即将在 6.5.10 版本开始支持，请先使用 iOS 客户端进行调试
   *
   * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
   *
   * **示例代码：**
   *
   ```javascript
   Taro.navigateBackMiniProgram({
     extraData: {
       foo: 'bar'
     },
     success(res) {
       // 返回成功
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateBackMiniProgram.html
   */
  function navigateBackMiniProgram(OBJECT?: navigateBackMiniProgram.Param): Promise<navigateBackMiniProgram.Promised>

  namespace chooseInvoice {
    type Promised = {
      /**
       * 所选发票卡券的 cardId
       */
      cardId: string
      /**
       * 所选发票卡券的加密 code，报销方可以通过 cardId 和 encryptCode 获得报销发票的信息。
       */
      encryptCode: string
      /**
       * 发票方的 appId
       */
      publisherAppId: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 选择用户的发票抬头。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.invoice
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseInvoice({
     success(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoice.html
   */
  function chooseInvoice(OBJECT?: chooseInvoice.Param): Promise<chooseInvoice.Promised>

  namespace chooseInvoiceTitle {
    type Promised = {
      /**
       * 抬头类型（0：单位，1：个人）
       */
      type: string
      /**
       * 抬头名称
       */
      title: string
      /**
       * 抬头税号
       */
      taxNumber: string
      /**
       * 单位地址
       */
      companyAddress: string
      /**
       * 手机号码
       */
      telephone: string
      /**
       * 银行名称
       */
      bankName: string
      /**
       * 银行账号
       */
      bankAccount: string
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 选择用户的发票抬头。
   *
   * 需要[用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.invoiceTitle
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseInvoiceTitle({
     success(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html
   */
  function chooseInvoiceTitle(OBJECT?: chooseInvoiceTitle.Param): Promise<chooseInvoiceTitle.Promised>

  namespace checkIsSupportSoterAuthentication {
    type Promised = {
      /**
       * 该设备支持的可被SOTER识别的生物识别方式
       *
       * **supportMode 有效值：**
       *
       *   值            |  说明
       * ----------------|---------------
       *   fingerPrint   |  指纹识别
       *   facial        |人脸识别（暂未支持）
       *   speech        |声纹识别（暂未支持）
       */
      supportMode: string[]
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 获取本机支持的 SOTER 生物认证方式
   *
   * **示例代码：**
   *
   ```javascript
   Taro.checkIsSupportSoterAuthentication({
       success(res) {
           // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
           // res.supportMode = ['fingerPrint'] 只支持指纹识别
           // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSupportSoterAuthentication.html
   */
  function checkIsSupportSoterAuthentication(OBJECT?: checkIsSupportSoterAuthentication.Param): Promise<checkIsSupportSoterAuthentication.Promised>

  namespace startSoterAuthentication {
    type Promised = {
      /**
       * 错误码
       */
      errCode: number
      /**
       * 生物认证方式
       */
      authMode: string
      /**
       * 在设备安全区域（TEE）内获得的本机安全信息（如TEE名称版本号等以及防重放参数）以及本次认证信息（仅Android支持，本次认证的指纹ID）（仅Android支持，本次认证的指纹ID）
       *
       * **resultJSON 说明：**
       *
       * 此数据为设备TEE中，将传入的challenge和TEE内其他安全信息组成的数据进行组装而来的JSON，对下述字段的解释如表2。例子如下：
       *
       *   字段名    |  说明
       * ------------|-----------------------------------------------------
       *   raw       |  调用者传入的challenge
       *   fid       |（仅Android支持）本次生物识别认证的生物信息编号（如指纹识别则是指纹信息在本设备内部编号）
       *   counter   |  防重放特征参数
       *   tee_n     |  TEE名称（如高通或者trustonic等）
       *   tee_v     |  TEE版本号
       *   fp_n      |  指纹以及相关逻辑模块提供商（如FPC等）
       *   fp_v      |  指纹以及相关模块版本号
       *   cpu_id    |  机器唯一识别ID
       *   uid       |  概念同Android系统定义uid，即应用程序编号
       */
      resultJSON: string
      /**
       * 用SOTER安全密钥对result_json的签名(SHA256withRSA/PSS, saltlen=20)
       */
      resultJSONSignature: string
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 请求使用的可接受的生物认证方式
       */
      requestAuthModes: string[]
      /**
       * 挑战因子。挑战因子为调用者为此次生物鉴权准备的用于签名的字符串关键识别信息，将作为result_json的一部分，供调用者识别本次请求。例如：如果场景为请求用户对某订单进行授权确认，则可以将订单号填入此参数。
       */
      challenge: string
      /**
       * 验证描述，即识别过程中显示在界面上的对话框提示内容
       */
      authContent?: string
    }
  }
  /**
   * @since 1.5.0
   *
   * 开始 SOTER 生物认证
   *
   * **生物识别方式定义：**
   *
   *   mode          |  说明
   * ----------------|---------------
   *   fingerPrint   |  指纹识别
   *   facial        |人脸识别（暂未支持）
   *   speech        |声纹识别（暂未支持）
   *
   * **resultJSON 说明：**
   *
   ```json
   {
       "raw":"msg",
       "fid":"2",
       "counter":123,
       "tee_n":"TEE Name",
       "tee_v":"TEE Version",
       "fp_n":"Fingerprint Sensor Name",
       "fp_v":"Fingerprint Sensor Version",
       "cpu_id":"CPU Id",
       "uid":"21"
   }
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startSoterAuthentication({
     requestAuthModes: ['fingerPrint'],
     challenge: '123456',
     authContent: '请用指纹解锁',
     success(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.startSoterAuthentication.html
   */
  function startSoterAuthentication(OBJECT: startSoterAuthentication.Param): Promise<startSoterAuthentication.Promised>

  namespace checkIsSoterEnrolledInDevice {
    type Promised = {
      /**
       * 是否已录入信息
       */
      isEnrolled: boolean
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 认证方式
       *
       * **checkAuthMode 有效值：**
       *
       *   值            |  说明
       * ----------------|---------------
       *   fingerPrint   |  指纹识别
       *   facial        |人脸识别（暂未支持）
       *   speech        |声纹识别（暂未支持）
       */
      checkAuthMode: string
    }
  }
  /**
   * @since 1.6.0
   *
   * 获取设备内是否录入如指纹等生物信息的接口
   *
   * **示例代码：**
   *
   ```javascript
   Taro.checkIsSoterEnrolledInDevice({
       checkAuthMode: 'fingerPrint',
       success(res) {
           console.log(res.isEnrolled)
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSoterEnrolledInDevice.html
   */
  function checkIsSoterEnrolledInDevice(OBJECT: checkIsSoterEnrolledInDevice.Param): Promise<checkIsSoterEnrolledInDevice.Promised>

  /**
   * @since 2.0.1
   *
   * 自定义业务数据监控上报接口。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.reportMonitor('1', 1)
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/report/wx.reportMonitor.html
   */
  function reportMonitor(monitorId: string, count: number): void

  /**
   * 自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.reportAnalytics('purchase', {
     price: 120,
     color: 'red'
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/data-analysis/wx.reportAnalytics.html
   */
  function reportAnalytics(eventName: string, data: any): void

  /**
   * @since 2.2.2
   *
   * 获取当前帐号信息
   *
   * **示例代码：**
   *
   ```javascript
   const accountInfo = wx.getAccountInfoSync();
   console.log(accountInfo.miniProgram.appId) // 小程序 appId
   console.log(accountInfo.plugin.appId) // 插件 appId
   console.log(accountInfo.plugin.version) // 插件版本号， 'a.b.c' 这样的形式
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
   */
  function getAccountInfoSync(): getAccountInfoSync.Return

  namespace getAccountInfoSync {
    interface Return {
      /**
       * 小程序帐号信息
       */
      miniProgram: {
        /**
         * 小程序 appId
         */
        appId: string
      }
      /**
       * 插件帐号信息（仅在插件中调用时包含这一项）
       */
      plugin?: {
        /**
         * 插件 appId
         */
        appId: string
        /**
         * 插件版本号
         */
        version: string
      }
    }
  }

  /**
   * @since 1.9.90
   *
   * 获取**全局唯一**的版本更新管理器，用于管理小程序更新。
   *
   * 关于小程序的更新机制，可以查看 [运行机制](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/operating-mechanism.html) 文档。
   *
   * **示例代码：**
   *
   ```javascript
   const updateManager = Taro.getUpdateManager()
         updateManager.onCheckForUpdate(function (res) {
     // 请求完新版本信息的回调
     console.log(res.hasUpdate)
   })
         updateManager.onUpdateReady(function () {
     Taro.showModal({
       title: '更新提示',
       content: '新版本已经准备好，是否重启应用？',
       success: function (res) {
         if (res.confirm) {
           // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
           updateManager.applyUpdate()
         }
       }
     })
         })
         updateManager.onUpdateFailed(function () {
     // 新的版本下载失败
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html
   */
  function getUpdateManager(): UpdateManager

  namespace UpdateManager {
    namespace onCheckForUpdate {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * 是否有新的版本
         */
        hasUpdate: boolean
      }
    }
  }
  class UpdateManager {
    /**
     * 当向微信后台请求完新版本信息，会进行回调
     *
     * **注：** 检查更新操作由微信在小程序冷启动时自动触发，不需由开发者主动触发，开发者只需监听检查结果即可。
     */
    onCheckForUpdate(callback: UpdateManager.onCheckForUpdate.Param): any
    /**
     * 当新版本下载完成，会进行回调
     *
     * **onUpdateReady(callback) 回调结果说明：**
     *
     * 当微信检查到小程序有新版本，会主动触发下载操作（无需开发者触发），当下载完成后，会通过 `onUpdateReady` 告知开发者。
     */
    onUpdateReady(callback: any): any
    /**
     * 当新版本下载失败，会进行回调
     *
     * **onUpdateFailed(callback) 回调结果说明：**
     *
     * 当微信检查到小程序有新版本，会主动触发下载操作（无需开发者触发），如果下载失败（可能是网络原因等），会通过 `onUpdateFailed` 告知开发者。
     */
    onUpdateFailed(callback: any): any
    /**
     * 当新版本下载完成，调用该方法会强制当前小程序应用上新版本并重启
     *
     * **applyUpdate() 说明：**
     *
     * 当小程序新版本已经下载时（即收到 `onUpdateReady` 回调），可以通过这个方法强制重启小程序并应用上最新版本。
     */
    applyUpdate(): any
  }
  /**
   * @since 1.9.90
   *
   * 在使用 createWorker 前，请查阅 [多线程](https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html) 文档了解基础知识和配置方法。
   *
   * 创建一个 Worker 线程，并返回 Worker 实例，目前限制最多只能创建一个 Worker，创建下一个 Worker 前请调用 Worker.terminate。
   *
   * `scriptPath` 为 worker 的入口文件路径，需填写绝对路径。
   *
   * **示例代码：**
   *
   ```javascript
   const worker = Taro.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
         worker.onMessage(function (res) {
     console.log(res)
   })
         worker.postMessage({
     msg: 'hello worker'
   })
         worker.terminate()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/wx.createWorker.html
   */
  function createWorker(scriptPath: any): Worker

  namespace Worker {
    namespace onMessage {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * Worker 线程向当前线程发送的消息
         */
        message: any
      }
    }
  }
  class Worker {
    /**
     * 向 Worker 线程发送的消息。
     *
     * **postMessage(message) 说明：**
     *
     * 向 Worker 线程发送消息，`message` 参数为需要发送的消息，必须是一个可序列化的 JavaScript 对象。
     */
    postMessage(Object: any): any
    /**
     * 监听 Worker 线程向当前线程发送的消息
     */
    onMessage(callback: Worker.onMessage.Param): any
    /**
     * 结束当前 Worker 线程，仅限在主线程 Worker 实例上调用。
     *
     * **terminate() 说明：**
     *
     * 结束当前 worker 线程，仅限在主线程 Worker 对象上调用。
     */
    terminate(): any
  }
  namespace setEnableDebug {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 是否打开调试
       */
      enableDebug: boolean
    }
  }
  /**
   * @since 1.4.0
   *
   * 设置是否打开调试开关，此开关对正式版也能生效。
   *
   * **示例代码：**
   *
   ```javascript
   // 打开调试
   Taro.setEnableDebug({
       enableDebug: true
   })
         // 关闭调试
   Taro.setEnableDebug({
       enableDebug: false
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html
   */
  function setEnableDebug(OBJECT: setEnableDebug.Param): Promise<setEnableDebug.Promised>

  interface OffscreenCanvas {
    /**
     *
     * @param contextType
     *
     * 该方法返回 OffscreenCanvas 的绘图上下文
     */
    getContext(contextType: string): any
  }
  namespace CanvasContext {
    namespace draw { type Param1 = () => any }
  }
  interface Color {}

  interface CanvasContext {
    /** 填充颜色。用法同 [CanvasContext.setFillStyle()]。
     *
     * 最低基础库： `1.9.90` */
    fillStyle: string
    /** 当前字体样式的属性。符合 [CSS font 语法](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) 的 DOMString 字符串，至少需要提供字体大小和字体族名。默认值为 10px sans-serif。
     *
     * 最低基础库： `1.9.90` */
    font: string
    /** 全局画笔透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 */
    globalAlpha: number
    /** 在绘制新形状时应用的合成操作的类型。目前安卓版本只适用于 `fill` 填充块的合成，用于 `stroke` 线段的合成效果都是 `source-over`。
     *
     * 目前支持的操作有
     * - 安卓：xor, source-over, source-atop, destination-out, lighter, overlay, darken, lighten, hard-light
     * - iOS：xor, source-over, source-atop, destination-over, destination-out, lighter, multiply, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, saturation, luminosity
     *
     * 最低基础库： `1.9.90` */
    globalCompositeOperation: string
    /** 线条的端点样式。用法同 [CanvasContext.setLineCap()]。
     *
     * 最低基础库： `1.9.90` */
    lineCap: number
    /** 虚线偏移量，初始值为0
     *
     * 最低基础库： `1.9.90` */
    lineDashOffset: number
    /** 线条的交点样式。用法同 [CanvasContext.setLineJoin()]。
     *
     * 最低基础库： `1.9.90` */
    lineJoin: number
    /** 线条的宽度。用法同 [CanvasContext.setLineWidth()]。
     *
     * 最低基础库： `1.9.90` */
    lineWidth: number
    /** 最大斜接长度。用法同 [CanvasContext.setMiterLimit()]。
     *
     * 最低基础库： `1.9.90` */
    miterLimit: number
    /** 阴影的模糊级别
     *
     * 最低基础库： `1.9.90` */
    shadowBlur: number
    /** 阴影的颜色
     *
     * 最低基础库： `1.9.90` */
    shadowColor: number
    /** 阴影相对于形状在水平方向的偏移
     *
     * 最低基础库： `1.9.90` */
    shadowOffsetX: number
    /** 阴影相对于形状在竖直方向的偏移
     *
     * 最低基础库： `1.9.90` */
    shadowOffsetY: number
    /** 边框颜色。用法同 [CanvasContext.setFillStyle()]。
     *
     * 最低基础库： `1.9.90` */
    strokeStyle: string
    /** [CanvasContext.arc(number x, number y, number r, number sAngle, number eAngle, boolean counterclockwise)](CanvasContext.arc.md)
     *
     * 创建一条弧线。
     *
     *   - 创建一个圆可以指定起始弧度为 0，终止弧度为 2 * Math.PI。
     *   - 用 `stroke` 或者 `fill` 方法来在 `canvas` 中画弧线。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Draw coordinates
   ctx.arc(100, 75, 50, 0, 2   Math.PI)
   ctx.setFillStyle('#EEEEEE')
   ctx.fill()
   ctx.beginPath()
   ctx.moveTo(40, 75)
   ctx.lineTo(160, 75)
   ctx.moveTo(100, 15)
   ctx.lineTo(100, 135)
   ctx.setStrokeStyle('#AAAAAA')
   ctx.stroke()
   ctx.setFontSize(12)
   ctx.setFillStyle('black')
   ctx.fillText('0', 165, 78)
   ctx.fillText('0.5 PI', 83, 145)
   ctx.fillText('1 PI', 15, 78)
   ctx.fillText('1.5 PI', 83, 10)
   // Draw points
   ctx.beginPath()
   ctx.arc(100, 75, 2, 0, 2   Math.PI)
   ctx.setFillStyle('lightgreen')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(100, 25, 2, 0, 2   Math.PI)
   ctx.setFillStyle('blue')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(150, 75, 2, 0, 2   Math.PI)
   ctx.setFillStyle('red')
   ctx.fill()
   // Draw arc
   ctx.beginPath()
   ctx.arc(100, 75, 50, 0, 1.5   Math.PI)
   ctx.setStrokeStyle('#333333')
   ctx.stroke()
   ctx.draw()
   ```
     *
     * ![]
     *
     * 针对 arc(100, 75, 50, 0, 1.5 * Math.PI)的三个关键坐标如下：
     *
     * - 绿色: 圆心 (100, 75)
     * - 红色: 起始弧度 (0)
     * - 蓝色: 终止弧度 (1.5 * Math.PI) */
    arc(
      /** 圆心的 x 坐标 */
      x: number,
      /** 圆心的 y 坐标 */
      y: number,
      /** 圆的半径 */
      r: number,
      /** 起始弧度，单位弧度（在3点钟方向） */
      sAngle: number,
      /** 终止弧度 */
      eAngle: number,
      /** 弧度的方向是否是逆时针 */
      counterclockwise?: boolean
    ): void
    /** [CanvasContext.arcTo(number x1, number y1, number x2, number y2, number radius)](CanvasContext.arcTo.md)
     *
     * 根据控制点和半径绘制圆弧路径。
     *
     * 最低基础库： `1.9.90` */
    arcTo(
      /** 第一个控制点的 x 轴坐标 */
      x1: number,
      /** 第一个控制点的 y 轴坐标 */
      y1: number,
      /** 第二个控制点的 x 轴坐标 */
      x2: number,
      /** 第二个控制点的 y 轴坐标 */
      y2: number,
      /** 圆弧的半径 */
      radius: number
    ): void
    /** [CanvasContext.beginPath()](CanvasContext.beginPath.md)
     *
     * 开始创建一个路径。需要调用 `fill` 或者 `stroke` 才会使用路径进行填充或描边
     *
     *   - 在最开始的时候相当于调用了一次 `beginPath`。
     *   - 同一个路径内的多次 `setFillStyle`、`setStrokeStyle`、`setLineWidth`等设置，以最后一次设置为准。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // begin path
   ctx.rect(10, 10, 100, 30)
   ctx.setFillStyle('yellow')
   ctx.fill()
   // begin another path
   ctx.beginPath()
   ctx.rect(10, 40, 100, 30)
   // only fill this rect, not in current path
   ctx.setFillStyle('blue')
   ctx.fillRect(10, 70, 100, 30)
   ctx.rect(10, 100, 100, 30)
   // it will fill current path
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.draw()
   ```
     *
     * ![] */
    beginPath(): void
    /** [CanvasContext.bezierCurveTo()](CanvasContext.bezierCurveTo.md)
     *
     * 创建三次方贝塞尔曲线路径。曲线的起始点为路径中前一个点。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Draw points
   ctx.beginPath()
   ctx.arc(20, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(200, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('lightgreen')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(20, 100, 2, 0, 2   Math.PI)
   ctx.arc(200, 100, 2, 0, 2   Math.PI)
   ctx.setFillStyle('blue')
   ctx.fill()
   ctx.setFillStyle('black')
   ctx.setFontSize(12)
   // Draw guides
   ctx.beginPath()
   ctx.moveTo(20, 20)
   ctx.lineTo(20, 100)
   ctx.lineTo(150, 75)
   ctx.moveTo(200, 20)
   ctx.lineTo(200, 100)
   ctx.lineTo(70, 75)
   ctx.setStrokeStyle('#AAAAAA')
   ctx.stroke()
   // Draw quadratic curve
   ctx.beginPath()
   ctx.moveTo(20, 20)
   ctx.bezierCurveTo(20, 100, 200, 100, 200, 20)
   ctx.setStrokeStyle('black')
   ctx.stroke()
   ctx.draw()
   ```
     *
     * ![]
     *
     * 针对 moveTo(20, 20) bezierCurveTo(20, 100, 200, 100, 200, 20) 的三个关键坐标如下：
     *
     * - 红色：起始点(20, 20)
     * - 蓝色：两个控制点(20, 100) (200, 100)
     * - 绿色：终止点(200, 20) */
    bezierCurveTo(): void
    /** [CanvasContext.clearRect(number x, number y, number width, number height)](CanvasContext.clearRect.md)
     *
     * 清除画布上在该矩形区域内的内容
     *
     * **示例代码**
     *
     *
     * clearRect 并非画一个白色的矩形在地址区域，而是清空，为了有直观感受，对 canvas 加了一层背景色。
   ```html
   <canvas canvas-id="myCanvas" style="border: 1px solid; background: #123456;"/>
   ```
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(0, 0, 150, 200)
   ctx.setFillStyle('blue')
   ctx.fillRect(150, 0, 150, 200)
   ctx.clearRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    clearRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.clip()](CanvasContext.clip.md)
     *
     * 从原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。可以在使用 `clip` 方法前通过使用 `save` 方法对当前画布区域进行保存，并在以后的任意时间通过`restore`方法对其进行恢复。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   wx.downloadFile({
   url: 'http://is5.mzstatic.com/image/thumb/Purple128/v4/75/3b/90/753b907c-b7fb-5877-215a-759bd73691a4/source/50x50bb.jpg',
   success: function(res) {
   ctx.save()
   ctx.beginPath()
   ctx.arc(50, 50, 25, 0, 2 Math.PI)
   ctx.clip()
   ctx.drawImage(res.tempFilePath, 25, 25)
   ctx.restore()
   ctx.draw()
   }
   })
   ```
     * ![]
     *
     * 最低基础库： `1.6.0` */
    clip(): void
    /** [CanvasContext.closePath()](CanvasContext.closePath.md)
     *
     * 关闭一个路径。会连接起点和终点。如果关闭路径后没有调用 `fill` 或者 `stroke` 并开启了新的路径，那之前的路径将不会被渲染。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.lineTo(100, 100)
   ctx.closePath()
   ctx.stroke()
   ctx.draw()
   ```
     * ![]
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // begin path
   ctx.rect(10, 10, 100, 30)
   ctx.closePath()
   // begin another path
   ctx.beginPath()
   ctx.rect(10, 40, 100, 30)
   // only fill this rect, not in current path
   ctx.setFillStyle('blue')
   ctx.fillRect(10, 70, 100, 30)
   ctx.rect(10, 100, 100, 30)
   // it will fill current path
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.draw()
   ```
     *
     * ![] */
    closePath(): void
    /** [CanvasContext.createPattern(string image, string repetition)](CanvasContext.createPattern.md)
     *
     * 对指定的图像创建模式的方法，可在指定的方向上重复元图像
     *
     * 最低基础库： `1.9.90` */
    createPattern(
      /** 重复的图像源，仅支持包内路径和临时路径 */
      image: string,
      /** 如何重复图像 */
      repetition: string
    ): void
    /** [CanvasContext.draw(boolean reserve, function callback)](CanvasContext.draw.md)
     *
     * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
     *
     * **示例代码**
     *
     *
     * 第二次 draw() reserve 为 true。所以保留了上一次的绘制结果，在上下文设置的 fillStyle 'red' 也变成了默认的 'black'。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   ctx.draw()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw(true)
   ```
     * ![]
     *
     * **示例代码**
     *
     *
     * 第二次 draw() reserve 为 false。所以没有保留了上一次的绘制结果和在上下文设置的 fillStyle 'red'。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   ctx.draw()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw()
   ```
     * ![] */
    draw(
      /** 本次绘制是否接着上一次绘制。即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。 */
      reserve?: boolean,
      /** 绘制完成后执行的回调函数 */
      callback?: Function
    ): void
    /** [CanvasContext.drawImage(string imageResource, number sx, number sy, number sWidth, number sHeight, number dx, number dy, number dWidth, number dHeight)](CanvasContext.drawImage.md)
     *
     * 绘制图像到画布
     *
     * **示例代码**
     *
     *
     *
     * 有三个版本的写法：
     *
     * - drawImage(imageResource, dx, dy)
     * - drawImage(imageResource, dx, dy, dWidth, dHeight)
     * - drawImage(imageResource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) 从 1.9.0 起支持
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   wx.chooseImage({
   success: function(res){
   ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
   ctx.draw()
   }
   })
   ```
     * ![] */
    drawImage(
      /** 所要绘制的图片资源 */
      imageResource: string,
      /** 源图像的矩形选择框的左上角 x 坐标 */
      sx: number,
      /** 源图像的矩形选择框的左上角 y 坐标 */
      sy: number,
      /** 源图像的矩形选择框的宽度 */
      sWidth: number,
      /** 源图像的矩形选择框的高度 */
      sHeight: number,
      /** 图像的左上角在目标 canvas 上 x 轴的位置 */
      dx: number,
      /** 图像的左上角在目标 canvas 上 y 轴的位置 */
      dy: number,
      /** 在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放 */
      dWidth: number,
      /** 在目标画布上绘制图像的高度，允许对绘制的图像进行缩放 */
      dHeight: number
    ): void
    /** [CanvasContext.fill()](CanvasContext.fill.md)
     *
     * 对当前路径中的内容进行填充。默认的填充色为黑色。
     *
     * **示例代码**
     *
     *
     *
     * 如果当前路径没有闭合，fill() 方法会将起点和终点进行连接，然后填充。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.lineTo(100, 100)
   ctx.fill()
   ctx.draw()
   ```
     *
     * fill() 填充的的路径是从 beginPath() 开始计算，但是不会将 fillRect() 包含进去。
     *
     * ![]
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // begin path
   ctx.rect(10, 10, 100, 30)
   ctx.setFillStyle('yellow')
   ctx.fill()
   // begin another path
   ctx.beginPath()
   ctx.rect(10, 40, 100, 30)
   // only fill this rect, not in current path
   ctx.setFillStyle('blue')
   ctx.fillRect(10, 70, 100, 30)
   ctx.rect(10, 100, 100, 30)
   // it will fill current path
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.draw()
   ```
     *
     * ![] */
    fill(): void
    /** [CanvasContext.fillRect(number x, number y, number width, number height)](CanvasContext.fillRect.md)
     *
     * 填充一个矩形。用 [`setFillStyle`] 设置矩形的填充色，如果没设置默认是黑色。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    fillRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.fillText(string text, number x, number y, number maxWidth)](CanvasContext.fillText.md)
     *
     * 在画布上绘制被填充的文本
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFontSize(20)
   ctx.fillText('Hello', 20, 20)
   ctx.fillText('MINA', 100, 100)
   ctx.draw()
   ```
     * ![] */
    fillText(
      /** 在画布上输出的文本 */
      text: string,
      /** 绘制文本的左上角 x 坐标位置 */
      x: number,
      /** 绘制文本的左上角 y 坐标位置 */
      y: number,
      /** 需要绘制的最大宽度，可选 */
      maxWidth?: number
    ): void
    /** [CanvasContext.lineTo(number x, number y)](CanvasContext.lineTo.md)
     *
     * 增加一个新点，然后创建一条从上次指定点到目标点的线。用 `stroke` 方法来画线条
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.rect(10, 10, 100, 50)
   ctx.lineTo(110, 60)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    lineTo(
      /** 目标位置的 x 坐标 */
      x: number,
      /** 目标位置的 y 坐标 */
      y: number
    ): void
    /** [CanvasContext.moveTo(number x, number y)](CanvasContext.moveTo.md)
     *
     * 把路径移动到画布中的指定点，不创建线条。用 `stroke` 方法来画线条
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.moveTo(10, 50)
   ctx.lineTo(100, 50)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    moveTo(
      /** 目标位置的 x 坐标 */
      x: number,
      /** 目标位置的 y 坐标 */
      y: number
    ): void
    /** [CanvasContext.quadraticCurveTo(number cpx, number cpy, number x, number y)](CanvasContext.quadraticCurveTo.md)
     *
     * 创建二次贝塞尔曲线路径。曲线的起始点为路径中前一个点。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Draw points
   ctx.beginPath()
   ctx.arc(20, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(200, 20, 2, 0, 2   Math.PI)
   ctx.setFillStyle('lightgreen')
   ctx.fill()
   ctx.beginPath()
   ctx.arc(20, 100, 2, 0, 2   Math.PI)
   ctx.setFillStyle('blue')
   ctx.fill()
   ctx.setFillStyle('black')
   ctx.setFontSize(12)
   // Draw guides
   ctx.beginPath()
   ctx.moveTo(20, 20)
   ctx.lineTo(20, 100)
   ctx.lineTo(200, 20)
   ctx.setStrokeStyle('#AAAAAA')
   ctx.stroke()
   // Draw quadratic curve
   ctx.beginPath()
   ctx.moveTo(20, 20)
   ctx.quadraticCurveTo(20, 100, 200, 20)
   ctx.setStrokeStyle('black')
   ctx.stroke()
   ctx.draw()
   ```
     *
     * ![]
     *
     * 针对 moveTo(20, 20) quadraticCurveTo(20, 100, 200, 20) 的三个关键坐标如下：
     *
     * - 红色：起始点(20, 20)
     * - 蓝色：控制点(20, 100)
     * - 绿色：终止点(200, 20) */
    quadraticCurveTo(
      /** 贝塞尔控制点的 x 坐标 */
      cpx: number,
      /** 贝塞尔控制点的 y 坐标 */
      cpy: number,
      /** 结束点的 x 坐标 */
      x: number,
      /** 结束点的 y 坐标 */
      y: number
    ): void
    /** [CanvasContext.rect(number x, number y, number width, number height)](CanvasContext.rect.md)
     *
     * 创建一个矩形路径。需要用 [`fill`] 方法将矩形真正的画到 `canvas` 中
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.rect(10, 10, 150, 75)
   ctx.setFillStyle('red')
   ctx.fill()
   ctx.draw()
   ```
     * ![] */
    rect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.restore()](CanvasContext.restore.md)
     *
     * 恢复之前保存的绘图上下文。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // save the default fill style
   ctx.save()
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   // restore to the previous saved state
   ctx.restore()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw()
   ```
     * ![] */
    restore(): void
    /** [CanvasContext.rotate(number rotate)](CanvasContext.rotate.md)
     *
     * 以原点为中心顺时针旋转当前坐标轴。多次调用旋转的角度会叠加。原点可以用 `translate` 方法修改。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.strokeRect(100, 10, 150, 100)
   ctx.rotate(20   Math.PI / 180)
   ctx.strokeRect(100, 10, 150, 100)
   ctx.rotate(20   Math.PI / 180)
   ctx.strokeRect(100, 10, 150, 100)
   ctx.draw()
   ```
     * ![] */
    rotate(
      /** 旋转角度，以弧度计 degrees * Math.PI/180；degrees 范围为 0-360 */
      rotate: number
    ): void
    /** [CanvasContext.save()](CanvasContext.save.md)
     *
     * 保存绘图上下文。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // save the default fill style
   ctx.save()
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   // restore to the previous saved state
   ctx.restore()
   ctx.fillRect(50, 50, 150, 100)
   ctx.draw()
   ```
     * ![] */
    save(): void
    /** [CanvasContext.scale(number scaleWidth, number scaleHeight)](CanvasContext.scale.md)
     *
     * 在调用后，之后创建的路径其横纵坐标会被缩放。多次调用倍数会相乘。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.strokeRect(10, 10, 25, 15)
   ctx.scale(2, 2)
   ctx.strokeRect(10, 10, 25, 15)
   ctx.scale(2, 2)
   ctx.strokeRect(10, 10, 25, 15)
   ctx.draw()
   ```
     * ![] */
    scale(
      /** 横坐标缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) */
      scaleWidth: number,
      /** 纵坐标轴缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%) */
      scaleHeight: number
    ): void
    /** [CanvasContext.setFillStyle([Color] color)](CanvasContext.setFillStyle.md)
     *
     * 设置填充色。
     *
     * **代码示例**
     *
     *
   ```js
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    setFillStyle(
      /** [Color]
       *
       * 填充的颜色，默认颜色为 black。 */
      color: Color
    ): void
    /** [CanvasContext.setFontSize(number fontSize)](CanvasContext.setFontSize.md)
     *
     * 设置字体的字号
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFontSize(20)
   ctx.fillText('20', 20, 20)
   ctx.setFontSize(30)
   ctx.fillText('30', 40, 40)
   ctx.setFontSize(40)
   ctx.fillText('40', 60, 60)
   ctx.setFontSize(50)
   ctx.fillText('50', 90, 90)
   ctx.draw()
   ```
     * ![] */
    setFontSize(
      /** 字体的字号 */
      fontSize: number
    ): void
    /** [CanvasContext.setGlobalAlpha(number alpha)](CanvasContext.setGlobalAlpha.md)
     *
     * 设置全局画笔透明度。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.fillRect(10, 10, 150, 100)
   ctx.setGlobalAlpha(0.2)
   ctx.setFillStyle('blue')
   ctx.fillRect(50, 50, 150, 100)
   ctx.setFillStyle('yellow')
   ctx.fillRect(100, 100, 150, 100)
   ctx.draw()
   ```
     * ![] */
    setGlobalAlpha(
      /** 透明度。范围 0-1，0 表示完全透明，1 表示完全不透明。 */
      alpha: number
    ): void
    /** [CanvasContext.setLineCap(string lineCap)](CanvasContext.setLineCap.md)
     *
     * 设置线条的端点样式
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.beginPath()
   ctx.moveTo(10, 10)
   ctx.lineTo(150, 10)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineCap('butt')
   ctx.setLineWidth(10)
   ctx.moveTo(10, 30)
   ctx.lineTo(150, 30)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineCap('round')
   ctx.setLineWidth(10)
   ctx.moveTo(10, 50)
   ctx.lineTo(150, 50)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineCap('square')
   ctx.setLineWidth(10)
   ctx.moveTo(10, 70)
   ctx.lineTo(150, 70)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    setLineCap(
      /** 线条的结束端点样式 */
      lineCap: string
    ): void
    /** [CanvasContext.setLineDash(Array.<number> pattern, number offset)](CanvasContext.setLineDash.md)
     *
     * 设置虚线样式。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setLineDash([10, 20], 5);
   ctx.beginPath();
   ctx.moveTo(0,100);
   ctx.lineTo(400, 100);
   ctx.stroke();
   ctx.draw()
   ```
     * ![]
     *
     * 最低基础库： `1.6.0` */
    setLineDash(
      /** 一组描述交替绘制线段和间距（坐标空间单位）长度的数字 */
      pattern: Array<number>,
      /** 虚线偏移量 */
      offset: number
    ): void
    /** [CanvasContext.setLineJoin(string lineJoin)](CanvasContext.setLineJoin.md)
     *
     * 设置线条的交点样式
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.beginPath()
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 50)
   ctx.lineTo(10, 90)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineJoin('bevel')
   ctx.setLineWidth(10)
   ctx.moveTo(50, 10)
   ctx.lineTo(140, 50)
   ctx.lineTo(50, 90)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineJoin('round')
   ctx.setLineWidth(10)
   ctx.moveTo(90, 10)
   ctx.lineTo(180, 50)
   ctx.lineTo(90, 90)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineJoin('miter')
   ctx.setLineWidth(10)
   ctx.moveTo(130, 10)
   ctx.lineTo(220, 50)
   ctx.lineTo(130, 90)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    setLineJoin(
      /** 线条的结束交点样式 */
      lineJoin: string
    ): void
    /** [CanvasContext.setLineWidth(number lineWidth)](CanvasContext.setLineWidth.md)
     *
     * 设置线条的宽度
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.beginPath()
   ctx.moveTo(10, 10)
   ctx.lineTo(150, 10)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineWidth(5)
   ctx.moveTo(10, 30)
   ctx.lineTo(150, 30)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineWidth(10)
   ctx.moveTo(10, 50)
   ctx.lineTo(150, 50)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineWidth(15)
   ctx.moveTo(10, 70)
   ctx.lineTo(150, 70)
   ctx.stroke()
   ctx.draw()
   ```
     *
     * ![] */
    setLineWidth(
      /** 线条的宽度，单位px */
      lineWidth: number
    ): void
    /** [CanvasContext.setMiterLimit(number miterLimit)](CanvasContext.setMiterLimit.md)
     *
     * 设置最大斜接长度。斜接长度指的是在两条线交汇处内角和外角之间的距离。当 [CanvasContext.setLineJoin()] 为 miter 时才有效。超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.beginPath()
   ctx.setLineWidth(10)
   ctx.setLineJoin('miter')
   ctx.setMiterLimit(1)
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 50)
   ctx.lineTo(10, 90)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineWidth(10)
   ctx.setLineJoin('miter')
   ctx.setMiterLimit(2)
   ctx.moveTo(50, 10)
   ctx.lineTo(140, 50)
   ctx.lineTo(50, 90)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineWidth(10)
   ctx.setLineJoin('miter')
   ctx.setMiterLimit(3)
   ctx.moveTo(90, 10)
   ctx.lineTo(180, 50)
   ctx.lineTo(90, 90)
   ctx.stroke()
   ctx.beginPath()
   ctx.setLineWidth(10)
   ctx.setLineJoin('miter')
   ctx.setMiterLimit(4)
   ctx.moveTo(130, 10)
   ctx.lineTo(220, 50)
   ctx.lineTo(130, 90)
   ctx.stroke()
   ctx.draw()
   ```
     * ![] */
    setMiterLimit(
      /** 最大斜接长度 */
      miterLimit: number
    ): void
    /** [CanvasContext.setShadow(number offsetX, number offsetY, number blur, string color)](CanvasContext.setShadow.md)
     *
     * 设定阴影样式。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setFillStyle('red')
   ctx.setShadow(10, 50, 50, 'blue')
   ctx.fillRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    setShadow(
      /** 阴影相对于形状在水平方向的偏移，默认值为 0。 */
      offsetX: number,
      /** 阴影相对于形状在竖直方向的偏移，默认值为 0。 */
      offsetY: number,
      /** 阴影的模糊级别，数值越大越模糊。范围 0- 100。，默认值为 0。 */
      blur: number,
      /** 阴影的颜色。默认值为 black。 */
      color: string
    ): void
    /** [CanvasContext.setStrokeStyle([Color] color)](CanvasContext.setStrokeStyle.md)
     *
     * 设置描边颜色。
     *
     * **代码示例**
     *
     *
   ```js
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setStrokeStyle('red')
   ctx.strokeRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    setStrokeStyle(
      /** [Color]
       *
       * 描边的颜色，默认颜色为 black。 */
      color: Color
    ): void
    /** [CanvasContext.setTextAlign(string align)](CanvasContext.setTextAlign.md)
     *
     * 设置文字的对齐
     *
     * **示例代码**
     *
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setStrokeStyle('red')
   ctx.moveTo(150, 20)
   ctx.lineTo(150, 170)
   ctx.stroke()
   ctx.setFontSize(15)
   ctx.setTextAlign('left')
   ctx.fillText('textAlign=left', 150, 60)
   ctx.setTextAlign('center')
   ctx.fillText('textAlign=center', 150, 80)
   ctx.setTextAlign('right')
   ctx.fillText('textAlign=right', 150, 100)
   ctx.draw()
   ```
     *
     * ![]
     *
     * 最低基础库： `1.1.0` */
    setTextAlign(
      /** 文字的对齐方式 */
      align: string
    ): void
    /** [CanvasContext.setTextBaseline(string textBaseline)](CanvasContext.setTextBaseline.md)
     *
     * 设置文字的竖直对齐
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setStrokeStyle('red')
   ctx.moveTo(5, 75)
   ctx.lineTo(295, 75)
   ctx.stroke()
   ctx.setFontSize(20)
   ctx.setTextBaseline('top')
   ctx.fillText('top', 5, 75)
   ctx.setTextBaseline('middle')
   ctx.fillText('middle', 50, 75)
   ctx.setTextBaseline('bottom')
   ctx.fillText('bottom', 120, 75)
   ctx.setTextBaseline('normal')
   ctx.fillText('normal', 200, 75)
   ctx.draw()
   ```
     * ![]
     *
     * 最低基础库： `1.4.0` */
    setTextBaseline(
      /** 文字的竖直对齐方式 */
      textBaseline: string
    ): void
    /** [CanvasContext.setTransform(number scaleX, number scaleY, number skewX, number skewY, number translateX, number translateY)](CanvasContext.setTransform.md)
     *
     * 使用矩阵重新设置（覆盖）当前变换的方法
     *
     * 最低基础库： `1.9.90` */
    setTransform(
      /** 水平缩放 */
      scaleX: number,
      /** 垂直缩放 */
      scaleY: number,
      /** 水平倾斜 */
      skewX: number,
      /** 垂直倾斜 */
      skewY: number,
      /** 水平移动 */
      translateX: number,
      /** 垂直移动 */
      translateY: number
    ): void
    /** [CanvasContext.stroke()](CanvasContext.stroke.md)
     *
     * 画出当前路径的边框。默认颜色色为黑色。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.moveTo(10, 10)
   ctx.lineTo(100, 10)
   ctx.lineTo(100, 100)
   ctx.stroke()
   ctx.draw()
   ```
     * ![]
     *
     * stroke() 描绘的的路径是从 beginPath() 开始计算，但是不会将 strokeRect() 包含进去。
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // begin path
   ctx.rect(10, 10, 100, 30)
   ctx.setStrokeStyle('yellow')
   ctx.stroke()
   // begin another path
   ctx.beginPath()
   ctx.rect(10, 40, 100, 30)
   // only stoke this rect, not in current path
   ctx.setStrokeStyle('blue')
   ctx.strokeRect(10, 70, 100, 30)
   ctx.rect(10, 100, 100, 30)
   // it will stroke current path
   ctx.setStrokeStyle('red')
   ctx.stroke()
   ctx.draw()
   ```
     *
     * ![] */
    stroke(): void
    /** [CanvasContext.strokeRect(number x, number y, number width, number height)](CanvasContext.strokeRect.md)
     *
     * 画一个矩形(非填充)。 用 [`setStrokeStyle`] 设置矩形线条的颜色，如果没设置默认是黑色。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.setStrokeStyle('red')
   ctx.strokeRect(10, 10, 150, 75)
   ctx.draw()
   ```
     * ![] */
    strokeRect(
      /** 矩形路径左上角的横坐标 */
      x: number,
      /** 矩形路径左上角的纵坐标 */
      y: number,
      /** 矩形路径的宽度 */
      width: number,
      /** 矩形路径的高度 */
      height: number
    ): void
    /** [CanvasContext.strokeText(string text, number x, number y, number maxWidth)](CanvasContext.strokeText.md)
     *
     * 给定的 (x, y) 位置绘制文本描边的方法
     *
     * 最低基础库： `1.9.90` */
    strokeText(
      /** 要绘制的文本 */
      text: string,
      /** 文本起始点的 x 轴坐标 */
      x: number,
      /** 文本起始点的 y 轴坐标 */
      y: number,
      /** 需要绘制的最大宽度，可选 */
      maxWidth?: number
    ): void
    /** [CanvasContext.transform(number scaleX, number scaleY, number skewX, number skewY, number translateX, number translateY)](CanvasContext.transform.md)
     *
     * 使用矩阵多次叠加当前变换的方法
     *
     * 最低基础库： `1.9.90` */
    transform(
      /** 水平缩放 */
      scaleX: number,
      /** 垂直缩放 */
      scaleY: number,
      /** 水平倾斜 */
      skewX: number,
      /** 垂直倾斜 */
      skewY: number,
      /** 水平移动 */
      translateX: number,
      /** 垂直移动 */
      translateY: number
    ): void
    /** [CanvasContext.translate(number x, number y)](CanvasContext.translate.md)
     *
     * 对当前坐标系的原点 (0, 0) 进行变换。默认的坐标系原点为页面左上角。
     *
     * **示例代码**
     *
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   ctx.strokeRect(10, 10, 150, 100)
   ctx.translate(20, 20)
   ctx.strokeRect(10, 10, 150, 100)
   ctx.translate(20, 20)
   ctx.strokeRect(10, 10, 150, 100)
   ctx.draw()
   ```
     *
     * ![] */
    translate(
      /** 水平坐标平移量 */
      x: number,
      /** 竖直坐标平移量 */
      y: number
    ): void
    /** [Object CanvasContext.measureText(string text)](CanvasContext.measureText.md)
     *
     * 测量文本尺寸信息。目前仅返回文本宽度。同步接口。
     *
     * 最低基础库： `1.9.90` */
    measureText(
      /** 要测量的文本 */
      text: string
    ): TextMetrics
    /** [[CanvasGradient] CanvasContext.createCircularGradient(number x, number y, number r)](CanvasContext.createCircularGradient.md)
     *
     * 创建一个圆形的渐变颜色。起点在圆心，终点在圆环。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()] 来指定渐变点，至少要两个。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Create circular gradient
   const grd = ctx.createCircularGradient(75, 50, 50)
   grd.addColorStop(0, 'red')
   grd.addColorStop(1, 'white')
   // Fill with gradient
   ctx.setFillStyle(grd)
   ctx.fillRect(10, 10, 150, 80)
   ctx.draw()
   ```
     * ![] */
    createCircularGradient(
      /** 圆心的 x 坐标 */
      x: number,
      /** 圆心的 y 坐标 */
      y: number,
      /** 圆的半径 */
      r: number
    ): CanvasGradient
    /** [[CanvasGradient] CanvasContext.createLinearGradient(number x0, number y0, number x1, number y1)](CanvasContext.createLinearGradient.md)
     *
     * 创建一个线性的渐变颜色。返回的`CanvasGradient`对象需要使用 [CanvasGradient.addColorStop()] 来指定渐变点，至少要两个。
     *
     * **示例代码**
     *
     *
   ```javascript
   const ctx = wx.createCanvasContext('myCanvas')
   // Create linear gradient
   const grd = ctx.createLinearGradient(0, 0, 200, 0)
   grd.addColorStop(0, 'red')
   grd.addColorStop(1, 'white')
   // Fill with gradient
   ctx.setFillStyle(grd)
   ctx.fillRect(10, 10, 150, 80)
   ctx.draw()
   ```
     * ![] */
    createLinearGradient(
      /** 起点的 x 坐标 */
      x0: number,
      /** 起点的 y 坐标 */
      y0: number,
      /** 终点的 x 坐标 */
      x1: number,
      /** 终点的 y 坐标 */
      y1: number
    ): CanvasGradient
  }

  interface Page {
    /**
     * 当前页面的路径
     */
    route: string

    [k: string]: any
  }

  function getCurrentPages(): Page[]
  function getApp(): any

  namespace getLaunchOptionsSync {
    interface Return {
      /**
       * 启动小程序的路径
       */
      path: string
      /**
       * 启动小程序的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html)
       */
      scene: number
      /**
       * 启动小程序的 query 参数
       */
      query: { [k: string]: any }
      /**
       * shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html)
       */
      shareTicket: string
      /**
       * 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。
       */
      referrerInfo: { appId: string, extraData: { [k: string]: any} }
    }
  }

  /**
   * @since 2.1.2
   *
   * 获取小程序启动时的参数。与 `App.onLaunch` 的回调参数一致。
   *
   * **注意**
   * 部分版本在无 `referrerInfo` 的时候会返回 undefined，
   * 建议使用 `options.referrerInfo && options.referrerInfo.appId` 进行判断。
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
   */
  function getLaunchOptionsSync(): getLaunchOptionsSync.Return

  namespace cloud {
    interface ICloudConfig {
      env?: string | object
      traceUser?: boolean
    }
    interface IAPIError {
      errMsg: string
    }

    interface IAPIParam<T = any> {
      config?: ICloudConfig
      success?: (res: T) => void
      fail?: (err: IAPIError) => void
      complete?: (val: T | IAPIError) => void
    }

    interface IAPISuccessParam {
      errMsg: string
    }

    class InternalSymbol {}
    type AnyObject = {
      [x: string]: any
    }
    type AnyFunction = (...args: any[]) => any
    namespace ICloud {
      interface ICloudAPIParam<T = any> extends IAPIParam<T> {
        config?: ICloudConfig
      }
      // === API: callFunction ===
      export type CallFunctionData = AnyObject

      export interface CallFunctionResult extends IAPISuccessParam {
        result: AnyObject | string | undefined
      }

      export interface CallFunctionParam extends ICloudAPIParam<CallFunctionResult> {
        name: string
        data?: CallFunctionData
        slow?: boolean
      }
      // === end ===

      // === API: uploadFile ===
      export interface UploadFileResult extends IAPISuccessParam {
        fileID: string
        statusCode: number
      }

      export interface UploadFileParam extends ICloudAPIParam<UploadFileResult> {
        cloudPath: string
        filePath: string
        header?: AnyObject
      }
      // === end ===

      // === API: downloadFile ===
      export interface DownloadFileResult extends IAPISuccessParam {
        tempFilePath: string
        statusCode: number
      }

      export interface DownloadFileParam extends ICloudAPIParam<DownloadFileResult> {
        fileID: string
        cloudPath?: string
      }
      // === end ===

      // === API: getTempFileURL ===
      export interface GetTempFileURLResult extends IAPISuccessParam {
        fileList: GetTempFileURLResultItem[]
      }

      export interface GetTempFileURLResultItem {
        fileID: string
        tempFileURL: string
        maxAge: number
        status: number
        errMsg: string
      }

      export interface GetTempFileURLParam extends ICloudAPIParam<GetTempFileURLResult> {
        fileList: string[]
      }
      // === end ===

      // === API: deleteFile ===
      interface DeleteFileResult extends IAPISuccessParam {
        fileList: DeleteFileResultItem[]
      }

      interface DeleteFileResultItem {
        fileID: string
        status: number
        errMsg: string
      }

      interface DeleteFileParam extends ICloudAPIParam<DeleteFileResult> {
        fileList: string[]
      }
      // === end ===
    }

    namespace WXNS {
      interface AnyObject {
        [key: string]: any
      }

      interface IAPIParam<T> {
        success?: (res: T) => void
        fail?: (err: IAPIError) => void
        complete?: (val: T | IAPIError) => void
      }

      interface CommonAPIResult {
        errMsg: string
      }

      interface IAPIError {
        errMsg: string
      }

      interface IProgressUpdateEvent {
        progress: number
        totalBytesWritten: number
        totalBytesExpectedToWrite: number
      }

      interface operateWXData {
        (param: any): void
      }

      interface uploadFile {
        /**
         * upload file
         * @param param
         */
        (param: IUploadFileParam): IUploadFileTask
      }

      interface IUploadFileParam extends IAPIParam<IUploadFileSuccessResult> {
        url: string
        filePath: string
        name: string
        header?: AnyObject
      }

      interface IUploadFileSuccessResult extends CommonAPIResult {
        data: string
        statusCode: number
      }

      interface IUploadFileTask {
        onProgressUpdate: (fn: (event: IProgressUpdateEvent) => void) => void
        abort: AnyFunction
      }

      interface downloadFile {
        /**
         * download file
         * @param param
         */
        (param: IDownloadFileParam): IDownloadFileTask
      }

      interface IDownloadFileParam extends IAPIParam<IDownloadFileSuccessResult> {
        url: string
        header?: AnyObject
      }

      interface IDownloadFileSuccessResult extends CommonAPIResult {
        tempFilePath: string
        statusCode: number
      }

      interface IDownloadFileTask {
        onProgressUpdate: (fn: (event: IProgressUpdateEvent) => void) => void
        abort: AnyFunction
      }

      interface request {
        (param: IRequestParam): IRequestTask
      }

      interface IRequestParam extends IAPIParam<IRequestSuccessResult> {
        url: string
        data?: AnyObject | string | ArrayBuffer
        header?: AnyObject
        method?: string
        dataType?: string
        responseType?: string
      }

      interface IRequestSuccessResult {
        data: AnyObject | string | ArrayBuffer
        statusCode: number
        header: AnyObject
      }

      interface IRequestTask {
        abort: () => void
      }

      interface getFileInfo {
        (param: IGetFileInfoParam): void
      }

      interface IGetFileInfoParam extends IAPIParam<IGetFileInfoSuccessResult> {
        filePath: string
        digestAlgorithm?: string
      }

      interface IGetFileInfoSuccessResult {
        size: number
        digest: string
      }
    }

    // === Database ===
    namespace DB {
      /**
       * The class of all exposed cloud database instances
       */
      export class Database {
        public readonly config: ICloudConfig
        public readonly command: DatabaseCommand
        public readonly Geo: Geo
        public readonly serverDate: () => ServerDate

        private constructor()

        collection(collectionName: string): CollectionReference
      }

      export class CollectionReference extends Query {
        public readonly collectionName: string
        public readonly database: Database

        private constructor(name: string, database: Database)

        doc(docId: string | number): DocumentReference

        add(options: IAddDocumentOptions): Promise<IAddResult> | void
      }

      export class DocumentReference {
        private constructor(docId: string | number, database: Database)

        field(object: object): this

        get(options?: IGetDocumentOptions): Promise<IQuerySingleResult> | void

        set(options?: ISetSingleDocumentOptions): Promise<ISetResult> | void

        update(options?: IUpdateSingleDocumentOptions): Promise<IUpdateResult> | void

        remove(options?: IRemoveSingleDocumentOptions): Promise<IRemoveResult> | void
      }

      export class Query {
        where(condition: IQueryCondition): Query

        orderBy(fieldPath: string, order: string): Query

        limit(max: number): Query

        skip(offset: number): Query

        field(object: object): Query

        get(options?: IGetDocumentOptions): Promise<IQueryResult> & void

        count(options?: ICountDocumentOptions): Promise<ICountResult> & void
      }

      export interface DatabaseCommand {
        eq(val: any): DatabaseQueryCommand
        neq(val: any): DatabaseQueryCommand
        gt(val: any): DatabaseQueryCommand
        gte(val: any): DatabaseQueryCommand
        lt(val: any): DatabaseQueryCommand
        lte(val: any): DatabaseQueryCommand
        in(val: any[]): DatabaseQueryCommand
        nin(val: any[]): DatabaseQueryCommand

        and(...expressions: (DatabaseLogicCommand | IQueryCondition)[]): DatabaseLogicCommand
        or(...expressions: (DatabaseLogicCommand | IQueryCondition)[]): DatabaseLogicCommand

        set(val: any): DatabaseUpdateCommand
        remove(): DatabaseUpdateCommand
        inc(val: number): DatabaseUpdateCommand
        mul(val: number): DatabaseUpdateCommand

        push(...values: any[]): DatabaseUpdateCommand
        pop(): DatabaseUpdateCommand
        shift(): DatabaseUpdateCommand
        unshift(...values: any[]): DatabaseUpdateCommand
      }

      export enum LOGIC_COMMANDS_LITERAL {
        AND = 'and',
        OR = 'or',
        NOT = 'not',
        NOR = 'nor'
      }

      export class DatabaseLogicCommand {
        public fieldName: string | InternalSymbol
        public operator: LOGIC_COMMANDS_LITERAL | string
        public operands: any[]

        _setFieldName(fieldName: string): DatabaseLogicCommand

        and(...expressions: (DatabaseLogicCommand | IQueryCondition)[]): DatabaseLogicCommand
        or(...expressions: (DatabaseLogicCommand | IQueryCondition)[]): DatabaseLogicCommand
      }

      export enum QUERY_COMMANDS_LITERAL {
        EQ = 'eq',
        NEQ = 'neq',
        GT = 'gt',
        GTE = 'gte',
        LT = 'lt',
        LTE = 'lte',
        IN = 'in',
        NIN = 'nin'
      }

      export class DatabaseQueryCommand extends DatabaseLogicCommand {
        public operator: QUERY_COMMANDS_LITERAL | string

        _setFieldName(fieldName: string): DatabaseQueryCommand

        eq(val: any): DatabaseLogicCommand
        neq(val: any): DatabaseLogicCommand
        gt(val: any): DatabaseLogicCommand
        gte(val: any): DatabaseLogicCommand
        lt(val: any): DatabaseLogicCommand
        lte(val: any): DatabaseLogicCommand
        in(val: any[]): DatabaseLogicCommand
        nin(val: any[]): DatabaseLogicCommand
      }

      export enum UPDATE_COMMANDS_LITERAL {
        SET = 'set',
        REMOVE = 'remove',
        INC = 'inc',
        MUL = 'mul',
        PUSH = 'push',
        POP = 'pop',
        SHIFT = 'shift',
        UNSHIFT = 'unshift'
      }

      export class DatabaseUpdateCommand {
        public fieldName: string | InternalSymbol
        public operator: UPDATE_COMMANDS_LITERAL
        public operands: any[]

        constructor(operator: UPDATE_COMMANDS_LITERAL, operands: any[], fieldName?: string | InternalSymbol)

        _setFieldName(fieldName: string): DatabaseUpdateCommand
      }

      export class Batch {}

      /**
       * A contract that all API provider must adhere to
       */
      export class APIBaseContract<PROMISE_RETURN, CALLBACK_RETURN, PARAM extends IAPIParam, CONTEXT = any> {
        getContext(param: PARAM): CONTEXT

        /**
         * In case of callback-style invocation, this function will be called
         */
        getCallbackReturn(param: PARAM, context: CONTEXT): CALLBACK_RETURN

        getFinalParam<T extends PARAM>(param: PARAM, context: CONTEXT): T

        run<T extends PARAM>(param: T): Promise<PROMISE_RETURN>
      }

      export interface GeoPointConstructor {
        new (longitude: number, latitide: number): GeoPoint
      }

      export interface Geo {
        Point: {
          new (longitude: number, latitide: number): GeoPoint
          (longitude: number, latitide: number): GeoPoint
        }
      }

      export abstract class GeoPoint {
        public longitude: number
        public latitude: number

        constructor(longitude: number, latitude: number)

        toJSON(): object
        toString(): string
      }

      export interface IServerDateOptions {
        offset: number
      }

      export abstract class ServerDate {
        public readonly options: IServerDateOptions
        constructor(options?: IServerDateOptions)
      }

      export type DocumentId = string | number

      export interface IDocumentData {
        _id?: DocumentId
        [key: string]: any
      }

      export interface IDBAPIParam extends IAPIParam {}

      export interface IAddDocumentOptions extends IDBAPIParam {
        data: IDocumentData
      }

      export interface IGetDocumentOptions extends IDBAPIParam {}

      export interface ICountDocumentOptions extends IDBAPIParam {}

      export interface IUpdateDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
      }

      export interface IUpdateSingleDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
      }

      export interface ISetDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
      }

      export interface ISetSingleDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
      }

      export interface IRemoveDocumentOptions extends IDBAPIParam {
        query: IQueryCondition
      }

      export interface IRemoveSingleDocumentOptions extends IDBAPIParam {}

      export interface IQueryCondition {
        [key: string]: any
      }

      export type IStringQueryCondition = string

      export interface IQueryResult extends IAPISuccessParam {
        data: IDocumentData[]
      }

      export interface IQuerySingleResult extends IAPISuccessParam {
        data: IDocumentData
      }

      export interface IUpdateCondition {
        [key: string]: any
      }

      export type IStringUpdateCondition = string

      export interface ISetCondition {}

      export interface IAddResult extends IAPISuccessParam {
        _id: DocumentId
      }

      export interface IUpdateResult extends IAPISuccessParam {
        stats: {
          updated: number
          // created: number,
        }
      }

      export interface ISetResult extends IAPISuccessParam {
        _id: DocumentId
        stats: {
          updated: number
          created: number
        }
      }

      export interface IRemoveResult extends IAPISuccessParam {
        stats: {
          removed: number
        }
      }

      export interface ICountResult extends IAPISuccessParam {
        total: number
      }
    }
    function init(OBJECT?: ICloudConfig): void

    function callFunction(param: ICloud.CallFunctionParam): Promise<ICloud.CallFunctionResult> & void
    function uploadFile(param: ICloud.UploadFileParam): Promise<ICloud.UploadFileResult> & WXNS.IUploadFileTask
    function downloadFile(param: ICloud.DownloadFileParam): Promise<ICloud.DownloadFileResult> & WXNS.IDownloadFileTask
    function getTempFileURL(param: ICloud.GetTempFileURLParam): Promise<ICloud.GetTempFileURLResult> & void
    function deleteFile(param: ICloud.DeleteFileParam): Promise<ICloud.DeleteFileResult> & void

    function database(config?: ICloudConfig): DB.Database
  }
}
