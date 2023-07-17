import Taro from '@tarojs/taro'

export const onWifiConnectedWithPartialInfo: typeof Taro.onWifiConnectedWithPartialInfo = (callback) => {
  // @ts-ignore
  const ret = native.onWifiConnectedWithPartialInfo(callback)
  return ret
}
