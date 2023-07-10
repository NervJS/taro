import Taro from "@tarojs/taro"

export const onBLEConnectionStateChange: typeof Taro.onBLEConnectionStateChange = (callback) => {
  console.log('on BLE connection state change')
  // @ts-ignore
  const ret = native.onBLEConnectionStateChange(callback)
  return ret
}
