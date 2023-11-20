import { temporarilyNotSupport } from '../../utils'

/**
 * 收到 backgroundFetch 数据时的回调
 * 
 * @canNotUse onBackgroundFetchData
 */
export const onBackgroundFetchData = /* @__PURE__ */ temporarilyNotSupport('onBackgroundFetchData')

/**
 * 获取设置过的自定义登录态
 * 
 * @canNotUse getBackgroundFetchToken
 */
export const getBackgroundFetchToken = /* @__PURE__ */ temporarilyNotSupport('getBackgroundFetchToken')

export * from './getBackgroundFetchData'
export * from './setBackgroundFetchToken'
