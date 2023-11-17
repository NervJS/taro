import { temporarilyNotSupport } from '../../../utils'

/**
 * 蓝牙配对接口
 * 
 * @canNotUse makeBluetoothPair
 */
export const makeBluetoothPair = /* @__PURE__ */ temporarilyNotSupport('makeBluetoothPair')

/**
 * 查询蓝牙设备是否配对
 * 
 * @canNotUse isBluetoothDevicePaired
 */
export const isBluetoothDevicePaired = /* @__PURE__ */ temporarilyNotSupport('isBluetoothDevicePaired')

export * from './closeBluetoothAdapter'
export * from './getBluetoothAdapterState'
export * from './getBluetoothDevices'
export * from './getConnectedBluetoothDevices'
export * from './offBluetoothAdapterStateChange'
export * from './offBluetoothDeviceFound'
export * from './onBluetoothAdapterStateChange'
export * from './onBluetoothDeviceFound'
export * from './openBluetoothAdapter'
export * from './startBluetoothDevicesDiscovery'
export * from './stopBluetoothDevicesDiscovery'
