import Taro from "@tarojs/taro"
import { shouldBeFunction } from "src/utils"

export const offLocationChange: typeof Taro.offLocationChange = (callback) => {
  const name = 'offLocationChange'
  // callback must be an Function
  const isObject = shouldBeFunction(callback)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  // @ts-ignore
  const ret = native.offLocationChange(callback)
  return ret
}