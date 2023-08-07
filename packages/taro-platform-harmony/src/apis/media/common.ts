// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-media-0000001103383404
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.previewMedia.html
// ✅ wx.previewMedia(Object object)
// ✅ wx.chooseMedia

import mediaLibrary from '@ohos.multimedia.mediaLibrary'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

type PreviewMedia = typeof Taro.previewMedia
type ChooseMedia = typeof Taro.chooseMedia

interface IPreviewImagesOptionsOHOS {
  images: Array<string>
  index: number
}

interface IChooseMediaOptionsOHOS {
  type: string
  count: number
}

const previewMediaSchema = {
  sources: 'Array'
}

// TODO: 扩展支持预览video
const previewMedia: PreviewMedia = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('previewMedia', options, previewMediaSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { sources, current } = options
    const urls: Array<string> = []
    for (const s of sources) {
      if (s.type === 'image') {
        urls.push(s.url)
      }
    }
    const previewImageOptions: IPreviewImagesOptionsOHOS = {
      images: urls,
      index: current || 0
    }
    mediaLibrary.getMediaLibrary().startImagePreview(previewImageOptions.images, previewImageOptions.index).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

const chooseMedia: ChooseMedia = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('chooseMedia', [options], ['Object'])
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { count = 9, mediaType = ['image'] } = options
    // HarmonyOS不支持image和video同时选择
    // TODO: 不支持视频拍摄，无现成组件，后续需要封装
    const mediaSelectOptions: IChooseMediaOptionsOHOS = {
      count,
      type: mediaType[0]
    }
    mediaLibrary.getMediaLibrary().startMediaSelect(mediaSelectOptions).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export {
  chooseMedia,
  previewMedia
}
