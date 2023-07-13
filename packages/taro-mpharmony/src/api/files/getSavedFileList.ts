import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const getSavedFileList: typeof Taro.getSavedFileList = (options) => {
  const name = 'getSavedFileList'
  
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
    fileList?: object
    errMsg?: string
  }>({ name, success, fail, complete })

  // @ts-ignore
  const ret = native.getSavedFileList({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: () => {
      return handle.fail()
    }
  })
  return ret
}
