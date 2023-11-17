import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取蓝牙低功耗设备的信号强度
 * 
 * @canUse getBLEDeviceRSSI
 * @__object [deviceId]
 * @__success [RSSI]
 */
export const getBLEDeviceRSSI: typeof Taro.getBLEDeviceRSSI = (options) => {
  const name = 'getBLEDeviceRSSI'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { deviceId, success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      RSSI?: number
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

    // @ts-ignore
    native.getBLEDeviceRSSI({
      deviceId: deviceId,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
