// HarmonyOS 图片模块首批接口从API version 7开始支持。
// HarmonyOS 文档链接：https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-image-0000001122977382
// WX 文档链接：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html

// ✅ wx.getImageInfo(Object object) API7以上支持
// ✅ wx.compressImage(Object object) API7以上支持
// ✅ wx.chooseImage(Object object)
// ❌ wx.chooseMessageFile(Object object) HarmonyOS不支持
// ❌ wx.saveImageToPhotosAlbum(Object object) api 9+ HarmonyOS不支持
// ❌ wx.previewImage(Object object) api 9+ HarmonyOS不支持

import fs from '@ohos.file.fs'
import picker from '@ohos.file.picker'
import image from '@ohos.multimedia.image'
import { isNull } from '@tarojs/shared'

import { callAsyncFail, callAsyncSuccess, requestPermissions, temporarilyNotSupport, validateParams } from '../../utils'
import { READ_IMAGEVIDEO_PERMISSIONS } from '../../utils/permissions'

import type Taro from '@tarojs/taro/types'

interface IPackingOptionOHOS {
  format: string
  quality: number
}

interface IChooseImageData {
  tempFilePaths?: string[]

  tempFiles?: {
    path: string
    size: number
  }
}

const getImageInfoSchema = {
  src: 'String'
}

const compressImageSchema = {
  src: 'String'
}

const chooseImageSchema = {
  count: 'Number'
}

const photoSelectOptions = new picker.PhotoSelectOptions()

export const getImageInfo: typeof Taro.getImageInfo = function (options) {
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


class CompressedImageInfo {
  imageUri = '' // 压缩后图片保存位置的uri
  imageByteLength = 0 // 压缩后图片字节长度
}

async function saveImage(compressedImageData, compressedImageUri) {
  // 定义要保存的压缩图片uri。afterCompressiona.jpeg表示压缩后的图片。
  try {
    const res = fs.accessSync(compressedImageUri)
    if (res) {
      // 如果图片afterCompressiona.jpeg已存在，则删除
      fs.unlinkSync(compressedImageUri)
    }
  } catch (err) {
    console.error(`[Taro] saveImage Error: AccessSync failed with error message: ${err.message}, error code: ${err.code}`)
  }

  // 知识点：保存图片。获取最终图片压缩数据compressedImageData，保存图片。
  // 压缩图片数据写入文件
  const file = fs.openSync(compressedImageUri, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
  fs.writeSync(file.fd, compressedImageData)
  fs.closeSync(file)

  // 获取压缩图片信息
  const compressedImageInfo = new CompressedImageInfo()
  compressedImageInfo.imageUri = compressedImageUri
  compressedImageInfo.imageByteLength = compressedImageData.byteLength

  return compressedImageInfo
}

export const compressImage: typeof Taro.compressImage = function (options) {
  return new Promise((resolve, reject) => {
    requestPermissions([READ_IMAGEVIDEO_PERMISSIONS]).then(() => {
      try {
        validateParams('compressImage', options, compressImageSchema)
      } catch (error) {
        const res = { errMsg: error.message }
        return callAsyncFail(reject, res, options)
      }
      const { src, quality = 80 } = options
      const srcAfterCompress = src.split('.').join('_after_compress.')
      const file = fs.openSync(src, fs.OpenMode.READ_ONLY)

      // const stat = fs.statSync(file.fd)
      // console.log('[Taro] 压缩前图片的大小为：', stat.size)

      const source = image.createImageSource(file.fd)
      if (isNull(source)) {
        const createImageSourceError = { errMsg: 'compressImage fail: createImageSource has failed.' }
        callAsyncFail(reject, createImageSourceError, options)
        return
      }

      const packer = image.createImagePacker(file.fd)
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
        saveImage(value, srcAfterCompress).then(result => {
          callAsyncSuccess(resolve, { tempFilePath: result.imageUri }, options)
        })
      }).catch((error) => {
        callAsyncFail(reject, error, options)
      })

      fs.closeSync(file)
    }, (error: string) => {
      const res = { errMsg: error }
      return callAsyncFail(reject, res, options)
    })
  })
}

export const chooseImage: typeof Taro.chooseImage = function (options) {
  return new Promise((resolve, reject) => {
    requestPermissions([READ_IMAGEVIDEO_PERMISSIONS]).then(() => {
      try {
        validateParams('chooseImage', options, chooseImageSchema)
      } catch (error) {
        const res = { errMsg: error.message }
        return callAsyncFail(reject, res, options)
      }

      const { count = 9 } = options
      const photoViewPicker = new picker.PhotoViewPicker()
      let sizeType = options.sizeType

      if (!sizeType || !sizeType.length) {
        sizeType = ['compressed', 'original']
      }

      photoSelectOptions.maxSelectNumber = count // 选择媒体文件的最大数目
      photoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE // 过滤选择媒体文件类型为IMAGE

      photoViewPicker.select(photoSelectOptions).then((photoSelectResult) => {
        const result: IChooseImageData = {}

        if (sizeType.includes('original')) {
          const tempFiles = photoSelectResult.photoUris.map(uri => {
            const file = fs.openSync(uri, fs.OpenMode.READ_ONLY)
            const stat = fs.statSync(file.fd)
            const size = stat.size

            return {
              size,
              path: uri,
            }
          })

          result.tempFiles = tempFiles
        }

        if (sizeType.includes('compressed')) {
          const actions: Promise<string>[] = photoSelectResult.photoUris.map(uri => {
            return new Promise<string>(resolve => {
              compressImage({
                src: uri,
                success: (compressResult) => {
                  resolve(compressResult.tempFilePath)
                }
              })
            })
          })

          Promise.all(actions).then(tempFilePaths => {
            result.tempFilePaths = tempFilePaths
            callAsyncSuccess(resolve, result, options)
          }).catch(error => {
            const res = { errMsg: error }
            return callAsyncFail(reject, res, options)
          })
        } else {
          callAsyncSuccess(resolve, result, options)
        }
      }).catch((error) => {
        callAsyncFail(reject, error, options)
      })
    }, (error: string) => {
      const res = { errMsg: error }
      return callAsyncFail(reject, res, options)
    })
  })
}

export const previewImage = temporarilyNotSupport('previewImage')
export const saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum')
