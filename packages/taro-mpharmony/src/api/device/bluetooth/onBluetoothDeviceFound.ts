import Taro from "@tarojs/taro"

export const onBluetoothDeviceFound: typeof Taro.onBluetoothDeviceFound = (callback) => {
  console.log('on bluetooth device found')
  // @ts-ignore
  const ret = native.openBluetoothAdapter(callback)
  return ret
}
