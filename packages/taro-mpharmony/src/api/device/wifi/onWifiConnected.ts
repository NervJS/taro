import Taro from '@tarojs/taro'

export const onWifiConnected: typeof Taro.onWifiConnected = (callback) => {
  // @ts-ignore
  const ret = native.onWifiConnected(callback)
  return ret
}
