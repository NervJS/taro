import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const getFileInfo: typeof Taro.getFileInfo = (options) => {
  const name = 'getFileInfo'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { filePath, digestAlgorithm, success, fail, complete } = options as Exclude<typeof options, undefined>

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
        wrong: filePath,
      }),
    })
  }

  return new Promise<Taro.getFileInfo.FailCallbackResult | Taro.getFileInfo.SuccessCallbackResult>(
    (resolve, reject) => {
      // @ts-ignore
      native.getFileInfo({
        filePath: filePath,
        digestAlgorithm: digestAlgorithm,
        success: (res: any) => {
          const result: Taro.getFileInfo.SuccessCallbackResult = {
            size: res.size,
            digest: res.digest,
            errMsg: res.errMsg,
          }
          handle.success(result, { resolve, reject })
        },
        fail: (err: any) => {
          const errRet: Taro.getFileInfo.FailCallbackResult = {
            errMsg: err.errMsg,
          }
          handle.fail(errRet, { resolve, reject })
        },
      })
    }
  )
}
