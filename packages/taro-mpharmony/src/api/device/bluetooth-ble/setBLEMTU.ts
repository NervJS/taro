import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 协商设置蓝牙低功耗的最大传输单元
 * 
 * @canUse setBLEMTU
 * @__object [deviceId, mtu]
 * @__success [mtu]
 */
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
    const { deviceId, mtu, success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      mtu?: string
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

    if (typeof mtu !== 'number') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'mtu',
            correct: 'number',
            wrong: mtu,
          }),
        },
        { resolve, reject }
      )
    }

    if (mtu > 512 || mtu < 22) {
      console.error('invalid input')
      return handle.fail()
    }

    // @ts-ignore
    native.setBLEMTU({
      deviceId: deviceId,
      mtu: mtu,
      success: (res: any) => {
        const result: Taro.setBLEMTU.SuccessCallbackResult = {
          /** 最终协商的 MTU 值，与传入参数一致。 */
          mtu: `${mtu}`,
          errMsg: res.errMsg,
          errCode: res.errCode,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        const result: Taro.setBLEMTU.FailCallbackResult = {
          /** 最终协商的 MTU 值。协商失败则无此参数。 */
          mtu: '',
          errMsg: err.errMsg,
          errCode: err.errCode,
        }
        handle.fail(result, { resolve, reject })
      },
    })
  })
}
