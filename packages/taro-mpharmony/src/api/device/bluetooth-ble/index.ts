/**
 * 监听蓝牙低功耗的最大传输单元变化事件
 * 
 * @canNotUse onBLEMTUChange
 */
export { onBLEMTUChange } from '@tarojs/taro-h5'

/**
 * 取消监听蓝牙低功耗的最大传输单元变化事件
 * 
 * @canNotUse offBLEMTUChange
 */
export { offBLEMTUChange } from '@tarojs/taro-h5'

/**
 * 取消监听蓝牙低功耗连接状态的改变事件
 * 
 * @canNotUse offBLEConnectionStateChange
 */
export { offBLEConnectionStateChange } from '@tarojs/taro-h5'

/**
 * 取消监听蓝牙低功耗设备的特征值变化事件
 * 
 * @canNotUse offBLECharacteristicValueChange
 */
export { offBLECharacteristicValueChange } from '@tarojs/taro-h5'

/**
 * 获取蓝牙低功耗的最大传输单元
 * 
 * @canNotUse getBLEMTU
 */
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
export { getBLEMTU } from '@tarojs/taro-h5'
