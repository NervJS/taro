import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const onBluetoothDeviceFound: typeof Taro.onBluetoothDeviceFound = (callback) => {
  const name = 'onBluetoothDeviceFound'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.onBluetoothDeviceFound((res: any) => {
    const result: Taro.onBluetoothDeviceFound.CallbackResult = {
      /** 新搜索到的设备列表 */
      devices: res
    }
    callback(result)
  })
}
