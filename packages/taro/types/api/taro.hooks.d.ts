import Taro from '../index'

declare module '../index' {
  interface TaroStatic {
    /**
     * 页面展示时的回调。
     * @supported global
     */
    useDidShow(callback: (options?: getLaunchOptionsSync.LaunchOptions) => void): void

    /**
     * 页面隐藏时的回调。
     * @supported global
     */
    useDidHide(callback: () => void): void

    /**
     * 下拉刷新时的回调。
     * @supported global
     */
    usePullDownRefresh(callback: () => void): void

    /**
     * 上拉触底时的回调。
     * @supported global
     */
    useReachBottom(callback: () => void): void

    /**
     * 页面滚动时的回调。
     * @supported global
     */
    usePageScroll(callback: (payload: PageScrollObject) => void): void

    /**
     * 页面尺寸改变时的回调。
     * @supported global
     */
    useResize(callback: (payload: PageResizeObject) => void): void

    /**
     * 页面转发时的回调。
     * @supported weapp
     */
    useShareAppMessage(callback: (payload: ShareAppMessageObject) => ShareAppMessageReturn): void

    /**
     * 当前是 tab 页时，tab 被点击时的回调。
     * @supported weapp, h5, rn
     */
    useTabItemTap(callback: (payload: TabItemTapObject) => void): void

    /**
     * 用户点击右上角菜单“收藏”按钮时的回调。
     * @supported weapp
     */
    useAddToFavorites(callback: (payload: AddToFavoritesObject) => AddToFavoritesReturnObject): void

    /**
     * 用户点击右上角菜单“分享到朋友圈”按钮时的回调。
     * @supported weapp
     */
    useShareTimeline(callback: () => ShareTimelineReturnObject): void

    /**
     * 页面销毁前保留状态回调
     * @supported weapp
     */
    useSaveExitState(callback: () => {
      data: Record<any, any>
      expireTimeStamp?: number
    }): void

    /**
     * 小程序初始化完成时的回调。
     * @supported weapp, h5
     */
    useLaunch(callback: (options: getLaunchOptionsSync.LaunchOptions) => void): void

    /**
     * 小程序发生脚本错误或 API 调用报错时触发的回调。
     * @supported weapp, h5
     */
    useError(callback: (error: string) => void): void

    /**
     * 小程序有未处理的 Promise reject 时触发。也可以使用 Taro.onUnhandledRejection 绑定监听。
     * @supported weapp, alipay, h5
     */
    useUnhandledRejection(callback: (error: { reason: Error, promise: Promise<Error> }) => void): void

    /**
     * 小程序要打开的页面不存在时触发的回调。
     * @supported weapp, h5
     * @h5 多页面模式不支持该方法
     */
    usePageNotFound(callback: (res: { path: string, query: Record<any, any>, isEntryPage: boolean, [key: string]: any }) => void): void

    /**
     * 页面加载完成时的回调。
     * @supported weapp, h5
     */
    useLoad<T extends {} = Record<string, any>>(callback: (param: T) => void): void

    /**
     * 页面卸载时的回调。
     * @supported weapp, h5
     */
    useUnload(callback: () => void): void

    /**
     * 页面初次渲染完成的回调。
     * 此时页面已经准备妥当，可以和视图层进行交互。
     * @supported weapp, h5
     */
    useReady(callback: () => void): void

    /**
     * 获取当前路由参数。
     * @supported global
     */
    useRouter<TParams extends Partial<Record<string, string>> = Partial<Record<string, string>>>(dynamic?: boolean): RouterInfo<TParams>

    /**
     * 导航栏的标题被点击时的回调。
     * @supported alipay
     */
    useTitleClick(callback: () => void): void

    /**
     * 导航栏的额外图标被点击时的回调。
     * @supported alipay
     */
    useOptionMenuClick(callback: () => void): void

    /**
     * 下拉中断时的回调。
     * @supported alipay, h5
     */
    usePullIntercept(callback: () => void): void
  }
}
