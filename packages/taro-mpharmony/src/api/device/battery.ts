/**
 * Taro.getBatteryInfo 的同步版本 Note: 浏览器标准下不支持，其他实现方案不准确，不建议开发者使用
 * 
 * @canNotUse getBatteryInfoSync
 */
export { getBatteryInfoSync } from '@tarojs/taro-h5'

/**
 * 获取设备电量
 * 
 * @canUse getBatteryInfo
 * @__success [isCharging, level]
 */
export { getBatteryInfo } from '@tarojs/taro-h5'
