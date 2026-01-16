import Taro from '@tarojs/taro'

import { shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'
import nativeImage from './NativeImage'

/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 *
 * @canUse previewImage
 * @__object [urls, current, showmenu]
 */
export const previewImage: typeof Taro.previewImage = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `previewImage:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { urls = [], current, showmenu, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'previewImage', success, fail, complete })

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    nativeImage.previewImage({
      urls,
      current,
      showmenu,
      success: (res) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
