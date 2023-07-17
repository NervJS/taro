import Taro from '@tarojs/taro'

export const onBluetoothDeviceFound: typeof Taro.onBluetoothDeviceFound = (callback) => {
  // @ts-ignore
  const ret = native.openBluetoothAdapter(callback)
  return ret
}
