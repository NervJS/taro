import Taro from "@tarojs/taro"
import { getParameterError, shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

export const compressVideo: typeof Taro.compressVideo = (options) => {
  const name = 'compressVideo'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      src,
      quality=['low','medium','high'],
      bitrate,
      fps,
      resolution,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      tempFilePath?: string
      size?: number
    }>({ name, success, fail, complete })

    // options.url must be String
    if (typeof src !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'src',
          correct: 'string',
          wrong: src
        })
      }, { resolve, reject })
    }
    if (typeof quality !== 'object') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'quality',
          correct: 'object',
          wrong: quality
        })
      }, { resolve, reject })
    }
    if (typeof bitrate !== 'number') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'bitrate',
          correct: 'number',
          wrong: bitrate
        })
      }, { resolve, reject })
    }
    if (typeof fps !== 'number') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'fps',
          correct: 'number',
          wrong: fps
        })
      }, { resolve, reject })
    }
    if (typeof resolution !== 'number') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'resolution',
          correct: 'number',
          wrong: resolution
        })
      }, { resolve, reject })
    }

    console.log('compress video')
    // @ts-ignore
    const ret = native.compressVideo({
      src: src,
      quality: quality,
      bitrate: bitrate,
      fps: fps,
      resolution: resolution,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        return handle.fail(err)
      }
    })
    return ret
  })
}
