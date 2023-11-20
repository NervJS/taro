import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 新开页面打开文档，支持格式
 * 
 * @canUse removeSavedFile
 * @__object [filePath]
 */
export const removeSavedFile: typeof Taro.removeSavedFile = (options) => {
  const name = 'removeSavedFile'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { filePath, success, fail, complete } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
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

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.removeSavedFile({
      filePath: filePath,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
