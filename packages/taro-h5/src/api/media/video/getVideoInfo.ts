import 'whatwg-fetch'

import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

export const getVideoInfo: typeof Taro.getVideoInfo = async function (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getVideoInfo:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const res: Partial<Taro.getVideoInfo.SuccessCallbackResult> = {
    orientation: 'up',
    type: '',
    duration: 0,
    size: 0,
    height: 0,
    width: 0,
    fps: 30,
    bitrate: 0,
  }
  const {
    src,
    success,
    fail,
    complete,
  } = options
  const handle = new MethodHandler({ name: 'getVideoInfo', success, fail, complete })

  if (typeof src !== 'string') {
    res.errMsg = getParameterError({
      para: 'src',
      correct: 'String',
      wrong: src
    })
    return handle.fail(res)
  }

  const video = document.createElement('video')
  video.crossOrigin = 'Anonymous'
  video.preload = 'metadata'
  video.src = src

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      res.duration = video.duration
      res.height = video.videoHeight
      res.width = video.videoWidth

      fetch(src)
        .then(async e => {
          const blob = await e.blob()
          res.type = blob.type
          res.size = blob.size
          res.bitrate = blob.size / video.duration

          handle.success(res, { resolve, reject })
        })
        .catch(e => {
          handle.fail({
            errMsg: e.toString()
          }, { resolve, reject })
        })
    }
  })
}
