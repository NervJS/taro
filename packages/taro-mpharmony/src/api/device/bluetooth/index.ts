import { temporarilyNotSupport } from '../../../utils'

// 蓝牙-通用
export const offBluetoothDeviceFound = /* @__PURE__ */ temporarilyNotSupport('offBluetoothDeviceFound')
export const offBluetoothAdapterStateChange = /* @__PURE__ */ temporarilyNotSupport('offBluetoothAdapterStateChange')
export const makeBluetoothPair = /* @__PURE__ */ temporarilyNotSupport('makeBluetoothPair')
export const isBluetoothDevicePaired = /* @__PURE__ */ temporarilyNotSupport('isBluetoothDevicePaired')

export * from './closeBluetoothAdapter'
export * from './getBluetoothAdapterState'
export * from './getBluetoothDevices'
export * from './getConnectedBluetoothDevices'
export * from './onBluetoothAdapterStateChange'
export * from './onBluetoothDeviceFound'
export * from './openBluetoothAdapter'
export * from './startBluetoothDevicesDiscovery'
export * from './stopBluetoothDevicesDiscovery'