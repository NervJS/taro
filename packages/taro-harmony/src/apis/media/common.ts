import Taro from '@tarojs/taro'
import { callAsyncSuccess, callAsyncFail, validateParams } from '../utils'

const mediaLibrary = require('@ohos.multimedia.mediaLibrary')

type PreviewMedia = typeof Taro.previewMedia

interface IPreviewImagesOptionsOHOS {
  images: Array<string>
  index: number
}

const previewMediaSchema = {
  sources: 'Atring'
}

// 扩展支持预览video
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
      urls.push(s.url)
    }
    const previewImageOptions: IPreviewImagesOptionsOHOS = {
      images: urls,
      index: current || 0
    }
    mediaLibrary.getMediaLibrary().storeMediaAsset(previewImageOptions).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export {
  previewMedia
}
