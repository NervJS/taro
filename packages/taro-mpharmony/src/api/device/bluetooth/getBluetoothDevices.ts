import Taro from '@tarojs/taro'
import {  shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const getBluetoothDevices: typeof Taro.getBluetoothDevices = (options) => {
  const name = 'getBluetoothDevices'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    devices?: object
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.getBluetoothDevices({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      }
    })
  })
}
