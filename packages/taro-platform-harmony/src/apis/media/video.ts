// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-media-0000001103383404
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html
// ✅ wx.saveVideoToPhotosAlbum
// ❌ wx.openVideoEditor
// ❌ wx.getVideoInfo
// ❌ wx.createVideoContext
// ❌ wx.compressVideo
// ✅ wx.chooseVideo
// VideoContext
//   ❌ VideoContext.exitBackgroundPlayback
//   ❌ VideoContext.exitFullScreen
//   ❌ VideoContext.exitPictureInPicture
//   ❌ VideoContext.hideStatusBar
//   ❌ VideoContext.pause
//   ❌ VideoContext.play
//   ❌ VideoContext.playbackRate
//   ❌ VideoContext.requestBackgroundPlayback
//   ❌ VideoContext.requestFullScreen
//   ❌ VideoContext.seek
//   ❌ VideoContext.sendDanmu
//   ❌ VideoContext.showStatusBar
//   ❌ VideoContext.stop

import mediaLibrary from '@ohos.multimedia.mediaLibrary'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

type ChooseVideo = typeof Taro.chooseVideo
type SaveVideoToPhotosAlbum = typeof Taro.saveVideoToPhotosAlbum

interface IChooseVideoOptionOHOS {
  type: string
  count: number
}

interface ISaveVideoToPhotosAlbumOptionsOHOS {
  src: string
  mimeType: string
  relativePath?: string
}

const saveVideoToPhotosAlbumSchema = {
  filePath: 'String'
}

// TODO: 1.返回属性补全
// TODO: 2.只支持从相册选择，补充摄像头拍摄功能，需要HarmonyOS提供选择组件
const chooseVideo: ChooseVideo = function (options = {}) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('chooseVeide', [options], ['Object'])
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const chooseVideoOptionsOHOS: IChooseVideoOptionOHOS = {
      type: 'video',
      count: 1
    }
    mediaLibrary.getMediaLibrary().startMediaSelect(chooseVideoOptionsOHOS).then((value) => {
      callAsyncSuccess(resolve, { tempFilePaths: value })
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

const saveVideoToPhotosAlbum: SaveVideoToPhotosAlbum = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('saveVideoToPhotosAlbum', options, saveVideoToPhotosAlbumSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { filePath } = options
    const saveVideoToPhotosAlbumOptions: ISaveVideoToPhotosAlbumOptionsOHOS = {
      src: filePath,
      // TODO：需要获取文件名后缀，'video/mp4'、'video/3gpp'等
      mimeType: 'video/mp4'
    }
    mediaLibrary.getMediaLibrary().storeMediaAsset(saveVideoToPhotosAlbumOptions).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export {
  chooseVideo,
  saveVideoToPhotosAlbum
}
