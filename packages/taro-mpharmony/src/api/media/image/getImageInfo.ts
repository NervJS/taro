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