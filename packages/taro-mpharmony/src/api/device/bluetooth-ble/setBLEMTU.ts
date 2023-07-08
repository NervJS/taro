import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const setBLEMTU: typeof Taro.setBLEMTU = (options) => {
  const name = 'setBLEMTU'

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
      mtu,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      mtu?: string
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

    if (typeof mtu !== 'number') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'mtu',
          correct: 'number',
          wrong: mtu
        })
      }, { resolve, reject })
    }

    if(mtu > 512 || mtu < 22){
      console.error('invalid input')
      return handle.fail()
    }


    console.log('set BLE mtu')
    // @ts-ignore
    const ret = native.setBLEMTU({
      deviceId: deviceId,
      mtu: mtu,
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
