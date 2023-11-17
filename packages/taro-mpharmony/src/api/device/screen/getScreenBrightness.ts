import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取屏幕亮度
 * 
 * @canUse getScreenBrightness
 * @__success [value]
 */
export const getScreenBrightness: typeof Taro.getScreenBrightness = (options) => {
  const name = 'getScreenBrightness'
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
    native.getScreenBrightness({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
