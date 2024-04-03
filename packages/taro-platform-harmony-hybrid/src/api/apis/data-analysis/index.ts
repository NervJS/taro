/**
 * 自定义业务数据监控上报接口
 * 
 * @canNotUse reportMonitor
 */
export { reportMonitor } from '@tarojs/taro-h5'

/**
 * 事件上报
 * 
 * @canNotUse reportEvent
 */
export * from './getExptInfoSync'
export * from './reportAnalytics'
export { reportEvent } from '@tarojs/taro-h5'
