import { temporarilyNotSupport } from '../../utils'

/**
 * 自定义业务数据监控上报接口
 * 
 * @canNotUse reportMonitor
 */
export const reportMonitor = /* @__PURE__ */ temporarilyNotSupport('reportMonitor')

/**
 * 事件上报
 * 
 * @canNotUse reportEvent
 */
export const reportEvent = /* @__PURE__ */ temporarilyNotSupport('reportEvent')

export * from './getExptInfoSync'
export * from './reportAnalytics'
