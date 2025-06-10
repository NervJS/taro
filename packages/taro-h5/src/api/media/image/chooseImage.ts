import Taro from '@tarojs/api'

import { shouldBeObject } from '../../../utils'
import { chooseMedia } from '../video/chooseMedia'

/**
 * 从本地相册选择图片或使用相机拍照。
 * @deprecated 请使用 chooseMedia 接口
 */
export const chooseImage: typeof Taro.chooseImage = function (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `chooseImage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  let camera = 'back'
  const {
    sourceType = ['album', 'camera'],
    success,
    complete,
    fail,
    ...args
  } = options
  if (sourceType.includes('camera') && sourceType.indexOf('user') > -1) {
    camera = 'front'
  }

  function parseRes (res: Taro.chooseMedia.SuccessCallbackResult): Taro.chooseImage.SuccessCallbackResult {
    const { tempFiles = [], errMsg } = res
    return {
      tempFilePaths: tempFiles.map(item => item.tempFilePath),
      tempFiles: tempFiles.map(item => ({
        path: item.tempFilePath,
        size: item.size,
        type: item.fileType,
        originalFileObj: item.originalFileObj,
      })),
      errMsg,
    }
  }

  return chooseMedia({
    mediaId: 'taroChooseImage',
    ...args,
    sourceType: sourceType as Taro.chooseMedia.Option['sourceType'],
    mediaType: ['image'],
    camera,
    success: (res) => {
      const param = parseRes(res)
      success?.(param)
      complete?.(param)
    },
    fail: (err) => {
      fail?.(err)
      complete?.(err)
    },
  }, 'chooseImage').then(parseRes)
}
