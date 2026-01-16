import Taro from '@tarojs/api'

import native from '../../NativeApi'


const lastSystemSettingResult: Taro.getSystemSetting.Result = {}
let lastGetSystemSettingTime = 0

/**
 * 获取设备设置
 *
 * @canUse getSystemSetting
 * @__return [bluetoothEnabled, locationEnabled, wifiEnabled, deviceOrientation[portrait, landscape]]
 */
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  const currentTime = Date.now()
  if (currentTime - lastGetSystemSettingTime < 500) {
    return lastSystemSettingResult
  }
  // @ts-ignore
  const info = native.getSystemSetting()
  lastSystemSettingResult.bluetoothEnabled = info.bluetoothEnabled
  lastSystemSettingResult.locationEnabled = info.locationEnabled
  lastSystemSettingResult.wifiEnabled = info.wifiEnabled
  lastSystemSettingResult.deviceOrientation = info.deviceOrientation
  lastGetSystemSettingTime = currentTime
  return lastSystemSettingResult
}
