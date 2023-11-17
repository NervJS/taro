import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 断开与低功耗蓝牙设备的连接
 * 
 * @canUse closeBLEConnection
 * @__object [deviceId]
 */
export const closeBLEConnection: typeof Taro.closeBLEConnection = (options) => {
  const name = 'closeBLEConnection'

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

    // @ts-ignore
    native.closeBLEConnection({
      deviceId: deviceId,
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
