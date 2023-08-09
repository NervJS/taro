import Taro from '@tarojs/api'
import { shouldBeFunction } from 'src/utils'

/**
* 监听罗盘数据变化事件。频率：5 次/秒，接口调用后会自动开始监听，可使用 wx.stopCompass 停止监听。
*/
export const onCompassChange: typeof Taro.onCompassChange = callback => {
  const name = 'onKeyboardHeightChange'

  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }
  // @ts-ignore
  native.onCompassChange(callback)
}
