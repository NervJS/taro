import Taro from "@tarojs/taro"

export const onBeaconServiceChange: typeof Taro.onBeaconServiceChange = (callback) => {
  console.log('on beacon service change')
  // @ts-ignore
  const ret = native.onBeaconServiceChange(callback)
  return ret
}
