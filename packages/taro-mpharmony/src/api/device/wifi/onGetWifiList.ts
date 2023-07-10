import Taro from "@tarojs/taro"

export const onGetWifiList: typeof Taro.onGetWifiList = (callback) => {
  console.log('on get wifi list')
  // @ts-ignore
  const ret = native.onGetWifiList(callback)
  return ret
}
