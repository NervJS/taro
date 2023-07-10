import Taro from "@tarojs/taro"

export const onBLEConnectionStateChange: typeof Taro.onBLEConnectionStateChange = (callback) => {
  // @ts-ignore
  const ret = native.onBLEConnectionStateChange(callback)
  return ret
}
