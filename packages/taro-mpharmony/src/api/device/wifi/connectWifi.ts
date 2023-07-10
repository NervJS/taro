import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const connectWifi: typeof Taro.connectWifi = (options) => {
  const name = 'connectWifi'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      SSID,
      password,
      BSSID,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.object must be object
    if (typeof SSID !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'SSID',
          correct: 'string',
          wrong: SSID
        })
      }, { resolve, reject })
    }

    if (typeof password !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'password',
          correct: 'string',
          wrong: password
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.connectWifi({
      SSID: SSID,
      password: password,
      BSSID: BSSID,
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
