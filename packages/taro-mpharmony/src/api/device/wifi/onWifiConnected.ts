import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 监听连接上 Wi-Fi 的事件
 * 
 * @canUse onWifiConnected
 * @__callback [wifi]
 */
export const onWifiConnected: typeof Taro.onWifiConnected = (callback) => {
  const name = 'onWifiConnected'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.onWifiConnected((res: any) => {
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
