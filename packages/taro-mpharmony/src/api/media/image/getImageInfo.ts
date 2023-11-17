import Taro from '@tarojs/api'

import { shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 从本地相册选择图片或使用相机拍照。
 * 
 * @canUse getImageInfo
 * @__object [src]
 * @__success 
 * [height, orientation[up, up-mirrored, down, down-mirrored, left-mirrored, right, right-mirrored, left],\ 
 * path, type, width]
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

  const { src, success, fail, complete } = options

  const handle = new MethodHandler<{
    height?: number
    orientation?: string
    path?: string
    type?: string
    width?: number
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise<Taro.getImageInfo.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.getImageInfo({
      src: src,
      success: (res: any) => {
        const result: Taro.getImageInfo.SuccessCallbackResult = {
          height: res.height,
          orientation: res.orientation,
          path: res.path,
          type: res.type,
          width: res.width,
          errMsg: res.errMsg,
        }
        handle.success(result, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
