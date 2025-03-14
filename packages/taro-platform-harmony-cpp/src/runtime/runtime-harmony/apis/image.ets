import fs from '@ohos.file.fs'
import image from '@ohos.multimedia.image'
import photoAccessHelper from '@ohos.file.photoAccessHelper'

import { Current } from './current'
import { getWindowInfo } from './page'
import { validateParams } from '../utils'
import { handleTaskPoolCompressImage, handleTaskPoolGetImageSize } from './taskpool'

import type { TaroAny } from '@tarojs/runtime'
import type { IEtsMethodsOptions } from '../index'

function isNull(o: TaroAny) {
  return o === null;
}

interface IChooseImageData {
  tempFilePaths?: string[]

  tempFiles?: TaroAny
}

interface IPromise { size: number, path: string }

const getImageInfoSchema: TaroAny = {
  src: 'String',
}

const compressImageSchema: TaroAny = {
  src: 'String',
}

const chooseImageSchema: TaroAny = {
  count: 'Number',
}

const photoSelectOptions: TaroAny = photoAccessHelper.PhotoSelectOptions ? new photoAccessHelper.PhotoSelectOptions() : null

export const getImageInfo: TaroAny = (options: TaroAny, successHandler: TaroAny, errorHandler: TaroAny): TaroAny => {
  return new Promise<TaroAny>((): TaroAny => {
    try {
      validateParams('getImageInfo', options, getImageInfoSchema)
    } catch (error) {
      const res: TaroAny = { errMsg: error.message }
      return errorHandler(res)
    }
    const src: TaroAny = (options as TaroAny).src
    // FIX: 调试发现在版本api7中 source 为 undefined, 需鸿蒙侧确认
    const source = image.createImageSource(src)
    if (isNull(source)) {
      const createImageSourceError: TaroAny = { errMsg: 'getImageInfo fail: createImageSource has failed.' }
      errorHandler(createImageSourceError)
      return
    }
    source
      .getImageInfo()
      .then((value) => {
        successHandler(value)
      })
      .catch((error: TaroAny) => {
        errorHandler(error)
      })
  })
}

class CompressedImageInfo {
  imageUri = '' // 压缩后图片保存位置的uri
  imageByteLength = 0 // 压缩后图片字节长度
}

