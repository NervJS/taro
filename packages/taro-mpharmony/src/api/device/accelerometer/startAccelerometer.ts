import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 开始监听加速度数据。
 */
export const startAccelerometer: typeof Taro.startAccelerometer = (options) => {
  const name = 'startAccelerometer'

  return new Promise((resolve, reject) => {
    if (typeof options === 'undefined') {
      // @ts-ignore
      native.startAccelerometer({
        interval: 'normal',
        success: (res: any) => {
          resolve(res)
        },
        fail: (res: any) => {
          resolve(res)
        },
      })
      return
    }

    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return Promise.reject(res)
    }
    const { interval = 'normal', success, fail, complete } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      errMsg?: string
    }>({ name, success, fail, complete })

    // @ts-ignore
    native.startAccelerometer({
      interval: interval,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
