import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const startBeaconDiscovery: typeof Taro.startBeaconDiscovery = (options) => {
  const name = 'startBeaconDiscovery'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      uuids,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.object must be object
    if (typeof uuids !== 'object') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'uuids',
          correct: 'object',
          wrong: uuids
        })
      }, { resolve, reject })
    }

    console.log('start Beacon Discovery')
    // @ts-ignore
    const ret = native.startBeaconDiscovery({
      uuids: uuids,
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
