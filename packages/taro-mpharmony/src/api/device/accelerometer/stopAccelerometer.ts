import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 停止监听加速度数据。
 */
export const stopAccelerometer: typeof Taro.stopAccelerometer = (options) => {
  const name = 'stopAccelerometer'

  return new Promise((resolve, reject) => {
    if (typeof options === 'undefined') {
      // @ts-ignore
      native.stopAccelerometer({
        success: (res: any) => {
          resolve(res)
        },
        fail: (res: any) => {
          resolve(res)
        }
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
    const {
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler<{
      errMsg?: string
    }>({ name, success, fail, complete })


    // @ts-ignore
    native.stopAccelerometer({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      }
    })
  })
}
