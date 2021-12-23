import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'
import { shouldBeObject, getParameterError } from '../../utils'

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

  const { count = 1, success, fail, complete, imageId = 'taroChooseImage' } = options
  const handle = new MethodHandler({ name: 'chooseImage', success, fail, complete })
  const res: Partial<Taro.chooseImage.SuccessCallbackResult> = {
    tempFilePaths: [],
    tempFiles: []
  }

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
  }

  return new Promise(resolve => {
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
          handle.success(res, resolve)
          target.value = ''
        }
      }
    }
  })
}
