import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

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

  console.log('get bluetooth adapter state')
  // @ts-ignore
  const ret = native.getBluetoothAdapterState({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
