import batteryInfo, { BatteryChargeState } from '@ohos.batteryInfo'
import Taro from '@tarojs/api'

import { callAsyncSuccess } from '../utils'

// 电量

export const getBatteryInfoSync: typeof Taro.getBatteryInfoSync = () => ({
  // @ts-ignore
  isCharging: [BatteryChargeState.ENABLE, BatteryChargeState.FULL].includes(batteryInfo.chargingStatus),
  level: batteryInfo.batterySOC
})

export const getBatteryInfo: typeof Taro.getBatteryInfo = function (options) {
  return new Promise(resolve => {
    const res = getBatteryInfoSync()
    callAsyncSuccess(resolve, res, options)
  })
}
