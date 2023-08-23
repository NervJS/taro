import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const getScreenBrightness: typeof Taro.getScreenBrightness = (options) => {
  const name = 'getScreenBrightness'
  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })
    // @ts-ignore
    native.getScreenBrightness({
      success: (res: any) => {
        return handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        return handle.fail(err, { resolve, reject })
      },
    })
  })
}
