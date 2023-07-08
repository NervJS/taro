import Taro from "@tarojs/taro"

export const onLocationChangeError: typeof Taro.onLocationChangeError = (callback) => {
  console.log('on location change error')
  // @ts-ignore
  const ret = native.onLocationChangeError(callback)
  return ret
}
