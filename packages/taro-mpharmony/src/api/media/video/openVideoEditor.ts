import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 打开视频编辑器
 * 
 * @canUse openVideoEditor 
 * @__object [filePath]
 * @__success [duration, size, tempFilePath, tempThumbPath]
 */
export const openVideoEditor: typeof Taro.openVideoEditor = (options) => {
  const name = 'openVideoEditor'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { filePath, success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler<{
    duration?: number
    size?: number
    tempFilePath?: string
    tempThumbPath?: string
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

  return new Promise<Taro.openVideoEditor.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.openVideoEditor({
      filePath: filePath,
      success: (res: any) => {
        const result: Taro.openVideoEditor.SuccessCallbackResult = {
          duration: res.duration,
          size: res.size,
          tempFilePath: res.tempFilePath,
          tempThumbPath: res.tempThumbPath,
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
