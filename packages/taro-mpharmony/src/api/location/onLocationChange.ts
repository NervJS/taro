import Taro from "@tarojs/taro"

export const onLocationChange: typeof Taro.onLocationChange = (callback) => {
  console.log('on location change')
  // @ts-ignore
  const ret = native.onLocationChange(callback)
  return ret
}
