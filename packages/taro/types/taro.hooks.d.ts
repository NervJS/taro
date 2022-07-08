import Taro from './index'

declare module './index' {
  interface TaroStatic {
    /**
     * 页面展示时的回调。
     */
    useDidShow(callback: () => void): void

    /**
     * 页面隐藏时的回调。
     */
    useDidHide(callback: () => void): void

    /**
     * 下拉刷新时的回调。
     */
    usePullDownRefresh(callback: () => void): void

    /**
     * 上拉触底时的回调。
     */
    useReachBottom(callback: () => void): void

    /**
     * 页面滚动时的回调。
     */
    usePageScroll(callback: (payload: PageScrollObject) => void): void

    /**
     * 页面尺寸改变时的回调。
     */
    useResize(callback: (payload: PageResizeObject) => void): void

    /**
     * 页面转发时的回调。
     */
    useShareAppMessage(callback: (payload: ShareAppMessageObject) => ShareAppMessageReturn): void

    /**
     * 当前是 tab 页时，tab 被点击时的回调。
     */
    useTabItemTap(callback: (payload: TabItemTapObject) => void): void

    /**
     * 用户点击右上角菜单“收藏”按钮时的回调。
     */
    useAddToFavorites(callback: (payload: AddToFavoritesObject) => AddToFavoritesReturnObject): void

    /**
     * 用户点击右上角菜单“分享到朋友圈”按钮时的回调。
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
     */
    useLaunch(callback: (options: getLaunchOptionsSync.LaunchOptions) => void): void

    /**
     * 小程序发生脚本错误或 API 调用报错时触发的回调。
     */
    useError(callback: (error: string) => void): void

    /**
     * 小程序要打开的页面不存在时触发的回调。
     */
    usePageNotFound(callback: (res: { path: string, query: Record<any, any>, isEntryPage: boolean, [key: string]: any }) => void): void

    /**
     * 页面加载完成时的回调。
     */
    useLoad(callback: () => void): void

    /**
     * 页面卸载时的回调。
     */
    useUnload(callback: () => void): void

    /**
     * 页面初次渲染完成的回调。
     * 此时页面已经准备妥当，可以和视图层进行交互。
     */
    useReady(callback: () => void): void

    /**
     * 获取当前路由参数。
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
