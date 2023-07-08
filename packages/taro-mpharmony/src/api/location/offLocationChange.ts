import Taro from "@tarojs/taro"

export const offLocationChange: typeof Taro.offLocationChange = (callback) => {
  console.log('off location change')
  // @ts-ignore
  const ret = native.offLocationChange(callback)
  return ret
}