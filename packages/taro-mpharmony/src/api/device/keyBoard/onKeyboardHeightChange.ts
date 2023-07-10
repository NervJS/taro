import Taro from "@tarojs/taro"

export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = (callback) => {
  console.log('on keyboard height change')
  // @ts-ignore
  const ret = native.onKeyboardHeightChange(callback)
  return ret
}
