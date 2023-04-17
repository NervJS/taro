import Taro from '@tarojs/api'

import { permanentlyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

// 电量

// Note: 浏览器标准下不支持，其他实现方案不准确，不建议开发者使用
export const getBatteryInfoSync = permanentlyNotSupport('getBatteryInfoSync')

export const getBatteryInfo: typeof Taro.getBatteryInfo = async ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'getBatteryInfo', success, fail, complete })
  try {
    // @ts-ignore
    const battery = await navigator.getBattery?.()
    return handle.success({
      isCharging: battery.charging,
      level: Number(battery.level || 0) * 100
    })
  } catch (error) {
    return handle.fail({
      errMsg: error?.message || error
    })
  }
}
