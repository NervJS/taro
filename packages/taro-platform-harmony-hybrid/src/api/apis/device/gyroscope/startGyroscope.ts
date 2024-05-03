import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/api/apis/utils'
import { MethodHandler } from 'src/api/apis/utils/handler'

import native from '../../NativeApi'

/**
 * 开始监听陀螺仪数据
 *
 * @canUse startGyroscope
 * @__object [interval[game, ui, normal]]
 */
export const startGyroscope: typeof Taro.startGyroscope = (options) => {
  const name = 'startGyroscope'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const { interval, success, fail, complete } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.startGyroscope({
      interval: interval,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
