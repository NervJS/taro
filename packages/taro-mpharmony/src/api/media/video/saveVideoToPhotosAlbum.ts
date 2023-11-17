import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 保存视频到系统相册
 * 
 * @canUse saveVideoToPhotosAlbum 
 * @__object [filePath] 
 */
export const saveVideoToPhotosAlbum: typeof Taro.saveVideoToPhotosAlbum = (options) => {
  const methodName = 'saveVideoToPhotosAlbum'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${methodName}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { filePath, success, fail, complete } = options

  const handle = new MethodHandler({ name: methodName, success, fail, complete })
  if (typeof filePath !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'filePath',
        correct: 'String',
        wrong: filePath,
      }),
    })
  }

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.saveVideoToPhotosAlbum({
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
