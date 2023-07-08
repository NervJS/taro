import Taro from "@tarojs/taro"

export const onBLECharacteristicValueChange: typeof Taro.onBLECharacteristicValueChange = (callback) => {
  console.log('on BLE characteristic value change')
  // @ts-ignore
  const ret = native.onBLECharacteristicValueChange(callback)
  return ret
}
