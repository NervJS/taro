import Taro from "@tarojs/taro"

export const offMemoryWarning: typeof Taro.offMemoryWarning = (callback) => {
  // @ts-ignore
  const ret = native.offMemoryWarning(callback)
  return ret
}
