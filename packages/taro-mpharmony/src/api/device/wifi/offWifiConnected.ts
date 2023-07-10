import Taro from "@tarojs/taro"

export const offWifiConnected: typeof Taro.offWifiConnected = (callback) => {
  // @ts-ignore
  const ret = native.offWifiConnected(callback)
  return ret
}
