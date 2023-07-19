import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const setScreenBrightness: typeof Taro.setScreenBrightness = (options) => {
  const name = 'setScreenBrightness'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      value,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.url must be String
    if (typeof value !== 'number') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'value',
          correct: 'number',
          wrong: value
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.setScreenBrightness({
      value: value,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        return handle.fail(err)
      }
    })
    return ret
  })
}
