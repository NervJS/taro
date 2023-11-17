import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取蓝牙设备某个服务中所有特征值
 * 
 * @canUse getBLEDeviceCharacteristics
 * @__object [deviceId, serviceId]
 * @__success [characteristics]
 */
export const getBLEDeviceCharacteristics: typeof Taro.getBLEDeviceCharacteristics = (options) => {
  const name = 'getBLEDeviceCharacteristics'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { deviceId, serviceId, success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      characteristics?: object
      errMsg?: string
    }>({ name, success, fail, complete })

    // options.deviceId must be string
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

    // @ts-ignore
    native.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
