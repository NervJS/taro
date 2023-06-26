import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 从本地相册选择图片或使用相机拍照。
 */
export const chooseImage: typeof Taro.chooseImage = function (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `chooseImage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    count = 1,
    success,
    fail,
    complete,
    imageId = 'taroChooseImage',
    sourceType = ['album', 'camera']
  } = options
  const handle = new MethodHandler({ name: 'chooseImage', success, fail, complete })
  const res: Partial<Taro.chooseImage.SuccessCallbackResult> = {
    tempFilePaths: [],
    tempFiles: []
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

  let el = document.getElementById(imageId)
  if (!el) {
    const obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    obj.setAttribute('id', imageId)
    if (count > 1) {
      obj.setAttribute('multiple', 'multiple')
    }
    if (acceptableSourceType.indexOf(sourceTypeString) > -1) {
      obj.setAttribute('capture', sourceTypeString)
    }
    obj.setAttribute('accept', 'image/*')
    obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
    document.body.appendChild(obj)
    el = document.getElementById(imageId)
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
            res.tempFilePaths?.push(url)
            res.tempFiles?.push({ path: url, size: item.size, type: item.type, originalFileObj: item })
          })
          handle.success(res, { resolve, reject })
          target.value = ''
        }
      }
    }
  })
}
