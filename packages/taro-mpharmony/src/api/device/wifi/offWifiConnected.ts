import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听连接上 Wi-Fi 的事件
 * 
 * @canUse offWifiConnected
 */
export const offWifiConnected: typeof Taro.offWifiConnected = (callback) => {
  const name = 'offWifiConnected'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.offWifiConnected((res: any) => {
    const result: Taro.onWifiConnected.CallbackResult = {
      /** Wi-Fi 信息 */
      wifi: {
        /** Wi-Fi 的 SSID */
        SSID: res.wifi.SSID,
        /** Wi-Fi 的 BSSID */
        BSSID: res.wifi.BSSID,
        /** Wi-Fi 是否安全 */
        secure: res.wifi.secure,
        /** Wi-Fi 信号强度, 安卓取值 0 ～ 100 ，iOS 取值 0 ～ 1 ，值越大强度越大 */
        signalStrength: res.wifi.signalStrength,
        /** Wi-Fi 频段单位 MHz */
        frequency: res.wifi.frequency,
      },
    }
    callback(result)
  })
}
