import { temporarilyNotSupport } from '../../utils'

/**
 * 监听当前外围设备被连接或断开连接事件
 * 
 * @canNotUse onBLEPeripheralConnectionStateChanged
 */
export const onBLEPeripheralConnectionStateChanged = /* @__PURE__ */ temporarilyNotSupport(
  'onBLEPeripheralConnectionStateChanged'
)

/**
 * 取消监听当前外围设备被连接或断开连接事件
 * 
 * @canNotUse offBLEPeripheralConnectionStateChanged
 */
export const offBLEPeripheralConnectionStateChanged = /* @__PURE__ */ temporarilyNotSupport(
  'offBLEPeripheralConnectionStateChanged'
)

/**
 * 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个
 * 
 * @canNotUse createBLEPeripheralServer
 */
export const createBLEPeripheralServer = /* @__PURE__ */ temporarilyNotSupport('createBLEPeripheralServer')

/**
 * 外围设备的服务端
 * 
 * @canNotUse BLEPeripheralServer
 */
