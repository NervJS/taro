import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const getBLEDeviceServices: typeof Taro.getBLEDeviceServices = (options) => {
  const name = 'getBLEDeviceServices'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      deviceId,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      services?: object
      erMsg?: string
    }>({ name, success, fail, complete })

    // options.object must be object
    if (typeof deviceId !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'deviceId',
          correct: 'string',
          wrong: deviceId
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.getBLEDeviceServices({
      deviceId: deviceId,
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
