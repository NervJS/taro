import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 保存文件到本地
 * 
 * @canUse saveFile
 * @__object [tempFilePath, filePath]
 * @__success [savedFilePath]
 */
export const saveFile: typeof Taro.saveFile = (options) => {
  const name = 'saveFile'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { tempFilePath, filePath, success, fail, complete } = options as Exclude<typeof options, undefined>

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
        wrong: tempFilePath,
      }),
    })
  }

  return new Promise<Taro.saveFile.FailCallbackResult | Taro.saveFile.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.saveFile({
      tempFilePath: tempFilePath,
      filePath: filePath,
      success: (res: any) => {
        const result: Taro.saveFile.SuccessCallbackResult = {
          savedFilePath: res.savedFilePath,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        const errRet: Taro.saveFile.FailCallbackResult = {
          errMsg: err.errMsg,
        }
        handle.fail(errRet, { resolve, reject })
      },
    })
  })
}
