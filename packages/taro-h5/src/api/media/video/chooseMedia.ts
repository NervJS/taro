import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { REG_MEDIA } from '../../../utils/constants'
import { MethodHandler } from '../../../utils/handler'

/**
 * 拍摄或从手机相册中选择图片或视频。
 */
export const chooseMedia = function (
  options: Taro.chooseMedia.Option,
  methodName = chooseMedia.name,
): Promise<Taro.chooseMedia.SuccessCallbackResult> {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${methodName}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 9,
    mediaId = 'taroChooseMedia',
    mediaType = ['image', 'video'],
    sourceType = ['album', 'camera'],
    // sizeType = ['original', 'compressed'], // TODO 考虑通过 ffmpeg 支持压缩
    // maxDuration = 10, // TODO 考虑通过 ffmpeg 剪裁视频
    camera = 'back',
    success,
    fail,
    complete,
  } = options
  const handle = new MethodHandler({ name: methodName, success, fail, complete })
  const withImage = mediaType.length < 1 ||  mediaType.indexOf('image') > -1
  const withVideo = mediaType.length < 1 ||  mediaType.indexOf('video') > -1
  const res: Partial<Taro.chooseMedia.SuccessCallbackResult> = {
    tempFiles: [],
    type: withImage && withVideo ? 'mix' : withImage ? 'image' : 'video',
  }

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
    el = document.createElement(mediaId)
    el.setAttribute('type', 'file')
    el.setAttribute('id', mediaId)
    el.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
  }

  if (count > 1) {
    el.setAttribute('multiple', 'multiple')
  } else {
    el.removeAttribute('multiple')
  }

  // Note: Input 仅在移动端支持 capture 属性，可以使用 getUserMedia 替代（暂不考虑）
  // FIXME sourceType 有多个值时，判断在移动端，提示用户选择【拍摄、从相册选择】
  if (sourceType.includes('camera')) {
    el.setAttribute('capture', camera === 'front' ? 'user' : 'environment')
  } else {
    el.removeAttribute('capture')
  }

  if (res.type === 'image') {
    el.setAttribute('accept', 'image/*')
  } else if (res.type === 'video') {
    el.setAttribute('accept', 'video/*')
  } else {
    el.setAttribute('accept', 'image/*, video/*')
  }
  document.body.appendChild(el)

  return new Promise<Taro.chooseMedia.SuccessCallbackResult>((resolve, reject) => {
    const TaroMouseEvents = document.createEvent('MouseEvents')
    TaroMouseEvents.initEvent('click', true, true)
    if (el) {
      el.dispatchEvent(TaroMouseEvents)
      el.onchange = async function (e) {
        const target = e.target as HTMLInputElement
        if (target) {
          const files = target.files || [] // name webkitRelativePath type
          const arr = [...files]
          await Promise.all(
            arr.map(async item => {
              try {
                res.tempFiles?.push(await loadMedia(item))
              } catch (error) {
                console.error(error)
              }
            })
          )
        }
        handle.success(res, { resolve, reject })
        target.value = ''
      }
    }
  }).finally(() => {
    el && document.body.removeChild(el)
  })

  function loadMedia (file: File): Promise<Taro.chooseMedia.ChooseMedia> {
    const dataUrl = URL.createObjectURL(file)
    const res = {
      tempFilePath: dataUrl,
      size: file.size,
      duration: 0,
      height: 0,
      width: 0,
      thumbTempFilePath: '',
      fileType: file.type,
      originalFileObj: file
    }

    if (REG_MEDIA.test(res.fileType)) {
      // Video
      const reader = new FileReader()
      const vEl = document.createElement('video')
      vEl.preload = 'metadata'
      vEl.src = res.tempFilePath

      return new Promise((resolve, reject) => {
        reader.onload = function () {
          vEl.onloadedmetadata = () => {
            res.duration = vEl.duration
            res.height = vEl.height
            res.width = vEl.width
            resolve(res)
          }
        }
        reader.onerror = e => reject(e)
        reader.readAsDataURL(res.originalFileObj)
      })
    } else {
      // Image
      const img = new Image()
      img.src = res.tempFilePath

      return new Promise((resolve, reject) => {
        if (img.complete) {
          res.height = img.height
          res.width = img.width
          resolve(res)
        } else {
          img.onload = () => {
            res.height = img.height
            res.width = img.width
            resolve(res)
          }
          img.onerror = e => reject(e)
        }
      })
    }
  }
}
