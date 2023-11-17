import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 停止监听加速度数据。
 * 
 * @canUse stopAccelerometer
 */
export const stopAccelerometer: typeof Taro.stopAccelerometer = (options) => {
  const name = 'stopAccelerometer'

  return new Promise((resolve, reject) => {
    const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
    if (!isValid) {
      const res = { errMsg: `${name}:fail invalid params` }
      console.error(res.errMsg)
      return reject(res)
    }
    const { success, fail, complete } = options || {}
    const handle = new MethodHandler({ name, success, fail, complete })

    // @ts-ignore
    native.stopAccelerometer({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
