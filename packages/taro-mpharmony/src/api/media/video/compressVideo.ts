import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 压缩视频接口
 * 
 * @canUse compressVideo
 * @null_implementation
 */
export const compressVideo: typeof Taro.compressVideo = (options) => {
  const name = 'compressVideo'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    src,
    quality = ['low', 'medium', 'high'],
    bitrate,
    fps,
    resolution,
    success,
    fail,
    complete,
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
        wrong: src,
      }),
    })
  }
  if (typeof quality !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'quality',
        correct: 'string',
        wrong: quality,
      }),
    })
  }
  if (typeof bitrate !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'bitrate',
        correct: 'number',
        wrong: bitrate,
      }),
    })
  }
  if (typeof fps !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'fps',
        correct: 'number',
        wrong: fps,
      }),
    })
  }
  if (typeof resolution !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'resolution',
        correct: 'number',
        wrong: resolution,
      }),
    })
  }

  return new Promise<Taro.compressVideo.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.compressVideo({
      src: src,
      quality: quality,
      bitrate: bitrate,
      fps: fps,
      resolution: resolution,
      success: (res: any) => {
        const result: Taro.compressVideo.SuccessCallbackResult = {
          tempFilePath: res.tempFilePath,
          size: res.size,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        return handle.fail(err)
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
