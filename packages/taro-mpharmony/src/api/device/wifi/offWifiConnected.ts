import Taro from "@tarojs/taro"

export const offWifiConnected: typeof Taro.offWifiConnected = (callback) => {
  console.log('off wifi connected')
  // @ts-ignore
  const ret = native.offWifiConnected(callback)
  return ret
}
