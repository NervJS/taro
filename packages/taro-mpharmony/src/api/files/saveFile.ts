import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const saveFile: typeof Taro.saveFile = (options) => {
  const name = 'saveFile'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const{
      tempFilePath,
      filePath,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      savedFilePath?: string
      errMsg?: string
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof tempFilePath !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'tempFilePath',
          correct: 'string',
          wrong: tempFilePath
        })
      }, { resolve, reject })
    }
        
    // @ts-ignore
    const ret = native.saveFile({
      tempFilePath: tempFilePath,
      filePath:filePath,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        console.error(err.errMsg)
        return handle.fail(err)
      }
    })
    return ret
  })
}
