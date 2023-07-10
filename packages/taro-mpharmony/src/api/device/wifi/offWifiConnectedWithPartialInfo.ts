import Taro from "@tarojs/taro"

export const offWifiConnectedWithPartialInfo: typeof Taro.offWifiConnectedWithPartialInfo = (callback) => {
  // @ts-ignore
  const ret = native.offWifiConnectedWithPartialInfo(callback)
  return ret
}
