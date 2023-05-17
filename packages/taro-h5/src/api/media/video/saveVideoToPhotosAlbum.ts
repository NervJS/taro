import Taro from '@tarojs/api'

import { createDownload, getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

export const saveVideoToPhotosAlbum: typeof Taro.saveVideoToPhotosAlbum = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${saveVideoToPhotosAlbum.name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    filePath,
    success,
    fail,
    complete,
  } = options
  const handle = new MethodHandler({ name: saveVideoToPhotosAlbum.name, success, fail, complete })
  const res: Partial<TaroGeneral.CallbackResult> = {}

  if (typeof filePath !== 'string') {
    res.errMsg = getParameterError({
      para: 'filePath',
      correct: 'String',
      wrong: filePath
    })
    return handle.fail(res)
  }

  createDownload(filePath)
  return handle.success()
}
