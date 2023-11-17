import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取本机蓝牙适配器状态
 * 
 * @canUse getBluetoothAdapterState
 * @__success [available, discovering]
 */
export const getBluetoothAdapterState: typeof Taro.getBluetoothAdapterState = (options) => {
  const name = 'getBluetoothAdapterState'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options || {}
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
          errMsg: '',
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
