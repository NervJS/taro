import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 开始监听加速度数据。
 * 
 * @canUse startAccelerometer
 * @__object [interval[game, ui, normal]]
 */
export const startAccelerometer: typeof Taro.startAccelerometer = (options) => {
  const name = 'startAccelerometer'

  return new Promise((resolve, reject) => {
    const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
    if (!isValid) {
      const res = { errMsg: `${name}:fail invalid params` }
      console.error(res.errMsg)
      return reject(res)
    }
    const {
      interval = 'normal',
      success,
      fail,
      complete
    } = options || {}
    const handle = new MethodHandler({ name, success, fail, complete })

    // @ts-ignore
    native.startAccelerometer({
      interval: interval,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      }
    })
  })
}
