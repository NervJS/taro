import Taro from "@tarojs/taro"

export const onGetWifiList: typeof Taro.onGetWifiList = (callback) => {
  // @ts-ignore
  const ret = native.onGetWifiList(callback)
  return ret
}