async function saveImage(compressedImageData: TaroAny, compressedImageUri: TaroAny) {
  const tempArr: TaroAny = compressedImageUri.split('/')
  const name: TaroAny = tempArr[tempArr.length - 1]
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

export const compressImage: TaroAny = (options: TaroAny, successHandle: TaroAny, errorHandle: TaroAny): TaroAny => {
  return new Promise<TaroAny>((): TaroAny => {
    try {
      validateParams('compressImage', options, compressImageSchema)
    } catch (error) {
      const res: TaroAny = { errMsg: error.message }
      return errorHandle(res)
    }
    const src: TaroAny = (options as TaroAny).src
    const quality: TaroAny = (options as TaroAny).quality || 80
    const compressedWidth: TaroAny = (options as TaroAny).compressedWidth
    const compressedHeight: TaroAny = (options as TaroAny).compressedHeight
    const srcAfterCompress: TaroAny = src.includes('_after_compress') ? src : src.split('.').join('_after_compress.')
    handleTaskPoolCompressImage({
      name: 'compressImage',
      args: [src, quality, compressedWidth, compressedHeight],
      scope: 'taskpool',
      type: 'method',
      successHandler(pixelMap: TaroAny) {
        const packer = image.createImagePacker()
        if (isNull(packer)) {
          const createImagePackerError: TaroAny = { errMsg: 'compressImage fail: createImagePacker has failed.' }
          errorHandle(createImagePackerError)
          return
        }
        const isPNG: TaroAny = src.endsWith('.png')
        const packingOptionsOHOS: TaroAny = {
          format: isPNG ? 'image/png' : 'image/jpeg',
          quality: quality,
        }
        packer
          .packing(pixelMap, packingOptionsOHOS)
          .then((value) => {
            saveImage(value, srcAfterCompress).then((result) => {
              successHandle({ tempFilePath: result.imageUri })
            })
          })
          .catch((error: TaroAny) => {
            errorHandle(error)
          })
      },
      errorHandler(res: TaroAny) {
        errorHandle(res)
      },
    })
  })
}

export const chooseImage: TaroAny = (options: TaroAny, successHandle: TaroAny, errorHandle: TaroAny) => {
  return new Promise<TaroAny>((): TaroAny => {
    try {
      validateParams('chooseImage', options, chooseImageSchema)
    } catch (error) {
      const res: TaroAny = { errMsg: error.message }
      return errorHandle(res)
    }

    const count: TaroAny = (options as TaroAny)?.count || 9
    const photoViewPicker = new photoAccessHelper.PhotoViewPicker()
    let sizeType: TaroAny = (options as TaroAny).sizeType

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
          const getSizeAction: TaroAny = photoSelectResult.photoUris.map((uri) => {
            return new Promise<TaroAny>((resolve, reject) => {
              handleTaskPoolGetImageSize({
                name: 'getImageSize',
                args: [uri],
                scope: 'taskpool',
                type: 'method',
                successHandler(res: TaroAny) {
                  const data: TaroAny = res.data
                  resolve({
                    size: data,
                    path: uri,
                  })
                },
                errorHandler(res: TaroAny) {
                  reject(res)
                },
              })
            })
          })
          Promise.all(getSizeAction).then((tempFiles: TaroAny) => {
            result.tempFiles = tempFiles
            result.tempFilePaths = tempFiles.map((item: TaroAny): TaroAny => {
              return item.path
            })
            successHandle(result)
          })
        } else {
          const actions: Promise<string>[] = photoSelectResult.photoUris.map((uri) => {
            return new Promise<string>((resolve, reject) => {
              compressImage({
                src: uri,
                compressedWidth: getWindowInfo().screenWidth / 2,
                compressedHeight: getWindowInfo().screenHeight / 2,
              }, (compressResult: TaroAny) => {
                resolve(compressResult.tempFilePath)
              }, (err: TaroAny) => {
                reject(err)
              })
            })
          })

          const sizeAction = actions.map((p) => {
            return new Promise<IPromise>((resolve, reject) => {
              p.then((uri) => {
                handleTaskPoolGetImageSize({
                  name: 'getImageSize',
                  args: [uri],
                  scope: 'taskpool',
                  type: 'method',
                  successHandler(res: TaroAny) {
                    const data: TaroAny = res.data
                    const result: TaroAny = {
                      size: data,
                      path: uri,
                    }
                    resolve(result)
                  },
                  errorHandler(res: TaroAny) {
                    reject(res)
                  },
                })
              }).catch((e: TaroAny) => {
                reject(e)
              })
            })
          })

          Promise.all(sizeAction)
            .then((tempFiles) => {
              result.tempFilePaths = tempFiles.map((item) => item.path)
              result.tempFiles = tempFiles
              successHandle(result)
            })
            .catch((error: TaroAny): TaroAny => {
              const res: TaroAny = { errMsg: error }
              errorHandle(res)
            })
        }
      })
      .catch((error: TaroAny) => {
        errorHandle(error)
      })
  })
}

export function handleTaroImageMethod(option: IEtsMethodsOptions) {
  const successHandler = option.successHandler
  const errorHandler = option.errorHandler
  switch (option.name) {
    case 'chooseImage': {
      chooseImage((option as TaroAny).args[0], successHandler, errorHandler)
      break
    }
    case 'compressImage': {
      compressImage((option as TaroAny).args[0], successHandler, errorHandler)
      break
    }
    case 'getImageInfo': {
      getImageInfo((option as TaroAny).args[0], successHandler, errorHandler)
      break
    }
  }
}
