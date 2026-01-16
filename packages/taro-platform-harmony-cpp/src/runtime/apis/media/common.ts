// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-media-0000001103383404
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewMedia.html
// ✅ wx.previewMedia(Object object)
// ✅ wx.chooseMedia

import photoAccessHelper from '@ohos.file.photoAccessHelper'

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../utils'

import type Taro from '@tarojs/taro/types'

// TODO: 扩展支持预览video
export const previewMedia = temporarilyNotSupport('previewMedia')

export const chooseMedia: typeof Taro.chooseMedia = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('chooseMedia', [options], ['Object'])
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { count = 9, mediaType = ['image'] } = options

    const mediaTypeAdapter = {
      0b1: photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE,
      0b10: photoAccessHelper.PhotoViewMIMETypes.VIDEO_TYPE,
      0b11: photoAccessHelper.PhotoViewMIMETypes.IMAGE_VIDEO_TYPE,
    }

    const photoViewPicker = new photoAccessHelper.PhotoViewPicker()
    const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions()
    photoSelectOptions.maxSelectNumber = count // 选择媒体文件的最大数目
    photoSelectOptions.MIMEType =
      mediaTypeAdapter[
        mediaType.reduce((acc: number, cur: string) => {
          switch (cur) {
            case 'image':
              return acc | 0b1
            case 'video':
              return acc | 0b10
            default:
              return acc
          }
        }, 0b1)
      ]
    photoSelectOptions.isOriginalSupported = true
    photoViewPicker
      .select(photoSelectOptions)
      .then((photoSelectResult) => {
        const uris = photoSelectResult.photoUris
        callAsyncSuccess(resolve, { tempFilePaths: uris })
      })
      .catch((error) => {
        callAsyncFail(reject, error, options)
      })
  })
}
