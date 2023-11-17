import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听寻找到新设备的事件
 * 
 * @canUse offBluetoothDeviceFound
 */
export const offBluetoothDeviceFound: typeof Taro.offBluetoothDeviceFound = (callback) => {
  const name = 'offBluetoothDeviceFound'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.offBluetoothDeviceFound((res: any) => {
    const result: Taro.onBluetoothDeviceFound.CallbackResult = {
      /** 新搜索到的设备列表 */
      devices: res,
    }
    callback(result)
  })
}
