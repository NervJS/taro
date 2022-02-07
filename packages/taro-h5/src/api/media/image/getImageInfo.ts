import Taro from '@tarojs/api'

import { shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 获取图片信息。网络图片需先配置download域名才能生效。
 */
export const getImageInfo: typeof Taro.getImageInfo = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `getImageInfo:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { src, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getImageInfo', success, fail, complete })
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      handle.success({
        width: image.naturalWidth,
        height: image.naturalHeight
      }, resolve)
    }
    image.onerror = (e: any) => {
      handle.fail({
        errMsg: e.message
      }, reject)
    }
    image.src = src
  })
}
