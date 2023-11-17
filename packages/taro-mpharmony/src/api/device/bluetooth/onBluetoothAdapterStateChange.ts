import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 监听蓝牙适配器状态变化事件
 * 
 * @canUse onBluetoothAdapterStateChange
 * @__callback [available, discovering]
 */
export const onBluetoothAdapterStateChange: typeof Taro.onBluetoothAdapterStateChange = (callback) => {
  const name = 'onBluetoothAdapterStateChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.onBluetoothAdapterStateChange(callback)
}
