/**
 * 收到 backgroundFetch 数据时的回调
 * 
 * @canNotUse onBackgroundFetchData
 */
export { onBackgroundFetchData } from '@tarojs/taro-h5'

/**
 * 获取设置过的自定义登录态
 * 
 * @canNotUse getBackgroundFetchToken
 */
export * from './getBackgroundFetchData'
export * from './setBackgroundFetchToken'
export { getBackgroundFetchToken } from '@tarojs/taro-h5'
