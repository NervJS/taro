import Taro from '@tarojs/api'
import { shouldBeFunction } from 'src/utils'
import { taroCallbackMap } from 'src/utils/callbakMap'

/**
 * 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 stopCompass 停止监听
 * 
 * @canUse onCompassChange
 * @__callback [accuracy, direction]
 */
export const onCompassChange: typeof Taro.onCompassChange = callback => {
  const name = 'onCompassChange'
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
        const result: Taro.onCompassChange.OnCompassChangeCallbackResult = {
          /** 精度 */
          accuracy: res.accuracy === 3 ? 'high' : 'unreliable',
          /** 面对的方向度数 */
          direction: res.direction
        }
        callback(result)
      }
      taroCallbackMap.set(callback, newCallback)
      // @ts-ignore
      native.onCompassChange(newCallback)
    }
  } catch (exception) {
    console.error(JSON.stringify(exception))
  }
}
