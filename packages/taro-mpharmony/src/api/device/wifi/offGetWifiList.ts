import Taro from "@tarojs/taro"

export const offGetWifiList: typeof Taro.offGetWifiList = (callback) => {
  console.log('off get wifi list')
  // @ts-ignore
  const ret = native.offGetWifiList(callback)
  return ret
}
