import Taro from "@tarojs/taro"
import { shouldBeFunction } from "src/utils"

export const offLocationChangeError: typeof Taro.offLocationChangeError = (callback) => {
  const name = 'offLocationChangeError'
  // callback must be an Function
  const isObject = shouldBeFunction(callback)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  // @ts-ignore
  const ret = native.offLocationChangeError(callback)
  return ret
}
