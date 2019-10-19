declare namespace Taro {
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
}
