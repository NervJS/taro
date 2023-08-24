import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = (callback) => {
  const name = 'onKeyboardHeightChange'
  // callback must be an Function
  const isFunction = shouldBeFunction(callback)
  if (!isFunction.flag) {
    const res = { errMsg: `${name}:fail ${isFunction.msg}` }
    console.error(res.errMsg)
    return
  }

  if (!callback.name) {
    Object.defineProperty(callback, 'name', { value: `${name}` })
  }
  // @ts-ignore
  native.onKeyboardHeightChange(callback)
}
