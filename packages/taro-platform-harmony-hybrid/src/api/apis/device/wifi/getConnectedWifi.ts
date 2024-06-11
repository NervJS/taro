import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/api/apis/utils'
import { MethodHandler } from 'src/api/apis/utils/handler'

import nativeWifi from './NativeWifi'

/**
 * 获取已连接中的 Wi-Fi 信息
 *
 * @canUse getConnectedWifi
 * @__success [wifi]
 */
export const getConnectedWifi: typeof Taro.getConnectedWifi = (options) => {
  const name = 'getConnectedWifi'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    nativeWifi.getConnectedWifi({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
