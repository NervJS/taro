import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/api/apis/utils'
import { MethodHandler } from 'src/api/apis/utils/handler'

import nativeLocation from './NativeLocation'

/**
 * 开启小程序进入前后台时均接收位置消息
 *
 * @canUse startLocationUpdateBackground
 */
export const startLocationUpdateBackground: typeof Taro.startLocationUpdateBackground = (options) => {
  const name = 'startLocationUpdateBackground'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler<TaroGeneral.CallbackResult>({ name, success, fail, complete })
  nativeLocation.startLocationUpdateBackground({
    success: (res: any) => {
      handle.success(res)
    },
    fail: (res: any) => {
      handle.fail(res).catch((err) => {
        console.error(err)
      })
    },
  })
}
