import Taro from '@tarojs/api'

import { shouldBeObject } from '../../../utils'
import { chooseMedia } from './chooseMedia'

/**
 * 拍摄视频或从手机相册中选视频。
 * @deprecated 请使用 chooseMedia 接口
 */
export const chooseVideo: typeof Taro.chooseVideo = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `chooseVideo:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    sourceType = ['album', 'camera'],
    // TODO 考虑通过 ffmpeg 支持压缩
    // compressed = true,
    maxDuration = 60,
    camera = 'back',
    success,
    fail,
    complete,
  } = options

  function parseRes (res: Taro.chooseMedia.SuccessCallbackResult): Taro.chooseVideo.SuccessCallbackResult {
    const { tempFiles = [], errMsg } = res
    const [video] = tempFiles
    return { ...video, errMsg }
  }

  return chooseMedia({
    mediaId: 'taroChooseVideo',
    sourceType,
    mediaType: ['video'],
    maxDuration,
    camera,
    success: (res) => {
      const param = parseRes(res)
      success?.(param)
      complete?.(param)
    },
    fail: (err) => {
      fail?.(err)
      complete?.(err)
    },
  }, 'chooseVideo').then(parseRes)
}
