import Taro from '@tarojs/api'
import { shouldBeFunction } from 'src/utils'
import { taroCallbackMap } from 'src/utils/callbakMap'

/**
 * 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
 * 
 * @canUse offCompassChange
 */
export const offCompassChange: typeof Taro.offCompassChange = (callback) => {
  const name = 'offCompassChange'
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
      native.offCompassChange(taroCallbackMap.get(callback))
      taroCallbackMap.delete(callback)
    } else {
      console.error('Invalid callback.')
    }
  } catch (exception) {
    console.error(JSON.stringify(exception))
  }
}
