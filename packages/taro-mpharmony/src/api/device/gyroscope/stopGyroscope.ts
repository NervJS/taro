import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 停止监听陀螺仪数据
 * 
 * @canUse stopGyroscope
 */
export const stopGyroscope: typeof Taro.stopGyroscope = (options) => {
  const name = 'stopGyroscope'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { success, fail, complete } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.stopGyroscope({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
