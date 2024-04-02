import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 关闭监听实时位置变化，前后台都停止消息接收
 * 
 * @canUse stopLocationUpdate
 */
export const stopLocationUpdate: typeof Taro.stopLocationUpdate = (options) => {
  const name = 'stopLocationUpdate'
  const isValid = shouldBeObject(options).flag || typeof options === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return
  }
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler<TaroGeneral.CallbackResult>({ name, success, fail, complete })
  // @ts-ignore
  native.stopLocationUpdate({
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
