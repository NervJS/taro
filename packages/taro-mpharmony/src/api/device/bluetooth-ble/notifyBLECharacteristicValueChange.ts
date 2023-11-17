import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值
 * 
 * @canUse notifyBLECharacteristicValueChange
 * @__object [characteristicId, deviceId, serviceId, state]
 */
export const notifyBLECharacteristicValueChange: typeof Taro.notifyBLECharacteristicValueChange = (options) => {
  const name = 'notifyBLECharacteristicValueChange'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { characteristicId, deviceId, serviceId, state, success, fail, complete } = options as Exclude<
      typeof options,
    undefined
    >

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.characteristicId must be string
    if (typeof characteristicId !== 'string') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'characteristicId',
            correct: 'string',
            wrong: characteristicId,
          }),
        },
        { resolve, reject }
      )
    }

    if (typeof deviceId !== 'string') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'deviceId',
            correct: 'string',
            wrong: deviceId,
          }),
        },
        { resolve, reject }
      )
    }

    if (typeof serviceId !== 'string') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'serviceId',
            correct: 'string',
            wrong: serviceId,
          }),
        },
        { resolve, reject }
      )
    }

    if (typeof state !== 'boolean') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'state',
            correct: 'boolean',
            wrong: state,
          }),
        },
        { resolve, reject }
      )
    }

    // @ts-ignore
    native.notifyBLECharacteristicValueChange({
      characteristicId: characteristicId,
      deviceId: deviceId,
      serviceId: serviceId,
      state: state,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
