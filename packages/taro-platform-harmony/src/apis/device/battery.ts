import batteryInfo, { BatteryChargeState } from '@ohos.batteryInfo'
import Taro from '@tarojs/api'

import { MethodHandler } from '../utils/handler'

// 电量

export const getBatteryInfoSync: typeof Taro.getBatteryInfoSync = () => ({
  // @ts-ignore
  isCharging: [BatteryChargeState.ENABLE, BatteryChargeState.FULL].includes(batteryInfo.chargingStatus),
  level: batteryInfo.batterySOC
})

export const getBatteryInfo: typeof Taro.getBatteryInfo = async ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'getBatteryInfo', success, fail, complete })
  try {
    return handle.success(getBatteryInfoSync())
  } catch (error) {
    return handle.fail({
      errMsg: error?.message || error
    })
  }
}
