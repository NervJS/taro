import Taro from '@tarojs/taro'

export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = (callback) => {
  // @ts-ignore
  const ret = native.offKeyboardHeightChange(callback)
  return ret
}
