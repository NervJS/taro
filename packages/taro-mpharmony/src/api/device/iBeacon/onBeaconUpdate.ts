import Taro from "@tarojs/taro"

export const onBeaconUpdate: typeof Taro.onBeaconUpdate = (callback) => {
  // @ts-ignore
  const ret = native.onBeaconUpdate(callback)
  return ret
}
