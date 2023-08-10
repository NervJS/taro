import Taro from '@tarojs/taro'

export const onGyroscopeChange: typeof Taro.onGyroscopeChange = (callback) => {
  // @ts-ignore
  return native.onGyroscopeChange(callback)
}
