declare namespace Taro {
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
     * `button`：页面内转发按钮
     * `menu`：右上角转发菜单
     * 
     * @since 1.2.4
     */
    from?: 'button' | 'menu' | string
    /**
     * 如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined`
     * 
     * @since 1.2.4
     */
    target?: object
    /**
     * 页面中包含 `<web-view>` 组件时，返回当前 `<web-view>` 的 url
     * 
     * @since 1.6.4
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
     * 默认使用截图
     * 
     * @since 1.5.0
     */
    imageUrl?: string
  }

  interface TabItemTapObject {
    /**
     * 被点击tabItem的序号，从 0 开始
     * 
     * @since 1.9.0
     */
    index: string

    /**
     * 被点击tabItem的页面路径
     * 
     * @since 1.9.0
     */
    pagePath: string

    /**
     * 被点击tabItem的按钮文字
     * 
     * @since 1.9.0
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
}
