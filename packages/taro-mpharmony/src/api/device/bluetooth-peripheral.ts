/**
 * 监听当前外围设备被连接或断开连接事件
 * 
 * @canNotUse onBLEPeripheralConnectionStateChanged
 */
export { onBLEPeripheralConnectionStateChanged } from '@tarojs/taro-h5'

/**
 * 取消监听当前外围设备被连接或断开连接事件
 * 
 * @canNotUse offBLEPeripheralConnectionStateChanged
 */
export { offBLEPeripheralConnectionStateChanged } from '@tarojs/taro-h5'

/**
 * 建立本地作为蓝牙低功耗外围设备的服务端，可创建多个
 * 
 * @canNotUse createBLEPeripheralServer
 */
export { createBLEPeripheralServer } from '@tarojs/taro-h5'

/**
 * 外围设备的服务端
 * 
 * @canNotUse BLEPeripheralServer
 */
