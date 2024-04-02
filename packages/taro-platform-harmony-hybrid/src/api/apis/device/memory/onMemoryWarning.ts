import Taro from '@tarojs/taro'

/**
 * 监听内存不足告警事件
 * 
 * @canUse onMemoryWarning
 * @null_implementation
 */
export const onMemoryWarning: typeof Taro.onMemoryWarning = (callback) => {
  // @ts-ignore
  if (native[onMemoryWarning]) {
    // @ts-ignore
    native.onMemoryWarning((res: any) => {
      const ret: Taro.onMemoryWarning.CallbackResult = {
        level: res.level 
      }
      callback(ret)
    })
  }
}
