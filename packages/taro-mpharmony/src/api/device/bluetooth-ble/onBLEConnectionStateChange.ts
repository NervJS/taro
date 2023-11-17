import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 监听低功耗蓝牙连接状态的改变事件
 * 
 * @canUse onBLEConnectionStateChange
 * @__callback [connected, deviceId]
 */
export const onBLEConnectionStateChange: typeof Taro.onBLEConnectionStateChange = (callback) => {
  const name = 'onBLEConnectionStateChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.onBLEConnectionStateChange(callback)
}
