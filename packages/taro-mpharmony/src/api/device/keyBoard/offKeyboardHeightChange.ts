import Taro from "@tarojs/taro"

export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = (callback) => {
  console.log('off keyboard height change')
  // @ts-ignore
  const ret = native.offKeyboardHeightChange(callback)
  return ret
}
