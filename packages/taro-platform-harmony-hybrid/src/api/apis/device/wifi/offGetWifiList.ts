import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/api/apis/utils'

import nativeWifi from './NativeWifi'

/**
 * 取消监听获取到 Wi-Fi 列表数据事件
 *
 * @canUse offGetWifiList
 */
export const offGetWifiList: typeof Taro.offGetWifiList = (callback) => {
  const name = 'offGetWifiList'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  nativeWifi.offGetWifiList(callback)
}
