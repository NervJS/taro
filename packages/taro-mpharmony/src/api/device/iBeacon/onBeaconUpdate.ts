import Taro from "@tarojs/taro"

export const onBeaconUpdate: typeof Taro.onBeaconUpdate = (callback) => {
  console.log('on beacon update')
  // @ts-ignore
  const ret = native.onBeaconUpdate(callback)
  return ret
}
