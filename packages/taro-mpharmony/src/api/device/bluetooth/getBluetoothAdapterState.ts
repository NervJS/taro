import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const getBluetoothAdapterState: typeof Taro.getBluetoothAdapterState = (options) => {
  const name = 'getBluetoothAdapterState'

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
    available?: boolean
    discovering?: boolean
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.getBluetoothAdapterState({
      success: (res: any) => {
        const result: Taro.getBluetoothAdapterState.SuccessCallbackResult = {
          available: res[0].available,
          discovering: res[0].discovering,
          errMsg: ''
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      }
    })
  })
}
