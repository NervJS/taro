import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/api/apis/utils'
import { MethodHandler } from 'src/api/apis/utils/handler'

import native from '../../NativeApi'

/**
 * 连接低功耗蓝牙设备
 *
 * @canUse createBLEConnection
 * @__object [deviceId, timeout]
 */
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
    const { deviceId, timeout, success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
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

    native.createBLEConnection({
      deviceId: deviceId,
      timeout: timeout,
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
