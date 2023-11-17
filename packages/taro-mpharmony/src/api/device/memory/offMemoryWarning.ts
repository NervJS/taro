import Taro from '@tarojs/taro'

/**
 * 取消监听内存不足告警事件
 * 
 * @canUse offMemoryWarning
 * @null_implementation
 */
export const offMemoryWarning: typeof Taro.offMemoryWarning = (callback) => {
  // @ts-ignore
  if (native[offMemoryWarning]) {
    // @ts-ignore
    native.offMemoryWarning(callback)
  }
}