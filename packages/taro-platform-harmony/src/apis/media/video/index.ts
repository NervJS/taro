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

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../../utils'
import { VideoContext } from './VideoContext'

import type { TaroAny } from '@tarojs/runtime'
import type Taro from '@tarojs/taro/types'

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

export const compressVideo = /* @__PURE__ */ temporarilyNotSupport('compressVideo')
export const getVideoInfo = /* @__PURE__ */ temporarilyNotSupport('getVideoInfo')
export const openVideoEditor = /* @__PURE__ */ temporarilyNotSupport('openVideoEditor')

export const saveVideoToPhotosAlbum: typeof Taro.saveVideoToPhotosAlbum = function (options) {
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
