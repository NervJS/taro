import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const onGetWifiList: typeof Taro.onGetWifiList = (callback) => {
  const name = 'onGetWifiList'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.onGetWifiList(callback)
}
