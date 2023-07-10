import Taro from "@tarojs/taro"

export const onBluetoothAdapterStateChange: typeof Taro.onBluetoothAdapterStateChange = (callback) => {
  console.log('on bluetooth adapter state change')
  // @ts-ignore
  const ret = native.onBluetoothAdapterStateChange(callback)
  return ret
}
