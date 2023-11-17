/**
 * @canUse navigateBack
 * @__object [delta]
 */

/**
 * @canUse navigateTo
 * @__object [url, events]
 */

/**
 * @canUse redirectTo
 * @object [url]
 */

/**
 * @canUse reLaunch
 * @__object [url]
 */

/**
 * @canUse switchTab
 * @__object [url]
 */

export { navigateBack, navigateTo, redirectTo, reLaunch, switchTab } from '@tarojs/router'

// FIXME 方法导出类型未对齐，后续修复

/**
 * 页面间事件通信通道
 * 
 * @canNotUse EventChannel
 */