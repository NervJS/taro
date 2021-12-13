// HarmonyOS 图片模块首批接口从API version 7开始支持。
// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-image-0000001122977382
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
// ❌ wx.saveImageToPhotosAlbum(Object object)
// ❌ wx.previewMedia(Object object)
// ❌ wx.previewImage(Object object)
// ❌ wx.getImageInfo(Object object)
// ❌ wx.compressImage(Object object)
// ❌ wx.chooseMessageFile(Object object)
// ❌ wx.chooseMessageFile(Object object)
// ❌ wx.chooseImage(Object object)

import Taro from '@tarojs/taro'
import { callAsyncSuccess, callAsyncFail, validateParams } from '../utils'

const image = require('@ohos.multimedia.image')

type GetImageInfo = typeof Taro.getImageInfo

const getImageInfoSchema = {
  url: 'string'
}
const getImageInfo: GetImageInfo = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('getImageInfo', options, getImageInfoSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { src } = options
    const source = image.createImageSource(src)
    source.getImageInfo().then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export {
  getImageInfo
}
