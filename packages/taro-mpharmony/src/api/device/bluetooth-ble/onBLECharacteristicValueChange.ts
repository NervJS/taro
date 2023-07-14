import Taro from '@tarojs/taro'

export const onBLECharacteristicValueChange: typeof Taro.onBLECharacteristicValueChange = (callback) => {
  // @ts-ignore
  const ret = native.onBLECharacteristicValueChange(callback)
  return ret
}
