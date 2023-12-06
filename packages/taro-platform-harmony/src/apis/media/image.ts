// HarmonyOS 图片模块首批接口从API version 7开始支持。
// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-image-0000001122977382
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html

// ✅ wx.getImageInfo(Object object) API7以上支持
// ✅ wx.compressImage(Object object) API7以上支持
// ✅ wx.chooseImage(Object object)
// ❌ wx.chooseMessageFile(Object object) HarmonyOS不支持
// ❌ wx.saveImageToPhotosAlbum(Object object) api 9+ HarmonyOS不支持
// ❌ wx.previewImage(Object object) api 9+ HarmonyOS不支持

import picker from '@ohos.file.picker'
import image from '@ohos.multimedia.image'
import { isNull } from '@tarojs/shared'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, temporarilyNotSupport, validateParams } from '../utils'

type GetImageInfo = typeof Taro.getImageInfo
type CompressImage = typeof Taro.compressImage
type ChooseImage = typeof Taro.chooseImage

interface IPackingOptionOHOS {
  format: string
  quality: number
}

const getImageInfoSchema = {
  url: 'String'
}

const compressImageSchema = {
  url: 'String'
}

const chooseImageSchema = {
  count: 'Number'
}

const photoSelectOptions = new picker.PhotoSelectOptions()

const getImageInfo: GetImageInfo = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('getImageInfo', options, getImageInfoSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { src } = options
    // FIX: 调试发现在版本api7中 source 为 undefined, 需鸿蒙侧确认
    const source = image.createImageSource(src)
    if (isNull(source)) {
      const createImageSourceError = { errMsg: 'getImageInfo fail: createImageSource has failed.' }
      callAsyncFail(reject, createImageSourceError, options)
      return
    }
    source.getImageInfo().then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

const compressImage: CompressImage = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('compressImage', options, compressImageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { src, quality = 80 } = options

    const source = image.createImageSource(src)
    if (isNull(source)) {
      const createImageSourceError = { errMsg: 'compressImage fail: createImageSource has failed.' }
      callAsyncFail(reject, createImageSourceError, options)
      return
    }

    const packer = image.createImagePacker(src)
    if (isNull(packer)) {
      const createImagePackerError = { errMsg: 'compressImage fail: createImagePacker has failed.' }
      callAsyncFail(reject, createImagePackerError, options)
    }

    const packingOptionsOHOS: IPackingOptionOHOS = {
      // TODO：需要获取文件名后缀
      format: 'image/jpeg',
      quality: quality
    }
    packer.packing(source, packingOptionsOHOS).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

const chooseImage: ChooseImage = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('chooseImage', options, chooseImageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { count = 9 } = options
    const photoViewPicker = new picker.PhotoViewPicker()

    photoSelectOptions.maxSelectNumber = count // 选择媒体文件的最大数目
    photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE // 过滤选择媒体文件类型为IMAGE

    photoViewPicker.select(photoSelectOptions).then((photoSelectResult) => {
      callAsyncSuccess(resolve, { tempFilePaths: photoSelectResult.photoUris })
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export const previewImage = temporarilyNotSupport('previewImage')
export const saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum')

export {
  chooseImage,
  compressImage,
  getImageInfo,
}
