import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 拍摄或从手机相册中选择图片或视频。
 */
export const chooseMedia: typeof Taro.chooseMedia = function (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `chooseMedia:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 9,
    mediaId = 'taroChooseMedia',
    // mediaType = ['image', 'video'],
    sourceType = ['album', 'camera'],
    // TODO 考虑通过 ffmpeg 支持压缩
    // sizeType = ['original', 'compressed'],
    // maxDuration = 10,
    // camera = 'back',
    success,
    fail,
    complete,
  } = options
  const handle = new MethodHandler({ name: 'chooseMedia', success, fail, complete })
  const res: Partial<Taro.chooseMedia.SuccessCallbackResult> = {
    tempFiles: [],
    type: ' mix',
  }
  const sourceTypeString = sourceType && sourceType.toString()
  const acceptableSourceType = ['user', 'environment', 'camera']

  if (count && typeof count !== 'number') {
    res.errMsg = getParameterError({
      para: 'count',
      correct: 'Number',
      wrong: count
    })
    return handle.fail(res)
  }

  let el = document.getElementById(mediaId)
  if (!el) {
    const obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    obj.setAttribute('id', mediaId)
    if (count > 1) {
      obj.setAttribute('multiple', 'multiple')
    }
    if (acceptableSourceType.indexOf(sourceTypeString) > -1) {
      obj.setAttribute('capture', sourceTypeString)
    }
    obj.setAttribute('accept', 'image/*')
    obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
    document.body.appendChild(obj)
    el = document.getElementById(mediaId)
  } else {
    if (count > 1) {
      el.setAttribute('multiple', 'multiple')
    } else {
      el.removeAttribute('multiple')
    }
    if (acceptableSourceType.indexOf(sourceTypeString) > -1) {
      el.setAttribute('capture', sourceTypeString)
    } else {
      el.removeAttribute('capture')
    }
  }

  return new Promise((resolve, reject) => {
    const TaroMouseEvents = document.createEvent('MouseEvents')
    TaroMouseEvents.initEvent('click', true, true)
    if (el) {
      el.dispatchEvent(TaroMouseEvents)
      el.onchange = function (e) {
        const target = e.target as HTMLInputElement
        if (target) {
          const files = target.files || []
          const arr = [...files]
          arr && arr.forEach(item => {
            const blob = new Blob([item], {
              type: item.type
            })
            const url = URL.createObjectURL(blob)
            res.tempFiles?.push({
              tempFilePath: url,
              size: item.size,
              duration: 0,
              height: 0,
              width: 0,
              thumbTempFilePath: '',
              fileType: item.type,
              originalFileObj: item
            })
          })
          handle.success(res, { resolve, reject })
          target.value = ''
        }
      }
    }
  })
}
