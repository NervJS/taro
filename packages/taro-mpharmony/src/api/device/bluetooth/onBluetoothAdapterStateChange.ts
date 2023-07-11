import Taro from "@tarojs/taro"

export const onBluetoothAdapterStateChange: typeof Taro.onBluetoothAdapterStateChange = (callback) => {
  // @ts-ignore
  const ret = native.onBluetoothAdapterStateChange(callback)
  return ret
}
