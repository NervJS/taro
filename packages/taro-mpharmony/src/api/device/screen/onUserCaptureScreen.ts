import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'
import { taroCallbackMap } from 'src/utils/callbakMap'

/**
 * 监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件
 * 
 * @canUse onUserCaptureScreen
 */
export const onUserCaptureScreen: typeof Taro.onUserCaptureScreen = (callback) => {
  const name = 'onUserCaptureScreen'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  
  try {
    if (!taroCallbackMap.has(callback)) {
      // eslint-disable-next-line no-inner-declarations
      function newCallback (res: any) {
        const result: TaroGeneral.CallbackResult = {
          errMsg: res === 'ohos not support path' ? `${name}:ok` : JSON.stringify(res)
        }
        callback(result)
      }
      taroCallbackMap.set(callback, newCallback)
      // @ts-ignore
      native.onUserCaptureScreen(newCallback)
    }
  } catch (exception) {
    console.error(JSON.stringify(exception))
  }
}
