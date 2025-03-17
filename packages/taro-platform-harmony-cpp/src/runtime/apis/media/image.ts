import fs from '@ohos.file.fs'
import photoAccessHelper from '@ohos.file.photoAccessHelper'
import image from '@ohos.multimedia.image'
import { Current, eventCenter } from '@tarojs/runtime'
import { isNull } from '@tarojs/shared'

import { getSystemInfoSync } from '../base'
import {
  callAsyncFail,
  callAsyncSuccess,
  ETS_METHODS_TRIGGER_EVENTNAME,
  MethodHandler,
  temporarilyNotSupport,
  validateParams,
} from '../utils'

import type Taro from '@tarojs/taro/types'

const scope = 'media'
const type = 'method'

export const previewImage: typeof Taro.previewImage = function (options) {
  const name = 'previewImage'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope,
      type,
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}

interface IPackingOptionOHOS {
  format: string
  quality: number
}

interface IChooseImageData {
  tempFilePaths?: string[]

  tempFiles?: {
    path: string
    size: number
  }[]
}

const getImageInfoSchema = {
  src: 'String',
}

const compressImageSchema = {
  src: 'String',
}

const chooseImageSchema = {
  count: 'Number',
}

const photoSelectOptions = new photoAccessHelper.PhotoSelectOptions()

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
    source
      .getImageInfo()
      .then((value) => {
        callAsyncSuccess(resolve, value, options)
      })
      .catch((error) => {
        callAsyncFail(reject, error, options)
      })
  })
}

class CompressedImageInfo {
  imageUri = '' // 压缩后图片保存位置的uri
  imageByteLength = 0 // 压缩后图片字节长度
}

async function saveImage(compressedImageData, compressedImageUri) {
  const tempArr = compressedImageUri.split('/')
  const name = tempArr[tempArr.length - 1]
  const context = getContext(Current?.page)
  const applicationContext = context.getApplicationContext()
  const tempDir = applicationContext.tempDir
  const filePath = `${tempDir}/${name}`

  try {
    const res = fs.accessSync(filePath)
    if (res) {
      // 如果图片afterCompressiona.jpeg已存在，则删除
      fs.unlinkSync(filePath)
    }
  } catch (err) {
    console.error(
      `[Taro] saveImage Error: AccessSync failed with error message: ${err.message}, error code: ${err.code}`
    )
  }

  // 知识点：保存图片。获取最终图片压缩数据compressedImageData，保存图片。
  // 压缩图片数据写入文件
  const file = fs.openSync(filePath, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE)
  fs.writeSync(file.fd, compressedImageData)
  fs.closeSync(file)

  // 获取压缩图片信息
  const compressedImageInfo = new CompressedImageInfo()
  compressedImageInfo.imageUri = filePath
  compressedImageInfo.imageByteLength = compressedImageData.byteLength

  return compressedImageInfo
}

export const compressImage: typeof Taro.compressImage = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('compressImage', options, compressImageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }
    const { src, quality = 80, compressedWidth, compressedHeight } = options
    const srcAfterCompress = src.includes('_after_compress') ? src : src.split('.').join('_after_compress.')
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name: 'compressImage',
      args: [src, quality, compressedWidth, compressedHeight],
      scope: 'taskpool',
      type: 'method',
      successHandler(pixelMap) {
        const packer = image.createImagePacker()
        if (isNull(packer)) {
          const createImagePackerError = { errMsg: 'compressImage fail: createImagePacker has failed.' }
          callAsyncFail(reject, createImagePackerError, options)
          return
        }
        const isPNG = src.endsWith('.png')
        const packingOptionsOHOS: IPackingOptionOHOS = {
          format: isPNG ? 'image/png' : 'image/jpeg',
          quality: quality,
        }
        packer
          .packing(pixelMap, packingOptionsOHOS)
          .then((value) => {
            saveImage(value, srcAfterCompress).then((result) => {
              callAsyncSuccess(resolve, { tempFilePath: result.imageUri }, options)
            })
          })
          .catch((error) => {
            callAsyncFail(reject, error, options)
          })
      },
      errorHandler(res) {
        callAsyncFail(reject, res, options)
      },
    })
  })
}

export const chooseImage: typeof Taro.chooseImage = function (options) {
  return new Promise((resolve, reject) => {
    try {
      validateParams('chooseImage', options, chooseImageSchema)
    } catch (error) {
      const res = { errMsg: error.message }
      return callAsyncFail(reject, res, options)
    }

    const { count = 9 } = options
    const photoViewPicker = new photoAccessHelper.PhotoViewPicker()
    let sizeType = options.sizeType

    if (!sizeType || !sizeType.length) {
      sizeType = ['compressed', 'original']
    }

    photoSelectOptions.maxSelectNumber = count // 选择媒体文件的最大数目
    photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE // 过滤选择媒体文件类型为IMAGE
    photoSelectOptions.isOriginalSupported = true // 支持选择原图
    photoViewPicker
      .select(photoSelectOptions)
      .then((photoSelectResult) => {
        const result: IChooseImageData = {}
        const isOrigin = photoSelectResult.isOriginalPhoto

        if (isOrigin) {
          const getSizeAction = photoSelectResult.photoUris.map((uri) => {
            return new Promise((resolve, reject) => {
              eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
                name: 'getImageSize',
                args: [uri],
                scope: 'taskpool',
                type: 'method',
                successHandler({ data }) {
                  resolve({
                    size: data,
                    path: uri,
                  })
                },
                errorHandler(res) {
                  reject(res)
                },
              })
            })
          })
          Promise.all(getSizeAction).then((tempFiles) => {
            result.tempFiles = tempFiles
            result.tempFilePaths = tempFiles.map((item) => item.path)
            callAsyncSuccess(resolve, result, options)
          })
        } else {
          const actions: Promise<string>[] = photoSelectResult.photoUris.map((uri) => {
            return new Promise<string>((resolve, reject) => {
              compressImage({
                src: uri,
                compressedWidth: getSystemInfoSync().screenWidth / 2,
                compressedHeight: getSystemInfoSync().screenHeight / 2,
                success: (compressResult) => {
                  resolve(compressResult.tempFilePath)
                },
                fail: (err) => {
                  reject(err)
                }
              })
            })
          })

          const sizeAction = actions.map((p) => {
            return new Promise<{ size: number, path: string }>((resolve, reject) => {
              p.then((uri) => {
                eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
                  name: 'getImageSize',
                  args: [uri],
                  scope: 'taskpool',
                  type: 'method',
                  successHandler({ data }) {
                    resolve({
                      size: data,
                      path: uri,
                    })
                  },
                  errorHandler(res) {
                    reject(res)
                  },
                })
              }).catch((e) => {
                reject(e)
              })
            })
          })

          Promise.all(sizeAction)
            .then((tempFiles) => {
              result.tempFilePaths = tempFiles.map((item) => item.path)
              result.tempFiles = tempFiles
              callAsyncSuccess(resolve, result, options)
            })
            .catch((error) => {
              const res = { errMsg: error }
              return callAsyncFail(reject, res, options)
            })
        }
      })
      .catch((error) => {
        callAsyncFail(reject, error, options)
      })
  })
}

export const saveImageToPhotosAlbum = temporarilyNotSupport('saveImageToPhotosAlbum')
