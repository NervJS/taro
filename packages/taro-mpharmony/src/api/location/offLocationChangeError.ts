import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听持续定位接口返回失败时触发
 * 
 * @canUse offLocationChangeError
 */
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
