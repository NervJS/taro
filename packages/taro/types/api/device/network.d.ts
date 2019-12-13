declare namespace Taro {
  namespace onNetworkStatusChange {
    /** 网络状态变化事件的回调函数 */
    type Callback = (
        result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 当前是否有网络连接 */
      isConnected: boolean
      /** 网络类型 */
      networkType: keyof getNetworkType.networkType
    }
  }
  /** 监听网络状态变化。
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.onNetworkStatusChange(function (res) {
   *   console.log(res.isConnected)
   *   console.log(res.networkType)
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkStatusChange.html
   */
  function onNetworkStatusChange(
    /** 网络状态变化事件的回调函数 */
    callback: onNetworkStatusChange.Callback,
  ): void

  namespace getNetworkType {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 网络类型 */
      networkType: keyof networkType
      /** 调用结果 */
      errMsg: string
    }

    /** 网络类型 */
    interface networkType {
      /** wifi 网络 */
      wifi
      /** 2g 网络 */
      '2g'
      /** 3g 网络 */
      '3g'
      /** 4g 网络 */
      '4g'
      /** Android 下不常见的网络类型 */
      'unknown'
      /** 无网络 */
      'none'
    }
  }
  /** 获取网络类型。
   * @supported weapp, h5, rn
   * @example
   * ```tsx
   * Taro.getNetworkType({
   *   success: function (res)) {
   *     // 返回网络类型, 有效值：
   *     // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
   *     var networkType = res.networkType
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html
   */
  function getNetworkType(option?: getNetworkType.Option): Promise<getNetworkType.SuccessCallbackResult>

  /** 取消监听网络状态变化事件，参数为空，则取消所有的事件监听。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.offNetworkStatusChange.html
   */
  function offNetworkStatusChange(
    /** 网络状态变化事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void
}
