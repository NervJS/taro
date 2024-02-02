import Taro from '../../index'

declare module '../../index' {
  namespace stopPullDownRefresh {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  namespace startPullDownRefresh {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 停止当前页面下拉刷新。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * onPullDownRefresh: function (){
     *   Taro.stopPullDownRefresh()
     * }
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.stopPullDownRefresh.html
     */
    stopPullDownRefresh(option?: stopPullDownRefresh.Option): void

    /** 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
     * @supported weapp, h5, rn, tt, harmony_hybrid
     * @rn 无动画效果
     * @example
     * ```tsx
     * Taro.startPullDownRefresh()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/ui/pull-down-refresh/wx.startPullDownRefresh.html
     */
    startPullDownRefresh(option?: startPullDownRefresh.Option): Promise<TaroGeneral.CallbackResult>
  }
}
