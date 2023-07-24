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
  native.offLocationChange((res: any) => {
    const result: TaroGeneral.CallbackResult = {
      /** 错误信息 */
      errMsg: JSON.stringify(res)
    }
    callback(result)
  })
}