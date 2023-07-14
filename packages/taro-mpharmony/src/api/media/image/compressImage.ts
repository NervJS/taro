import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const compressImage: typeof Taro.compressImage = (options) => {
  const name = 'compressImage'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { src,
      quality, 
      compressedWidth, 
      compressHeight, 
      success, 
      fail, 
      complete } = options as Exclude<typeof options, undefined>
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
          wrong: src
        })
      }, { resolve, reject })
    }
    // @ts-ignore
    const ret = native.compressImage({
      src: src,
      quality: quality,
      compressedWidth: compressedWidth,
      compressHeight: compressHeight,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        return handle.fail(err)
      }
    })
    return ret
  })
}