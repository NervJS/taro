import Taro from '@tarojs/taro'

export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = (callback) => {
  // @ts-ignore
  const ret = native.onKeyboardHeightChange(callback)
  return ret
}
