import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 初始化 Wi-Fi 模块
 * 
 * @canUse startWifi
 */
export const startWifi: typeof Taro.startWifi = (options) => {
  const name = 'startWifi'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.startWifi({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
