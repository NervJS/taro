import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const getConnectedBluetoothDevices: typeof Taro.getConnectedBluetoothDevices = (options) => {
  const name = 'getConnectedBluetoothDevices'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      services,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      devices?: object
      errMsg?: string
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof services !== 'object') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'services',
          correct: 'object',
          wrong: services
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.getConnectedBluetoothDevices({
      services: services,
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
