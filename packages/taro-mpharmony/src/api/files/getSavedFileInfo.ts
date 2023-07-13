import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const getSavedFileInfo: typeof Taro.getSavedFileInfo = (options) => {
  const name = 'getSavedFileInfo'

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
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      createTime?: number
      size?: number
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
    const ret = native.getSavedFileInfo({
      filePath: filePath,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: () => {
        return handle.fail()
      }
    })
    return ret
  })
}
