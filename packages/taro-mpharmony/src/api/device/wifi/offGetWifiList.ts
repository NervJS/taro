import Taro from "@tarojs/taro"

export const offGetWifiList: typeof Taro.offGetWifiList = (callback) => {
  // @ts-ignore
  const ret = native.offGetWifiList(callback)
  return ret
}
