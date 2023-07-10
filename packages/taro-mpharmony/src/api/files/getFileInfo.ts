import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const getFileInfo: typeof Taro.getFileInfo = (options) => {
  const name = 'getFileInfo'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      filePath,
      digestAlgorithm,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      size?: number
      digest?: string
      errMsg?: string
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof filePath !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'filePath',
          correct: 'string',
          wrong: filePath
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.getFileInfo({
      filePath: filePath,
      digestAlgorithm: digestAlgorithm,
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
