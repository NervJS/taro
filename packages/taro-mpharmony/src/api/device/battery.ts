import Taro from '@tarojs/api'

import { permanentlyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * Taro.getBatteryInfo 的同步版本 Note: 浏览器标准下不支持，其他实现方案不准确，不建议开发者使用
 * 
 * @canNotUse getBatteryInfoSync
 */
export const getBatteryInfoSync = /* @__PURE__ */ permanentlyNotSupport('getBatteryInfoSync')

/**
 * 获取设备电量
 * 
 * @canUse getBatteryInfo
 * @__success [isCharging, level]
 */
export const getBatteryInfo: typeof Taro.getBatteryInfo = async ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'getBatteryInfo', success, fail, complete })
  try {
    // @ts-ignore
    const battery = await navigator.getBattery?.()
    return handle.success({
      isCharging: battery.charging,
      level: Number(battery.level || 0) * 100,
    })
  } catch (error) {
    return handle.fail({
      errMsg: error?.message || error,
    })
  }
}
