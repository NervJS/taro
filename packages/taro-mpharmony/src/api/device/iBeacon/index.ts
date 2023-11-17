import { temporarilyNotSupport } from '../../../utils'

// 蓝牙-信标(Beacon)

/**
 * 取消监听 iBeacon 设备更新事件
 * 
 * @canNotUse offBeaconUpdate
 */
export const offBeaconUpdate = /* @__PURE__ */ temporarilyNotSupport('offBeaconUpdate')

/**
 * 取消监听 iBeacon 服务状态变化事件
 * 
 * @canNotUse offBeaconServiceChange
 */
export const offBeaconServiceChange = /* @__PURE__ */ temporarilyNotSupport('offBeaconServiceChange')

/**
 * 获取所有已搜索到的 iBeacon 设备
 * 
 * @canNotUse getBeacons
 */
export const getBeacons = /* @__PURE__ */ temporarilyNotSupport('getBeacons')

/**
 * 监听 iBeacon 服务状态变化事件，仅能注册一个监听
 * 
 * @canNotUse onBeaconServiceChange
 */
export const onBeaconServiceChange = /* @__PURE__ */ temporarilyNotSupport('onBeaconServiceChange')

/**
 * 监听 iBeacon 设备更新事件，仅能注册一个监听
 * 
 * @canNotUse onBeaconUpdate
 */
export const onBeaconUpdate = /* @__PURE__ */ temporarilyNotSupport('onBeaconUpdate')

/**
 * 开始搜索附近的 iBeacon 设备
 * 
 * @canNotUse startBeaconDiscovery
 */
export const startBeaconDiscovery = /* @__PURE__ */ temporarilyNotSupport('startBeaconDiscovery')

/**
 * 停止搜索附近的 iBeacon 设备
 * 
 * @canNotUse stopBeaconDiscovery
 */
export const stopBeaconDiscovery = /* @__PURE__ */ temporarilyNotSupport('stopBeaconDiscovery')

/**
 * @canNotUse IBeaconInfo
 */