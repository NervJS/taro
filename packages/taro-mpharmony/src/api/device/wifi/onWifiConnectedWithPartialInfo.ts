import Taro from "@tarojs/taro"

export const onWifiConnectedWithPartialInfo: typeof Taro.onWifiConnectedWithPartialInfo = (callback) => {
  console.log('on wifi connected with partial info')
  // @ts-ignore
  const ret = native.onWifiConnectedWithPartialInfo(callback)
  return ret
}
