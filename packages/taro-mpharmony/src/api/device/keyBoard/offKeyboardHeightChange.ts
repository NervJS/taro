import Taro from '@tarojs/taro'
import { shouldBeFunction } from 'src/utils'

export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = (callback) => {
  const name = 'offKeyboardHeightChange'
  const isValid = shouldBeFunction(callback).flag || typeof callback === 'undefined'
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return
  }

  // @ts-ignore
  native.offKeyboardHeightChange(callback)
}
