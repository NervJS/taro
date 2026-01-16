import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/api/apis/utils'

import nativeWifi from './NativeWifi'

/**
 * 取消监听连接上 Wi-Fi 的事件
 *
 * @canUse offWifiConnectedWithPartialInfo
 */
export const offWifiConnectedWithPartialInfo: typeof Taro.offWifiConnectedWithPartialInfo = (callback) => {
  const name = 'offWifiConnectedWithPartialInfo'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  nativeWifi.offWifiConnectedWithPartialInfo((res: any) => {
    const result: Taro.onWifiConnectedWithPartialInfo.CallbackResult = {
      /** 只包含 SSID 属性的 WifiInfo 对象 */
      wifi: { SSID: res.wifi.SSID },
    }
    callback && callback(result)
  })
}
