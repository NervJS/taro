declare namespace Taro {
  namespace stopWifi {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.WifiError) => void
    }
  }
  /** 关闭 Wi-Fi 模块。
   * @supported weapp
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
  function stopWifi(option?: stopWifi.Option): Promise<General.WifiError>

  namespace startWifi {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.WifiError) => void
    }
  }
  /** 初始化 Wi-Fi 模块。
   * @supported weapp
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
  function startWifi(option?: startWifi.Option): Promise<General.WifiError>

  namespace setWifiList {
    interface Option {
      /** 提供预设的 Wi-Fi 信息列表 */
      wifiList: WifiData[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.WifiError) => void
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
  /** 设置 `wifiList` 中 AP 的相关信息。在 `onGetWifiList` 回调后调用，**iOS特有接口**。
   *
   * **注意**
   * - 该接口只能在 `onGetWifiList` 回调之后才能调用。
   * - 此时客户端会挂起，等待小程序设置 Wi-Fi 信息，请务必尽快调用该接口，若无数据请传入一个空数组。
   * - 有可能随着周边 Wi-Fi 列表的刷新，单个流程内收到多次带有存在重复的 Wi-Fi 列表的回调。
   * @supported weapp
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
  function setWifiList(option: setWifiList.Option): Promise<General.WifiError>

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
  /** 监听连接上 Wi-Fi 的事件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onWifiConnected.html
   */
  function onWifiConnected(
    /** 连接上 Wi-Fi 的事件的回调函数 */
    callback: onWifiConnected.Callback,
  ): void

  namespace onGetWifiList {
    /** 获取到 Wi-Fi 列表数据事件的回调函数 */
    type Callback = (result: CallbackResult) => void
    interface CallbackResult {
      /** Wi-Fi 列表数据 */
      wifiList: WifiInfo[]
    }
  }
  /** 监听获取到 Wi-Fi 列表数据事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.onGetWifiList.html
   */
  function onGetWifiList(
    /** 获取到 Wi-Fi 列表数据事件的回调函数 */
    callback: onGetWifiList.Callback,
  ): void

  /**
   * 取消监听连接上 Wi-Fi 的事件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.offWifiConnected.html
   */
  function offWifiConnected(
    /** 连接上 Wi-Fi 的事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void

  /**
   * 取消监听获取到 Wi-Fi 列表数据事件。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.offGetWifiList.html
   */
  function offGetWifiList(
    /** 获取到 Wi-Fi 列表数据事件的回调函数 */
    callback: (...args: any[]) => any,
  ): void

  namespace getWifiList {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.WifiError) => void
  }
  }
  /** 请求获取 Wi-Fi 列表。在 `onGetWifiList` 注册的回调中返回 `wifiList` 数据。 **Android 调用前需要 [用户授权](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html) scope.userLocation。**
   *
   * iOS 将跳转到系统的 Wi-Fi 界面，Android 不会跳转。 iOS 11.0 及 iOS 11.1 两个版本因系统问题，该方法失效。但在 iOS 11.2 中已修复。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getWifiList.html
   */
  function getWifiList(option?: getWifiList.Option): Promise<General.WifiError>

  namespace getConnectedWifi {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.WifiError {
      /** Wi-Fi 信息 */
      wifi: WifiInfo
      /** 调用结果 */
      errMsg: string
    }
  }
  /** 获取已连接中的 Wi-Fi 信息。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.getConnectedWifi.html
   */
  function getConnectedWifi(option?: getConnectedWifi.Option): Promise<General.WifiError>

  namespace connectWifi {
    interface Option {
      /** Wi-Fi 设备 SSID */
      SSID: string
      /** Wi-Fi 设备密码 */
      password: string
      /** Wi-Fi 设备 BSSID */
      BSSID?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.WifiError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.WifiError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.WifiError) => void
    }
  }

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
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/wifi/wx.connectWifi.html
   */
  function connectWifi(option: connectWifi.Option): Promise<General.WifiError>

  /** Wifi 信息 */
  interface WifiInfo {
    /** Wi-Fi 的 BSSID */
    BSSID: string
    /** Wi-Fi 的 SSID */
    SSID: string
    /** Wi-Fi 是否安全 */
    secure: boolean
    /** Wi-Fi 信号强度 */
    signalStrength: number
  }
}
