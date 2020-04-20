declare namespace Taro {
  namespace stopBeaconDiscovery {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.IBeaconError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.IBeaconError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.IBeaconError) => void
  }
  }

  /** 停止搜索附近的 iBeacon 设备
   * @supported weapp
   * @example
   * ```tsx
   * Taro.stopBeaconDiscovery(params).then(...)
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.stopBeaconDiscovery.html
   */
  function stopBeaconDiscovery(option?: stopBeaconDiscovery.Option): Promise<General.CallbackResult>

  namespace startBeaconDiscovery {
    interface Option {
      /** iBeacon 设备广播的 uuid 列表 */
      uuids: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.IBeaconError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.IBeaconError) => void
      /** 是否校验蓝牙开关，仅在 iOS 下有效 */
      ignoreBluetoothAvailable?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: General.IBeaconError) => void
    }
  }

  /** 开始搜索附近的 iBeacon 设备
   * @supported weapp
   * @example
   * ```tsx
   * Taro.startBeaconDiscovery({
   *   success: function (res) { }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.startBeaconDiscovery.html
   */
  function startBeaconDiscovery(option: startBeaconDiscovery.Option): Promise<General.CallbackResult>

  namespace onBeaconUpdate {
    /** iBeacon 设备更新事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** 当前搜寻到的所有 iBeacon 设备列表 */
      beacons: IBeaconInfo[]
    }
  }
  /** 监听 iBeacon 设备更新事件，仅能注册一个监听
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconUpdate.html
   */
  function onBeaconUpdate(
    /** iBeacon 设备更新事件的回调函数 */
    callback: onBeaconUpdate.Callback,
  ): void

  namespace onBeaconServiceChange {
    /** iBeacon 服务状态变化事件的回调函数 */
    type Callback = (
      result: CallbackResult,
    ) => void

    interface CallbackResult {
      /** 服务目前是否可用 */
      available: boolean
      /** 目前是否处于搜索状态 */
      discovering: boolean
    }
  }

  /** 监听 iBeacon 服务状态变化事件，仅能注册一个监听
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconServiceChange.html
   */
  function onBeaconServiceChange(
    /** iBeacon 服务状态变化事件的回调函数 */
    callback: onBeaconServiceChange.Callback,
  ): void

  namespace getBeacons {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.IBeaconError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.IBeaconError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: CallbackResult) => void
    }

    interface CallbackResult extends General.IBeaconError {
      /** iBeacon 设备列表 */
      beacons: IBeaconInfo[]
      /** 调用结果 */
      errMsg: string
    }
  }

  /** 获取所有已搜索到的 iBeacon 设备
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.getBeacons.html
   */
  function getBeacons(option?: getBeacons.Option): Promise<getBeacons.CallbackResult>

  /** 取消监听 iBeacon 设备更新事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconUpdate.html
   */
  function offBeaconUpdate(
    /** iBeacon 设备更新事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void

  /** 取消监听 iBeacon 服务状态变化事件
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconServiceChange.html
   */
  function offBeaconServiceChange(
    /** iBeacon 服务状态变化事件的回调函数 */
    callback: (res: General.CallbackResult) => void,
  ): void
  interface IBeaconInfo {
    /** iBeacon 设备的距离 */
    accuracy: number
    /** iBeacon 设备的主 id */
    major: string
    /** iBeacon 设备的次 id */
    minor: string
    /** 表示设备距离的枚举值 */
    proximity: number
    /** 表示设备的信号强度 */
    rssi: number
    /** iBeacon 设备广播的 uuid */
    uuid: string
  }
}
