declare namespace Taro {
  namespace stopBeaconDiscovery {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * 停止搜索附近的`iBeacon`设备
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.stopBeaconDiscovery.html
   */
  function stopBeaconDiscovery(res?: stopBeaconDiscovery.Param): Promise<stopBeaconDiscovery.Promised>

  namespace startBeaconDiscovery {
    type Promised = {
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * iBeacon设备广播的 uuids
       */
      uuids: string[]
    }
  }
  /**
   * 开始搜索附近的`iBeacon`设备
   * @example
   * ```tsx
   * Taro.startBeaconDiscovery({
   *   success(res) {}
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.startBeaconDiscovery.html
   */
  function startBeaconDiscovery(res: startBeaconDiscovery.Param): Promise<startBeaconDiscovery.Promised>

  namespace onBeaconUpdate {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 当前搜寻到的所有 iBeacon 设备列表
       */
      beacons: ParamParamPropBeacons
    }
    /**
     * 当前搜寻到的所有 iBeacon 设备列表
     */
    type ParamParamPropBeacons = ParamParamPropBeaconsItem[]
    type ParamParamPropBeaconsItem = {
      /**
       * iBeacon 设备广播的 uuid
       */
      uuid: string
      /**
       * iBeacon 设备的主 id
       */
      major: string
      /**
       * iBeacon 设备的次 id
       */
      minor: string
      /**
       * 表示设备距离的枚举值
       */
      proximity: number
      /**
       * iBeacon 设备的距离
       */
      accuracy: number
      /**
       * 表示设备的信号强度
       */
      rssi: number
    }
  }
  /**
   * 监听 `iBeacon` 设备的更新事件
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconUpdate.html
   */
  function onBeaconUpdate(callback: onBeaconUpdate.Param): void

  namespace onBeaconServiceChange {
    type Param = (res: ParamParam) => any
    type ParamParam = {
      /**
       * 服务目前是否可用
       */
      available: boolean
      /**
       * 目前是否处于搜索状态
       */
      discovering: boolean
    }
  }
  /**
   * 监听 `iBeacon` 服务的状态变化
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.onBeaconServiceChange.html
   */
  function onBeaconServiceChange(callback: onBeaconServiceChange.Param): void

  namespace getBeacons {
    type Promised = {
      /**
       * iBeacon 设备列表
       */
      beacons: PromisedPropBeacons
      /**
       * 调用结果
       */
      errMsg: string
    }
    /**
     * iBeacon 设备列表
     */
    type PromisedPropBeacons = PromisedPropBeaconsItem[]
    type PromisedPropBeaconsItem = {
      /**
       * iBeacon 设备广播的 uuid
       */
      uuid: string
      /**
       * iBeacon 设备的主 id
       */
      major: string
      /**
       * iBeacon 设备的次 id
       */
      minor: string
      /**
       * 表示设备距离的枚举值
       */
      proximity: number
      /**
       * iBeacon 设备的距离
       */
      accuracy: number
      /**
       * 表示设备的信号强度
       */
      rssi: number
    }
    type Param = {}
  }
  /**
   * 获取所有已搜索到的`iBeacon`设备
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.getBeacons.html
   */
  function getBeacons(res?: getBeacons.Param): Promise<getBeacons.Promised>

  // TODO: wx.offBeaconUpdate
  // TODO: wx.offBeaconServiceChange
}
