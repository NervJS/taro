import { callAsyncSuccess, callAsyncFail, validateParams } from '../utils'

const mediaLibrary = require('@ohos.multimedia.mediaLibrary')

interface ISaveMediaOptionsOHOS {
  src: string
  mimeType: string
  relativePath?: string
}

const saveMediaSchema = {
  filePath: 'String'
}

const saveMedia = function (options: TaroGeneral.IAnyObject, mimeType: string) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('saveImageToPhotosAlbum', options, saveMediaSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { filePath } = options
    const saveMediaOptions: ISaveMediaOptionsOHOS = {
      src: filePath,
      // TODO：需要获取文件名后缀
      mimeType
    }
    mediaLibrary.getMediaLibrary().storeMediaAsset(saveMediaOptions).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export {
  saveMedia
}
