import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 从本地相册选择图片或使用相机拍照。
 */
export const chooseImage: typeof Taro.chooseImage = function (options) {
  const name = 'chooseImage'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 9,
    success,
    fail,
    complete,
    imageId = 'taroChooseImage',
    sizeType = ['original', 'compressed'],
    sourceType = ['album', 'camera'],
  } = options

  const handle = new MethodHandler<{
    tempFilePaths?: string[]
    tempFiles?: Taro.chooseImage.ImageFile[]
    errMsg?: string
  }>({ name, success, fail, complete })

  if (count && typeof count !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'count',
        correct: 'Number',
        wrong: count,
      }),
    })
  }

  return new Promise<Taro.chooseImage.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.chooseImage({
      count: count,
      imageId: imageId,
      sourceType: sourceType,
      sizeType: sizeType,
      success: (res: any) => {
        const result: Taro.chooseImage.SuccessCallbackResult = {
          tempFilePaths: res.tempFilePaths,
          tempFiles: res.tempFiles,
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
