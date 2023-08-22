import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const offLocationChangeError: typeof Taro.offLocationChangeError = (callback) => {
  const name = 'offLocationChangeError'
  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  // @ts-ignore
  native.offLocationChangeError(callback)
}
