import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 从本地相册选择图片或使用相机拍照。
 */
export const chooseImage: typeof Taro.chooseImage = function (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `chooseImage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 1,
    success,
    fail,
    complete,
    imageId = 'taroChooseImage',
    sourceType = ['album', 'camera']
  } = options
  const handle = new MethodHandler({ name: 'chooseImage', success, fail, complete })
  const res: Partial<Taro.chooseImage.SuccessCallbackResult> = {
    tempFilePaths: [],
    tempFiles: []
  }

  if (count && typeof count !== 'number') {
    res.errMsg = getParameterError({
      para: 'count',
      correct: 'Number',
      wrong: count
    })
    return handle.fail(res)
  }
  // @ts-ignore
  const ret = native.chooseImage({
    count: count,
    imageId: imageId,
    sourceType: sourceType,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
