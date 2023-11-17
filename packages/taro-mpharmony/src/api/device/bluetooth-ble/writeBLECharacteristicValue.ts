import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 向低功耗蓝牙设备特征值中写入二进制数据
 * 
 * @canUse writeBLECharacteristicValue
 * @__object [characteristicId, deviceId, serviceId, value]
 */
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
    const { characteristicId, deviceId, serviceId, value, success, fail, complete } = options as Exclude<
      typeof options,
    undefined
    >

    const handle = new MethodHandler<{
      errMsg?: string
    }>({ name, success, fail, complete })

    // options.object must be object
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

    // options.value must be object
    if (typeof value !== 'object') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'value',
            correct: 'object',
            wrong: value,
          }),
        },
        { resolve, reject }
      )
    }

    // @ts-ignore
    native.writeBLECharacteristicValue({
      characteristicId: characteristicId,
      deviceId: deviceId,
      serviceId: serviceId,
      value: value,
      success: (res: any) => {
        const result: TaroGeneral.BluetoothError = {
          /** 错误信息 */
          errMsg: '',
          /** 错误码 */
          errCode: res[0],
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
