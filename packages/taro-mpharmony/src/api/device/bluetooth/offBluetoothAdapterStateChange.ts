import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听蓝牙适配器状态变化事件
 * 
 * @canUse offBluetoothAdapterStateChange
 */
export const offBluetoothAdapterStateChange: typeof Taro.offBluetoothAdapterStateChange = (callback) => {
  const name = 'offBluetoothAdapterStateChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.offBluetoothAdapterStateChange(callback)
}
