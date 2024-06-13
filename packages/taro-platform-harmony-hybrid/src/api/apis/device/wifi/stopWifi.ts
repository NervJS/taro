import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/api/apis/utils'
import { MethodHandler } from 'src/api/apis/utils/handler'

import nativeWifi from './NativeWifi'

/**
 * 关闭 Wi-Fi 模块
 *
 * @canUse stopWifi
 */
export const stopWifi: typeof Taro.stopWifi = (options) => {
  const name = 'stopWifi'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    nativeWifi.stopWifi({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
