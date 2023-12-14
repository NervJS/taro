import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取视频详细信息
 * 
 * @canUse getVideoInfo 
 * @__object [src] 
 * @__success 
 * [orientation[up, down, left, right, up-mirrored, down-mirrored, left-mirrored, right-mirrored],\ 
 * type, duration, size, height, width, fps, bitrate]
 */
export const getVideoInfo: typeof Taro.getVideoInfo = (options) => {
  const name = 'getVideoInfo'
  const FPS_NUM = 30
  const BRI_NUM = 1000

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { src, success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler<{
    orientation?: any
    type?: string
    duration?: number
    size?: number
    height?: number
    width?: number
    fps?: number
    bitrate?: number
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

  return new Promise<Taro.getVideoInfo.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.getVideoInfo({
      src: src,
      success: (res: any) => {
        const result: Taro.getVideoInfo.SuccessCallbackResult = {
          orientation: res.orientation,
          type: res.type,
          duration: res.duration,
          size: res.size,
          height: res.height,
          width: res.width,
          fps: FPS_NUM,
          bitrate: BRI_NUM,
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
