import Taro from '../../index'

declare module '../../index' {
  namespace stopWifi {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.WifiError) => void
    }
  }

  namespace startWifi {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.WifiError) => void
    }
  }

  namespace setWifiList {
    interface Option {
      /** 提供预设的 Wi-Fi 信息列表 */
      wifiList: WifiData[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.WifiError) => void
    }

    /** 提供预设的 Wi-Fi 信息列表 */
    interface WifiData {
      /** Wi-Fi 的 BSSID */
      BSSID?: string
      /** Wi-Fi 的 SSID */
      SSID?: string
      /** Wi-Fi 设备密码 */
      password?: string
    }
  }

  namespace onWifiConnectedWithPartialInfo {
    /** 连接上 Wi-Fi 的事件的回调函数 */
    type Callback = (
        result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** 只包含 SSID 属性的 WifiInfo 对象 */
      wifi: Pick<WifiInfo, 'SSID'>
    }
  }

  namespace onWifiConnected {
    /** 连接上 Wi-Fi 的事件的回调函数 */
    type Callback = (
        result: CallbackResult,
    ) => void
    interface CallbackResult {
      /** Wi-Fi 信息 */
      wifi: WifiInfo
    }
  }

  namespace onGetWifiList {
    /** 获取到 Wi-Fi 列表数据事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      /** Wi-Fi 列表数据 */
      wifiList: WifiInfo[]
    }
  }

  namespace getWifiList {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.WifiError) => void
    }
  }

  namespace getConnectedWifi {
    interface Option {
      /** 是否需要返回部分 Wi-Fi 信息
       * @default false
       */
      partialInfo?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.WifiError {
      /** Wi-Fi 信息 */
      wifi: WifiInfo
      /** 调用结果 */
      errMsg: string
    }
  }

  namespace connectWifi {
    interface Option {
      /** Wi-Fi 设备 SSID */
      SSID: string
      /** Wi-Fi 设备密码 */
      password: string
      /** Wi-Fi 设备 BSSID */
      BSSID?: string
      /** 跳转到系统设置页进行连接
       * @default false
       */
      maunal?: boolean
      /** 是否需要返回部分 Wi-Fi 信息，仅安卓生效
       * @default false
       */
      partialInfo?: boolean
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.WifiError) => void
    }
  }

  /** Wifi 信息
   * 
   * 注意:
   * 安卓 Taro.connectWifi / Taro.getConnectedWifi 若设置了 partialInfo:true ，或者调用了 Taro.onWifiConnectedWithPartialInfo 事件。将会返回只包含 SSID 属性的 WifiInfo 对象。 在某些情况下，可能 Wi-Fi 已经连接成功，但会因为获取不到完整的 WifiInfo 对象报错。具体错误信息为 errCode: 12010, errMsg: can't gain current wifi 。如果开发者不需要完整的 WifiInfo 对象，则可以通过采取上述策略解决报错问题。
   */
  interface WifiInfo {
    /** Wi-Fi 的 SSID */
    SSID: string
    /** Wi-Fi 的 BSSID */
    BSSID: string
    /** Wi-Fi 是否安全 */
    secure: boolean
    /** Wi-Fi 信号强度, 安卓取值 0 ～ 100 ，iOS 取值 0 ～ 1 ，值越大强度越大 */
    signalStrength: number
    /** Wi-Fi 频段单位 MHz */
    frequency?: number
  }

  interface TaroStatic {
    /** 关闭 Wi-Fi 模块。
     * @supported weapp, alipay, swan, jd
     * @example
     * ```tsx
     * Taro.stopWifi({
     *   success: function (res) {
     *     console.log(res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.stopWifi.html
     */
    stopWifi(option?: stopWifi.Option): Promise<TaroGeneral.WifiError>

    /** 初始化 Wi-Fi 模块。
     * @supported weapp, alipay, swan, jd
     * @example
     * ```tsx
     * Taro.startWifi({
     *   success: function (res) {
     *     console.log(res.errMsg)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.startWifi.html
     */
    startWifi(option?: startWifi.Option): Promise<TaroGeneral.WifiError>

    /** 设置 `wifiList` 中 AP 的相关信息。在 `onGetWifiList` 回调后调用，**iOS特有接口**。
     *
     * **注意**
     * - 该接口只能在 `onGetWifiList` 回调之后才能调用。
     * - 此时客户端会挂起，等待小程序设置 Wi-Fi 信息，请务必尽快调用该接口，若无数据请传入一个空数组。
     * - 有可能随着周边 Wi-Fi 列表的刷新，单个流程内收到多次带有存在重复的 Wi-Fi 列表的回调。
     * @supported weapp, swan, jd
     * @example
     * ```tsx
     * Taro.onGetWifiList(function (res) {
     *   if (res.wifiList.length) {
     *     Taro.setWifiList({
     *       wifiList: [{
     *         SSID: res.wifiList[0].SSID,
     *         BSSID: res.wifiList[0].BSSID,
     *         password: '123456'
     *       }]
     *     })
     *   } else {
     *     Taro.setWifiList({
     *       wifiList: []
     *     })
     *   }
     * })
     * Taro.getWifiList()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.setWifiList.html
     */
    setWifiList(option: setWifiList.Option): Promise<TaroGeneral.WifiError>

    /** 监听连接上 Wi-Fi 的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onWifiConnectedWithPartialInfo.html
     */
    onWifiConnectedWithPartialInfo(
      /** 连接上 Wi-Fi 的事件的回调函数 */
      callback: onWifiConnectedWithPartialInfo.Callback,
    ): void

    /** 监听连接上 Wi-Fi 的事件。
     * @supported weapp, alipay, swan, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onWifiConnected.html
     */
    onWifiConnected(
      /** 连接上 Wi-Fi 的事件的回调函数 */
      callback: onWifiConnected.Callback,
    ): void

    /** 监听获取到 Wi-Fi 列表数据事件
     * @supported weapp, alipay, swan, jd, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onGetWifiList.html
     */
    onGetWifiList(
      /** 获取到 Wi-Fi 列表数据事件的回调函数 */
      callback: onGetWifiList.Callback,
    ): void

    /** 取消监听连接上 Wi-Fi 的事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.offWifiConnectedWithPartialInfo.html
     */
     offWifiConnectedWithPartialInfo(
      /** 连接上 Wi-Fi 的事件的回调函数 */
      callback?: onWifiConnectedWithPartialInfo.Callback,
    ): void

    /**
     * 取消监听连接上 Wi-Fi 的事件。
     * @supported weapp, alipay, swan, jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.offWifiConnected.html
     */
    offWifiConnected(
      /** 连接上 Wi-Fi 的事件的回调函数 */
      callback?: onWifiConnected.Callback,
    ): void

    /**
     * 取消监听获取到 Wi-Fi 列表数据事件。
     * @supported weapp, alipay, swan, jd, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.offGetWifiList.html
     */
    offGetWifiList(
      /** 获取到 Wi-Fi 列表数据事件的回调函数 */
      callback?: onGetWifiList.Callback,
    ): void

    /** 请求获取 Wi-Fi 列表。在 `onGetWifiList` 注册的回调中返回 `wifiList` 数据。 **Android 调用前需要 [用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userLocation。**
     *
     * iOS 将跳转到系统的 Wi-Fi 界面，Android 不会跳转。 iOS 11.0 及 iOS 11.1 两个版本因系统问题，该方法失效。但在 iOS 11.2 中已修复。
     * @supported weapp, alipay, swan, jd, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getWifiList.html
     */
    getWifiList(option?: getWifiList.Option): Promise<TaroGeneral.WifiError>

    /** 获取已连接中的 Wi-Fi 信息。
     * @supported weapp, alipay, swan, tt
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getConnectedWifi.html
     */
    getConnectedWifi(option?: getConnectedWifi.Option): Promise<TaroGeneral.WifiError>

    /**
     * 连接 Wi-Fi。若已知 Wi-Fi 信息，可以直接利用该接口连接。仅 Android 与 iOS 11 以上版本支持。
     * @example
     * ```tsx
     * Taro.connectWifi({
     *   SSID: '',
     *   BSSID: '',
     *   success: function (res) {
     *     console.log(res.errMsg)
     *   }
     * })
     * ```
     * @supported weapp,  alipay, swan,  jd
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html
     */
    connectWifi(option: connectWifi.Option): Promise<TaroGeneral.WifiError>
  }
}
