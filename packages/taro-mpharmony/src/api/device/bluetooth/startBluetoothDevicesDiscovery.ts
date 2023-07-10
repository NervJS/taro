import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const startBluetoothDevicesDiscovery: typeof Taro.startBluetoothDevicesDiscovery = (options) => {
  const name = 'stopBluetoothDevicesDiscovery'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    allowDuplicatesKey,
    interval,
    services,
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    errMsg?: string
  }>({ name, success, fail, complete })


  console.log('start bluetooth devices discovery')
  // @ts-ignore
  const ret = native.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: allowDuplicatesKey,
    interval: interval,
    services: services,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
