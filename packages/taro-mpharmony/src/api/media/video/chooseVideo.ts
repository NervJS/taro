import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const chooseVideo: typeof Taro.chooseVideo = (options) => {
  const name = 'chooseVideo'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    compressed,
    sourceType = ['album', 'camera'],
    maxDuration,
    camera = ['back', 'front'],
    success,
    fail,
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    tempFilePath?: string
    duration?: number
    size?: number
    height?: number
    width?: number
    errMsg?: string
  }>({ name, success, fail })

  // @ts-ignore
  const ret = native.chooseVideo({
    sourceType: sourceType,
    maxDuration: maxDuration,
    camera: camera,
    compressed: compressed,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    },
  })
  return ret
}
