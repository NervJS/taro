// HarmonyOS 图片模块首批接口从API version 7开始支持。
// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-image-0000001122977382
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
// ✅ wx.saveImageToPhotosAlbum(Object object)
// ✅ wx.previewImage(Object object)
// ✅ wx.getImageInfo(Object object) API7以上支持
// ✅ wx.compressImage(Object object) API7以上支持
// ✅ wx.chooseImage(Object object)
// ❌ wx.chooseMessageFile(Object object) HarmonyOS不支持

import image from '@ohos.multimedia.image'
import mediaLibrary from '@ohos.multimedia.mediaLibrary'
import { isNull } from '@tarojs/shared'
import Taro from '@tarojs/taro'

import { callAsyncFail, callAsyncSuccess, validateParams } from '../utils'

type GetImageInfo = typeof Taro.getImageInfo
type CompressImage = typeof Taro.compressImage
type PreviewImage = typeof Taro.previewImage
type ChooseImage = typeof Taro.chooseImage
type SaveImageToPhotosAlbum = typeof Taro.saveImageToPhotosAlbum

interface IPackingOptionOHOS {
  format: string
  quality: number
}

interface IChooseImageOptionOHOS {
  type: string
  count: number
}

interface ISaveImageToPhotosAlbumOptionsOHOS {
  src: string
  mimeType: string
  relativePath?: string
}

interface IPreviewImagesOptionsOHOS {
  images: Array<string>
  index: number
}

const getImageInfoSchema = {
  url: 'String'
}

const compressImageSchema = {
  url: 'String'
}

const previewImageSchema = {
  urls: 'Array'
  // showMenu: 'Boolean',
  // current: 'String',
  // referrerPolicy: 'String'
}

const chooseImageSchema = {
  count: 'Number'
}

const saveImageToPhotosAlbumSchema = {
  filePath: 'String'
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

const previewImage: PreviewImage = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('previewImage', options, previewImageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { urls, current } = options
    const previewImageOptions: IPreviewImagesOptionsOHOS = {
      images: urls,
      index: current ? parseInt(current as string) : 0
    }
    mediaLibrary.getMediaLibrary().startImagePreview(previewImageOptions.images, previewImageOptions.index).then(() => {
      const previewImageRes = { errMsg: 'previewImage success.' }
      callAsyncSuccess(resolve, previewImageRes, options)
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
    const chooseImageOptionsOHOS: IChooseImageOptionOHOS = {
      type: 'image',
      count: count
    }
    mediaLibrary.getMediaLibrary().startMediaSelect(chooseImageOptionsOHOS).then((value) => {
      callAsyncSuccess(resolve, { tempFilePaths: value })
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

const saveImageToPhotosAlbum: SaveImageToPhotosAlbum = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('saveImageToPhotosAlbum', options, saveImageToPhotosAlbumSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { filePath } = options
    const saveImageToPhotosAlbumOptions: ISaveImageToPhotosAlbumOptionsOHOS = {
      src: filePath,
      // TODO：需要获取文件名后缀，'image/gif'、'image/jpeg'、'image/png'等
      mimeType: 'image/jpeg'
    }
    mediaLibrary.getMediaLibrary().storeMediaAsset(saveImageToPhotosAlbumOptions).then((value) => {
      callAsyncSuccess(resolve, value, options)
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

export {
  chooseImage,
  compressImage,
  getImageInfo,
  previewImage,
  saveImageToPhotosAlbum
}
