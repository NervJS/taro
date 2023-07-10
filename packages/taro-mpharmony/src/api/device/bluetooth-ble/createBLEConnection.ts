import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const createBLEConnection: typeof Taro.createBLEConnection = (options) => {
  const name = 'createBLEConnection'

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
      timeout,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      errMsg?: string
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

    console.log('create BLE connection')
    // @ts-ignore
    const ret = native.createBLEConnection({
      deviceId: deviceId,
      timeout: timeout,
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
