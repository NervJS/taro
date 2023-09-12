import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const chooseMedia: typeof Taro.chooseMedia = (options) => {
  const name = 'chooseMedia'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count,
    mediaType = ['video', 'image', 'mix'],
    sourceType = ['album', 'camera'],
    maxDuration,
    sizeType,
    camera = ['back', 'front'],
    success,
    fail,
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    tempFiles?: Taro.chooseMedia.ChooseMedia[]
    type?: string
  }>({ name, success, fail })

  return new Promise<Taro.chooseMedia.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.chooseMedia({
      count: count,
      mediaType: mediaType,
      sourceType: sourceType,
      maxDuration: maxDuration,
      sizeType: sizeType,
      camera: camera,
      success: (res: any) => {
        const tempFiles: Taro.chooseMedia.ChooseMedia[] = []
        res.tempFiles.forEach((tempFile) => {
          const tmpFile: Taro.chooseMedia.ChooseMedia = {
            tempFilePath: tempFile.path,
            size: tempFile.size,
            duration: tempFile.duration || 0,
            height: tempFile.height,
            width: tempFile.width,
            fileType: tempFile.type,
            thumbTempFilePath: ''
          }
          tempFiles.push(tmpFile)
        })
        let retType = 'image'
        if (mediaType.length === 1 && mediaType.includes('image')) {
          retType = 'image'
        } else if (mediaType.length === 1 && mediaType.includes('video')) {
          retType = 'video'
        } else {
          retType = 'mix'
        }

        const result: Taro.chooseMedia.SuccessCallbackResult = {
          tempFiles: tempFiles,
          type: retType,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
