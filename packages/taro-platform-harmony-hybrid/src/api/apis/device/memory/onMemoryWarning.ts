import Taro from '@tarojs/taro'

/**
 * 监听内存不足告警事件
 *
 * @canUse onMemoryWarning
 * @null_implementation
 */
export const onMemoryWarning: typeof Taro.onMemoryWarning = (_callback) => {
  // 支持使用，但实现为空实现，不用业务做兼容
}
