import Taro from '../../index'

declare module '../../index' {
  namespace onNetworkWeakChange {
    /** 弱网状态变化事件的回调函数 */
    type Callback = (
        result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 当前是否处于弱网状态 */
      weakNet: boolean
      /** 当前网络类型 */
      networkType: keyof getNetworkType.NetworkType
    }
  }

  namespace onNetworkStatusChange {
    /** 网络状态变化事件的回调函数 */
    type Callback = (
        result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 当前是否有网络连接 */
      isConnected: boolean
      /** 网络类型 */
      networkType: keyof getNetworkType.NetworkType
    }
  }

  namespace getNetworkType {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 网络类型 */
      networkType: keyof NetworkType
      /** 信号强弱，单位 dbm */
      signalStrength?: number
      /** 设备是否使用了网络代理 */
      hasSystemProxy?: boolean
      /** 调用结果 */
      errMsg: string
    }

    /** 网络类型 */
    interface NetworkType {
      /** wifi 网络 */
      wifi
      /** 2g 网络 */
      '2g'
      /** 3g 网络 */
      '3g'
      /** 4g 网络 */
      '4g'
      /** 5g 网络 */
      '5g'
      /** Android 下不常见的网络类型 */
      'unknown'
      /** 无网络 */
      'none'
    }
  }

  namespace getLocalIPAddress {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 本机局域网IP地址 */
      localip: string
      /** ，基础库 2.24.0 开始支持 */
      netmask?: string
      /** 调用结果 */
      errMsg: string
    }
  }

  interface TaroStatic {
    /** 监听弱网状态变化事件
     * @supported weapp, swan, qq, tt
     * @example
     * ```tsx
     * Taro.onNetworkWeakChange(function (res) {
     *   console.log(res.weakNet)
     *   console.log(res.networkType)
     * })
     * // 取消监听
     * Taro.offNetworkWeakChange()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkWeakChange.html
     */
    onNetworkWeakChange(
      /** 弱网状态变化事件的回调函数 */
      callback: onNetworkWeakChange.Callback,
    ): void

    /** 监听网络状态变化。
     * @supported weapp, swan, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.onNetworkStatusChange(function (res) {
     *   console.log(res.isConnected)
     *   console.log(res.networkType)
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.onNetworkStatusChange.html
     */
    onNetworkStatusChange(
      /** 网络状态变化事件的回调函数 */
      callback: onNetworkStatusChange.Callback,
    ): void

    /** 取消监听弱网状态变化事件
     * @supported weapp, swan
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.offNetworkWeakChange.html
     */
    offNetworkWeakChange(
      /** 弱网状态变化事件的回调函数 */
      callback?: onNetworkWeakChange.Callback,
    ): void

    /** 取消监听网络状态变化事件，参数为空，则取消所有的事件监听。
     * @supported weapp, swan, h5, rn, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.offNetworkStatusChange.html
     */
    offNetworkStatusChange(
      /** 取消监听网络状态变化事件，参数为空，则取消所有的事件监听 */
      callback?: onNetworkStatusChange.Callback,
    ): void

    /** 获取网络类型。
     * @supported weapp, swan, qq, h5, rn, tt, harmony_hybrid
     * @example
     * ```tsx
     * Taro.getNetworkType({
     *   success: function (res) {
     *     // 返回网络类型, 有效值：
     *     // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
     *     var networkType = res.networkType
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getNetworkType.html
     */
    getNetworkType(option?: getNetworkType.Option): Promise<getNetworkType.SuccessCallbackResult>

    /** 获取局域网IP地址。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getLocalIPAddress()
     *   .then(res => {
     *     const localip = res.localip
     *   })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/network/wx.getLocalIPAddress.html
     */
    getLocalIPAddress(option?: getLocalIPAddress.Option): Promise<getLocalIPAddress.SuccessCallbackResult>
  }
}
