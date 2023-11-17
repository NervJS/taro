import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'
import { taroCallbackMap } from 'src/utils/callbakMap'

/**
 * 取消用户主动截屏事件监听
 * 
 * @canUse offUserCaptureScreen
 */
export const offUserCaptureScreen: typeof Taro.offUserCaptureScreen = (callback) => {
  const name = 'offUserCaptureScreen'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  try {
    if (taroCallbackMap.has(callback)) {
      // @ts-ignore
      native.offUserCaptureScreen(taroCallbackMap.get(callback))
      taroCallbackMap.delete(callback)
    } else {
      console.error('Invalid callback.')
    }
  } catch (exception) {
    console.error(JSON.stringify(exception))
  }
}
