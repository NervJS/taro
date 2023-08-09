import Taro from '@tarojs/api'
import { shouldBeFunction } from 'src/utils'

/**
 * 取消监听罗盘数据变化事件，参数为空，则取消所有的事件监听。
 */
export const offCompassChange: typeof Taro.offCompassChange = callback => {
  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  // @ts-ignore
  native.offCompassChange(callback)
}