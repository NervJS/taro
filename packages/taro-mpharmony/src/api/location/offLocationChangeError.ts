import Taro from "@tarojs/taro"

export const offLocationChangeError: typeof Taro.offLocationChangeError = (callback) => {
  console.log('off location change error')
  // @ts-ignore
  const ret = native.offLocationChangeError(callback)
  return ret
}
