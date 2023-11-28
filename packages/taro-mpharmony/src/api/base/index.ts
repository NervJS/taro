/**
 * 环境变量
 * 
 * @canUse env
 * @__variable [FRAMEWORK, TARO_ENV, USER_DATA_PATH]
 */
export const env = {
  FRAMEWORK: process.env.FRAMEWORK,
  TARO_ENV: process.env.TARO_ENV,
  TARO_PLATFORM: process.env.TARO_PLATFORM,
  TARO_VERSION: process.env.TARO_VERSION,
  USER_DATA_PATH: 'internal://files',
}

/**
 * 将Base64字符串转成ArrayBuffer数据
 * 
 * @canUse arrayBufferToBase64
 */
export { arrayBufferToBase64 } from '@tarojs/taro-h5'

/**
 * 将ArrayBuffer数据转成Base64字符串
 * 
 * @canUse base64ToArrayBuffer
 */
export { base64ToArrayBuffer } from '@tarojs/taro-h5'

/**
 * 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
 * 
 * @canNotUse getSkylineInfo
 */
export { getSkylineInfo } from '@tarojs/taro-h5'

/**
 * 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
 * 
 * @canNotUse getSkylineInfoSync
 */
export { getSkylineInfoSync } from '@tarojs/taro-h5'

/**
 * 获取程序的 UserAgent
 * 
 * @canNotUse getRendererUserAgent
 */
export * from './crypto'
export * from './debug/index'
export * from './performance'
export * from './system'
export * from './update/index'
export * from './weapp/app-event'
export * from './weapp/life-cycle'
export { getRendererUserAgent } from '@tarojs/taro-h5'
