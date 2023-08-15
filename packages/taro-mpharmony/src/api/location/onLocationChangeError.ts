import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const onLocationChangeError: typeof Taro.onLocationChangeError = (callback) => {
  const name = 'onLocationChangeError'
  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  // @ts-ignore
  native.onLocationChangeError(callback)
}