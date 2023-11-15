import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 设置屏幕亮度
 * 
 * @canUse setScreenBrightness
 * @__object [value]
 */
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
    const { value, success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })
    if (typeof value !== 'number') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'value',
            correct: 'number',
            wrong: value,
          }),
        },
        { resolve, reject }
      )
    }

    // @ts-ignore
    native.setScreenBrightness({
      value: value,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
