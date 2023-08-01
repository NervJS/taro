import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const chooseMedia: typeof Taro.chooseMedia = (options) => {
  const name = 'chooseMedia'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
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
    tempFilePath?: string
    duration?: number
    size?: number
    height?: number
    width?: number
    thumbTempFilePath?: string
    errMsg?: string
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
        const result: Taro.chooseMedia.SuccessCallbackResult = {
          tempFiles: res.tempFiles,
          type: res.type,
          errMsg: res.errMsg
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      }
    })
  })
}
