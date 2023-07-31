import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const offBluetoothAdapterStateChange: typeof Taro.offBluetoothAdapterStateChange = (callback) => {
  const name = 'offBluetoothAdapterStateChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  // @ts-ignore
  native.offBluetoothAdapterStateChange(callback)
}
