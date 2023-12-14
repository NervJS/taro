import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 拍摄视频或从手机相册中选视频
 * 
 * @canUse chooseVideo 
 * @__object [camera[back, front], compressed, maxDuration, sourceType[album, camera]] 
 * @__success [tempFilePath, duration, size, height, width]
 */
export const chooseVideo: typeof Taro.chooseVideo = (options) => {
  const name = 'chooseVideo'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    compressed,
    sourceType = ['album', 'camera'],
    maxDuration,
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
    errMsg?: string
  }>({ name, success, fail })

  return new Promise<Taro.chooseVideo.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.chooseVideo({
      sourceType: sourceType,
      maxDuration: maxDuration,
      camera: camera,
      compressed: compressed,
      success: (res: any) => {
        const result: Taro.chooseVideo.SuccessCallbackResult = {
          duration: res.duration,
          height: res.height,
          size: res.size,
          tempFilePath: res.tempFilePath,
          width: res.width,
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
