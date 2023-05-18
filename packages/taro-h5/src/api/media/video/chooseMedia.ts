import Taro from '@tarojs/api'
import { getMobileDetect } from '@tarojs/router/dist/utils/navigate'

import { showActionSheet } from '../../../api/ui'
import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 拍摄或从手机相册中选择图片或视频。
 */
export const chooseMedia = async function (
  options: Taro.chooseMedia.Option,
  methodName = 'chooseMedia',
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
    el = document.createElement('input')
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
  const md = getMobileDetect()
  if (md.mobile()) {
    if (sourceType.length > 1 || sourceType.length < 1) {
      try {
        const { tapIndex } = await showActionSheet({
          itemList: ['拍摄', '从相册选择'],
        }, methodName)
        sourceType.splice(0, 1, tapIndex === 0 ? 'camera' : 'album')
      } catch (e) {
        return handle.fail({
          errMsg: e.errMsg?.replace('^.*:fail ', '')
        })
      }
    }
  }
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
  return new Promise<Taro.chooseMedia.SuccessCallbackResult>((resolve, reject) => {
    if (!el) return
    document.body.appendChild(el)
    el.onchange = async function (e) {
      const target = e.target as HTMLInputElement
      if (target) {
        const files = target.files || []
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
    el.onabort = () => handle.fail({ errMsg: 'abort' }, { resolve, reject })
    el.oncancel = () => handle.fail({ errMsg: 'cancel' }, { resolve, reject })
    el.onerror = e => handle.fail({ errMsg: e.toString() }, { resolve, reject })
    el.click()
  }).finally(() => {
    if (!el) return
    document.body.removeChild(el)
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

    if (/^video\//.test(res.fileType)) {
      // Video
      const video = document.createElement('video')
      const reader = new FileReader()
      video.crossOrigin = 'Anonymous'
      video.preload = 'metadata'
      video.src = res.tempFilePath

      return new Promise((resolve, reject) => {
        // 对齐旧版本实现
        reader.onload = (event) => {
          res.tempFilePath = event.target?.result as string
        }
        reader.onerror = e => reject(e)
        reader.readAsDataURL(res.originalFileObj)

        video.onloadedmetadata = () => {
          res.duration = video.duration
          res.height = video.videoHeight
          res.width = video.videoWidth
        }
        video.oncanplay = () => {
          res.thumbTempFilePath = getThumbTempFilePath(video, res.height, res.width, 0.8)
          resolve(res)
        }
        video.onerror = e => reject(e)
      })
    } else {
      // Image
      const img = new Image()
      /** 允许图片和 canvas 跨源使用
       * https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image
       */
      img.crossOrigin = 'Anonymous'
      img.src = res.tempFilePath

      return new Promise((resolve, reject) => {
        if (img.complete) {
          res.height = img.height
          res.width = img.width
          res.thumbTempFilePath = getThumbTempFilePath(img, res.height, res.width, 0.8)
          resolve(res)
        } else {
          img.onload = () => {
            res.height = img.height
            res.width = img.width
            res.thumbTempFilePath = getThumbTempFilePath(img, res.height, res.width, 0.8)
            resolve(res)
          }
          img.onerror = e => reject(e)
        }
      })
    }
  }

  function getThumbTempFilePath (el: CanvasImageSource, height = 0, width = height, quality = 0.8) {
    const max = 256
    const canvas = document.createElement('canvas')
    if (height > max || width > max) {
      const radio = height / width
      if (radio > 1) {
        height = max
        width = height / radio
      } else {
        width = max
        height = width * radio
      }
    }
    canvas.height = height
    canvas.width = width

    const ctx = canvas.getContext('2d')
    ctx?.drawImage(el, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', quality)
  }
}
