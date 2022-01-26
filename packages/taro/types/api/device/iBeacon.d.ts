import Taro from '../../index'

declare module '../../index' {
  namespace stopBeaconDiscovery {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.IBeaconError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.IBeaconError) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.IBeaconError) => void
    }
  }

  namespace startBeaconDiscovery {
    interface Option {
      /** iBeacon 设备广播的 uuid 列表 */
      uuids: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.IBeaconError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.IBeaconError) => void
      /** 是否校验蓝牙开关，仅在 iOS 下有效 */
      ignoreBluetoothAvailable?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.IBeaconError) => void
    }
  }

  namespace onBeaconUpdate {
    /** iBeacon 设备更新事件的回调函数 */
    type Callback = (result: CallbackResult) => void

    interface CallbackResult {
      /** 当前搜寻到的所有 iBeacon 设备列表 */
      beacons: IBeaconInfo[]
    }
  }

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

  namespace getBeacons {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.IBeaconError) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.IBeaconError) => void
      /** 接口调用成功的回调函数 */
      success?: (result: CallbackResult) => void
    }

    interface CallbackResult extends TaroGeneral.IBeaconError {
      /** iBeacon 设备列表 */
      beacons: IBeaconInfo[]
      /** 调用结果 */
      errMsg: string
    }
  }

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

  interface TaroStatic {
    /** 停止搜索附近的 iBeacon 设备
     * @supported weapp
     * @example
     * ```tsx
     * Taro.stopBeaconDiscovery(params).then(...)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.stopBeaconDiscovery.html
     */
    stopBeaconDiscovery(option?: stopBeaconDiscovery.Option): Promise<TaroGeneral.CallbackResult>

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
    startBeaconDiscovery(option: startBeaconDiscovery.Option): Promise<TaroGeneral.CallbackResult>

    /** 监听 iBeacon 设备更新事件，仅能注册一个监听
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconUpdate.html
     */
    onBeaconUpdate(
      /** iBeacon 设备更新事件的回调函数 */
      callback: onBeaconUpdate.Callback,
    ): void

    /** 监听 iBeacon 服务状态变化事件，仅能注册一个监听
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconServiceChange.html
     */
    onBeaconServiceChange(
      /** iBeacon 服务状态变化事件的回调函数 */
      callback: onBeaconServiceChange.Callback,
    ): void

    /** 获取所有已搜索到的 iBeacon 设备
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.getBeacons.html
     */
    getBeacons(option?: getBeacons.Option): Promise<getBeacons.CallbackResult>

    /** 取消监听 iBeacon 设备更新事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconUpdate.html
     */
    offBeaconUpdate(
      /** iBeacon 设备更新事件的回调函数 */
      callback: (res: TaroGeneral.CallbackResult) => void,
    ): void

    /** 取消监听 iBeacon 服务状态变化事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.offBeaconServiceChange.html
     */
    offBeaconServiceChange(
      /** iBeacon 服务状态变化事件的回调函数 */
      callback: (res: TaroGeneral.CallbackResult) => void,
    ): void
  }
}
