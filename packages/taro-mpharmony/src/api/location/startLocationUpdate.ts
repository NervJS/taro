import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const startLocationUpdate: typeof Taro.startLocationUpdate = (options) => {
  const name = 'startLocationUpdate'
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

  const handle = new MethodHandler({ name, success, fail, complete })

  console.log('start location update')
  // @ts-ignore
  const ret = native.startLocationUpdate({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
