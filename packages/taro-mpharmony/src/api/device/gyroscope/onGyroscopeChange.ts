import Taro from "@tarojs/taro"

export const onGyroscopeChange: typeof Taro.onGyroscopeChange = (callback) => {
  // @ts-ignore
  const ret = native.onGyroscopeChange(callback)
  return ret
}
