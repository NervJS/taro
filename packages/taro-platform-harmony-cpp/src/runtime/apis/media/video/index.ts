import photoAccessHelper from '@ohos.file.photoAccessHelper'

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../../utils'
import { VideoContext } from './VideoContext'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

export const createVideoContext: typeof Taro.createVideoContext = (id: string, _: TaroAny) => {
  return new VideoContext(id)
}

// TODO: 1.返回属性补全
// TODO: 2.只支持从相册选择，补充摄像头拍摄功能，需要HarmonyOS提供选择组件
export const chooseVideo: typeof Taro.chooseVideo = function (options = {}) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('chooseVideo', [options], ['Object'])
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const photoViewPicker = new photoAccessHelper.PhotoViewPicker()
    const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions()
    photoSelectOptions.maxSelectNumber = 9 // 选择媒体文件的最大数目
    photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.VIDEO_TYPE // 过滤选择媒体文件类型为IMAGE
    photoSelectOptions.isOriginalSupported = true // 支持选择原图
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

export const compressVideo = /* @__PURE__ */ temporarilyNotSupport('compressVideo')
export const getVideoInfo = /* @__PURE__ */ temporarilyNotSupport('getVideoInfo')
export const openVideoEditor = /* @__PURE__ */ temporarilyNotSupport('openVideoEditor')

export const saveVideoToPhotosAlbum = temporarilyNotSupport('saveVideoToPhotosAlbum')
