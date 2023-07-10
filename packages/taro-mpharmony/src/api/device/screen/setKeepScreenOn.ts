import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const setKeepScreenOn: typeof Taro.setKeepScreenOn = (options) => {
  const name = 'setKeepScreenOn'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      keepScreenOn,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.url must be String
    if (typeof keepScreenOn !== 'boolean') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'value',
          correct: 'boolean',
          wrong: keepScreenOn
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.setKeepScreenOn({
      keepScreenOn: keepScreenOn,
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
