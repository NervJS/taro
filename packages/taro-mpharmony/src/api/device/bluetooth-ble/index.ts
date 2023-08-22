import { temporarilyNotSupport } from '../../../utils'

// 蓝牙-低功耗中心设备
export const onBLEMTUChange = /* @__PURE__ */ temporarilyNotSupport('onBLEMTUChange')
export const offBLEMTUChange = /* @__PURE__ */ temporarilyNotSupport('offBLEMTUChange')
export const offBLEConnectionStateChange = /* @__PURE__ */ temporarilyNotSupport('offBLEConnectionStateChange')
export const offBLECharacteristicValueChange = /* @__PURE__ */ temporarilyNotSupport('offBLECharacteristicValueChange')
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
