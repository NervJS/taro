import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取本地文件的文件信息
 * 
 * @canUse getSavedFileInfo
 * @__object [filePath]
 * @__success [createTime, size]
 */
export const getSavedFileInfo: typeof Taro.getSavedFileInfo = (options) => {
  const name = 'getSavedFileInfo'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { filePath, success, fail, complete } = options as Exclude<typeof options, undefined>

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
        wrong: filePath,
      }),
    })
  }

  return new Promise<Taro.getSavedFileInfo.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.getSavedFileInfo({
      filePath: filePath,
      success: (res: any) => {
        const result: Taro.getSavedFileInfo.SuccessCallbackResult = {
          createTime: res.createTime,
          size: res.size,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
