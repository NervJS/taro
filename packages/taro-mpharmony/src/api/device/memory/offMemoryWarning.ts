import Taro from '@tarojs/taro'

// null-implementation
export const offMemoryWarning: typeof Taro.offMemoryWarning = (callback) => {
  // @ts-ignore
  if (native[offMemoryWarning]) {
    // @ts-ignore
    native.offMemoryWarning(callback)
  }
}