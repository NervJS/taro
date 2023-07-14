import Taro from '@tarojs/taro'

export const onMemoryWarning: typeof Taro.onMemoryWarning = (callback) => {
  // @ts-ignore
  const ret = native.onMemoryWarning(callback)
  return ret
}
