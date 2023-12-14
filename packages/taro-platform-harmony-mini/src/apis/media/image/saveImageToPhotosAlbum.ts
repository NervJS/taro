import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 保存图片到系统相册
 * 
 * @canUse saveImageToPhotosAlbum 
 * @__object [filePath]
 */
export const saveImageToPhotosAlbum: typeof Taro.saveImageToPhotosAlbum = (options) => {
  const methodName = 'saveImageToPhotosAlbum'
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
    native.saveImageToPhotosAlbum({
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
