import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 压缩图片接口，可选压缩质量
 * 
 * @canUse compressImage 
 * @__object [src, quality, compressedWidth, compressHeight] 
 * @__success [tempFilePath]
 */
export const compressImage: typeof Taro.compressImage = (options) => {
  const name = 'compressImage'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { src, quality, compressedWidth, compressHeight, success, fail, complete } = options as Exclude<
    typeof options,
  undefined
  >
  const handle = new MethodHandler<{
    tempFilePath?: string
    errMsg?: string
  }>({ name, success, fail, complete })

  // options.url must be String
  if (typeof src !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'src',
        correct: 'string',
        wrong: src,
      }),
    })
  }

  return new Promise<Taro.compressImage.SuccessCallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.compressImage({
      src: src,
      quality: quality,
      compressedWidth: compressedWidth,
      compressHeight: compressHeight,
      success: (res: any) => {
        const result: Taro.compressImage.SuccessCallbackResult = {
          tempFilePath: res.tempFilePath,
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
