import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 监听连接上 Wi-Fi 的事件
 * 
 * @canUse onWifiConnectedWithPartialInfo
 * @__callback [wifi]
 */
export const onWifiConnectedWithPartialInfo: typeof Taro.onWifiConnectedWithPartialInfo = (callback) => {
  const name = 'onBLECharacteristicValueChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.onWifiConnectedWithPartialInfo((res: any) => {
    const result: Taro.onWifiConnectedWithPartialInfo.CallbackResult = {
      /** 只包含 SSID 属性的 WifiInfo 对象 */
      wifi: { SSID: res.wifi.SSID },
    }
    callback(result)
  })
}
