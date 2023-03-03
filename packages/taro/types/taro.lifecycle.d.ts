import Taro from './index'

type TaroGetDerivedStateFromProps<P, S> =
  /**
   * Returns an update to a component's state based on its new props and old state.
   *
   * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
   */
  (nextProps: Readonly<P>, prevState: S) => Partial<S> | null

interface TaroStaticLifecycle<P, S> {
  getDerivedStateFromProps?: TaroGetDerivedStateFromProps<P, S>
}

interface TaroNewLifecycle<P, S, SS> {
  /**
   * Runs before React applies the result of `render` to the document, and
   * returns an object to be given to componentDidUpdate. Useful for saving
   * things such as scroll position before `render` causes changes to it.
   *
   * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
   * lifecycle events from running.
   */
  getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null
  /**
   * Called immediately after updating occurs. Not called for the initial render.
   *
   * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
   */
  componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void
}

declare module './index' {
  interface PageNotFoundObject {
    /**
     * 不存在页面的路径
     */
    path: string

    /**
     * 打开不存在页面的 query
     */
    query: Record<string, unknown>

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

  interface PageResizeObject {
    size: {
      windowWidth: number
      windowHeight: number
    }
  }

  interface ShareAppMessageObject {
    /**
     * 转发事件来源
     * `button`：页面内转发按钮
     * `menu`：右上角转发菜单
     */
    from?: 'button' | 'menu' | string
    /**
     * 如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined`
     */
    target?: object
    /**
     * 页面中包含 `<web-view>` 组件时，返回当前 `<web-view>` 的 url
     */
    webViewUrl?: string
  }

  interface ShareAppMessageReturnObject {
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
     * 默认使用截图
     */
    imageUrl?: string
  }

  interface WeappShareAppMessageReturnObject extends ShareAppMessageReturnObject {
    /**
     * 如果该参数存在，则以 resolve 结果为准，如果三秒内不 resolve，分享会使用上面传入的默认参数
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object
     * @example
     * ```tsx
     * import { ShareAppMessageReturnObject, useShareAppMessage } from "@tarojs/taro";
     * // ... else code
     * useShareAppMessage(() => {
     *   const p = new Promise<ShareAppMessageReturnObject>(resolve => {
     *     setTimeout(() => {
     *       resolve({
     *         title: "",
     *         imageUrl: "",
     *         path: ""
     *       })
     *     }, 2000)
     *   })
     *   return {
     *     title: "",
     *     imageUrl: "",
     *     path: "",
     *     promise: p
     *   }
     * });
     * ```
     *
     */
    promise: Promise<ShareAppMessageReturnObject>
  }

  type ShareAppMessageReturn = ShareAppMessageReturnObject | Promise<ShareAppMessageReturnObject> | WeappShareAppMessageReturnObject

  interface TabItemTapObject {
    /**
     * 被点击tabItem的序号，从 0 开始
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

  interface AddToFavoritesObject {
    /**
     * 页面中包含web-view组件时，返回当前web-view的url
     */
    webviewUrl: string
  }

  interface AddToFavoritesReturnObject {
    /**
     * 自定义标题
     */
    title?: string

    /**
     * 自定义图片，显示图片长宽比为 1：1
     */
    imageUrl?: string

    /**
     * 自定义query字段
     */
    query?: string
  }

  interface ShareTimelineReturnObject {
    /**
     * 自定义标题
     */
    title?: string

    /**
     * 自定义页面路径中携带的参数
     */
    query?: string

    /**
     * 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1
     */
    imageUrl?: string
  }

  interface ComponentLifecycle<P, S, SS = any> extends TaroNewLifecycle<P, S, SS> {
    componentWillMount?(): void
    componentDidMount?(): void
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void
    componentWillUnmount?(): void
    componentDidCatch?(err: string): void
    componentDidShow?(): void
    componentDidHide?(): void
    componentDidNotFound?(opt: PageNotFoundObject): void
  }

  interface TaroStatic {
    PageNotFoundObject: PageNotFoundObject
    PageScrollObject: PageScrollObject
    ShareAppMessageObject: ShareAppMessageObject
    ShareAppMessageReturn: ShareAppMessageReturn
    TabItemTapObject: TabItemTapObject
    AddToFavoritesObject: AddToFavoritesObject
    AddToFavoritesReturnObject: AddToFavoritesReturnObject
    ShareTimelineReturnObject: ShareTimelineReturnObject
  }
}
