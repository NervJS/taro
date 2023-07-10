import Taro from "@tarojs/taro"

export const offWifiConnectedWithPartialInfo: typeof Taro.offWifiConnectedWithPartialInfo = (callback) => {
  console.log('off wifi connected with partial info')
  // @ts-ignore
  const ret = native.offWifiConnectedWithPartialInfo(callback)
  return ret
}
