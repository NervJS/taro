import Taro from "@tarojs/taro"

export const onWifiConnected: typeof Taro.onWifiConnected = (callback) => {
  console.log('on wifi connected')
  // @ts-ignore
  const ret = native.onWifiConnected(callback)
  return ret
}
