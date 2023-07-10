import Taro from "@tarojs/taro"

export const onBeaconServiceChange: typeof Taro.onBeaconServiceChange = (callback) => {
  // @ts-ignore
  const ret = native.onBeaconServiceChange(callback)
  return ret
}
