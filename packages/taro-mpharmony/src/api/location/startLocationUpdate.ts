import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 开启小程序进入前台时接收位置消息
 * 
 * @canUse startLocationUpdate
 */
export const startLocationUpdate: typeof Taro.startLocationUpdate = (options) => {
  const name = 'startLocationUpdate'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler<TaroGeneral.CallbackResult>({ name, success, fail, complete })
  // @ts-ignore
  native.startLocationUpdate({
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
