import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const openBluetoothAdapter: typeof Taro.openBluetoothAdapter = (options) => {
  const name = 'openBluetoothAdapter'
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
    errMsg?: string
  }>({ name, success, fail, complete })


  console.log('open bluetooth adapter')
  // @ts-ignore
  const ret = native.openBluetoothAdapter({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
