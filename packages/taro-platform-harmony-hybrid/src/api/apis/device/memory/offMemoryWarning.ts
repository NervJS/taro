import Taro from '@tarojs/taro'

/**
 * 取消监听内存不足告警事件
 *
 * @canUse offMemoryWarning
 * @null_implementation
 */
export const offMemoryWarning: typeof Taro.offMemoryWarning = (_callback) => {
  // 支持使用，但实现为空实现，不用业务做兼容
}
