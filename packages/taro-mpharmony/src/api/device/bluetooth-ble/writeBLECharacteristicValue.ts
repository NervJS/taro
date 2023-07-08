import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const writeBLECharacteristicValue: typeof Taro.writeBLECharacteristicValue = (options) => {
  const name = 'writeBLECharacteristicValue'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      characteristicId,
      deviceId,
      serviceId,
      value,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.object must be object
    if (typeof characteristicId !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'characteristicId',
          correct: 'string',
          wrong: characteristicId
        })
      }, { resolve, reject })
    }

    if (typeof deviceId !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'deviceId',
          correct: 'string',
          wrong: deviceId
        })
      }, { resolve, reject })
    }

    if (typeof serviceId !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'serviceId',
          correct: 'string',
          wrong: serviceId
        })
      }, { resolve, reject })
    }

    // options.value must be object
    if (typeof value !== 'object') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'value',
          correct: 'object',
          wrong: value
        })
      }, { resolve, reject })
    }

    console.log('write BLE characteristic Value')
    // @ts-ignore
    const ret = native.writeBLECharacteristicValue({
      characteristicId: characteristicId,
      deviceId: deviceId,
      serviceId: serviceId,
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
