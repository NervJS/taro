// import Taro from '@tarojs/api'

// import { shouldBeObject } from '../../../utils'
// import { MethodHandler } from '../../../utils/handler'

// /**
//  * 获取图片信息。网络图片需先配置download域名才能生效。
//  */
// export const getImageInfo: typeof Taro.getImageInfo = (options) => {
//   // options must be an Object
//   const isObject = shouldBeObject(options)
//   if (!isObject.flag) {
//     const res = { errMsg: `getImageInfo:fail ${isObject.msg}` }
//     console.error(res.errMsg)
//     return Promise.reject(res)
//   }

//   const getBase64Image = (image: HTMLImageElement) => {
//     try {
//       const canvas = document.createElement('canvas')
//       canvas.width = image.width
//       canvas.height = image.height
//       const ctx = canvas.getContext('2d')
//       ctx?.drawImage(image, 0, 0, image.width, image.height)
//       return canvas.toDataURL('image/png')
//     } catch (e) {
//       console.error('getImageInfo:get base64 fail', e)
//     }
//   }

//   const { src, success, fail, complete } = options
//   const handle = new MethodHandler({ name: 'getImageInfo', success, fail, complete })
//   return new Promise((resolve, reject) => {
//     const image = new Image()
//     image.crossOrigin = ''
//     image.onload = () => {
//       handle.success({
//         width: image.naturalWidth,
//         height: image.naturalHeight,
//         path: getBase64Image(image) || src
//       }, { resolve, reject })
//     }
//     image.onerror = (e: any) => {
//       handle.fail({
//         errMsg: e.message
//       }, { resolve, reject })
//     }
//     image.src = src
//   })
// }


import Taro from '@tarojs/api'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 从本地相册选择图片或使用相机拍照。
 */
export const getImageInfo: typeof Taro.getImageInfo = function (options) {
  const name = 'getImageInfo'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getImageInfo:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    src,
    success,
    fail,
    complete,
  } = options

  const handle = new MethodHandler<{
    height: 0
    orientation: "up"
    path: ''
    type: ''
    width: 0
    errMsg: ''
  }>({ name, success, fail, complete })

  console.log('get Image Info')
  // @ts-ignore
  const ret = native.getImageInfo({
    src: src,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}