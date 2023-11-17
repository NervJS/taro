import { temporarilyNotSupport } from '../../../utils'

/**
 * 监听蓝牙低功耗的最大传输单元变化事件
 * 
 * @canNotUse onBLEMTUChange
 */
export const onBLEMTUChange = /* @__PURE__ */ temporarilyNotSupport('onBLEMTUChange')

/**
 * 取消监听蓝牙低功耗的最大传输单元变化事件
 * 
 * @canNotUse offBLEMTUChange
 */
export const offBLEMTUChange = /* @__PURE__ */ temporarilyNotSupport('offBLEMTUChange')

/**
 * 取消监听蓝牙低功耗连接状态的改变事件
 * 
 * @canNotUse offBLEConnectionStateChange
 */
export const offBLEConnectionStateChange = /* @__PURE__ */ temporarilyNotSupport('offBLEConnectionStateChange')

/**
 * 取消监听蓝牙低功耗设备的特征值变化事件
 * 
 * @canNotUse offBLECharacteristicValueChange
 */
export const offBLECharacteristicValueChange = /* @__PURE__ */ temporarilyNotSupport('offBLECharacteristicValueChange')

/**
 * 获取蓝牙低功耗的最大传输单元
 * 
 * @canNotUse getBLEMTU
 */
export const getBLEMTU = /* @__PURE__ */ temporarilyNotSupport('getBLEMTU')

export * from './closeBLEConnection'
export * from './createBLEConnection'
export * from './getBLEDeviceCharacteristics'
export * from './getBLEDeviceRSSI'
export * from './getBLEDeviceServices'
export * from './notifyBLECharacteristicValueChange'
export * from './onBLECharacteristicValueChange'
export * from './onBLEConnectionStateChange'
export * from './readBLECharacteristicValue'
export * from './setBLEMTU'
export * from './writeBLECharacteristicValue'
