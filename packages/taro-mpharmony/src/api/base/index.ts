import { fromByteArray, toByteArray } from 'base64-js'

import { temporarilyNotSupport } from '../../utils'

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
export function arrayBufferToBase64 (arrayBuffer: ArrayBuffer) {
  return fromByteArray(arrayBuffer as Uint8Array)
}

/**
 * 将ArrayBuffer数据转成Base64字符串
 * 
 * @canUse base64ToArrayBuffer
 */
export function base64ToArrayBuffer (base64: string) {
  return toByteArray(base64).buffer
}

/**
 * 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
 * 
 * @canNotUse getSkylineInfo
 */
export const getSkylineInfo = /* @__PURE__ */ temporarilyNotSupport('getSkylineInfo')

/**
 * 获取当前运行环境对于 Skyline 渲染引擎 的支持情况
 * 
 * @canNotUse getSkylineInfoSync
 */
export const getSkylineInfoSync = /* @__PURE__ */ temporarilyNotSupport('getSkylineInfoSync')

/**
 * 获取程序的 UserAgent
 * 
 * @canNotUse getRendererUserAgent
 */
export const getRendererUserAgent = /* @__PURE__ */ temporarilyNotSupport('getRendererUserAgent')

export * from './crypto'
export * from './debug/index'
export * from './performance'
export * from './system'
export * from './update/index'
export * from './weapp/app-event'
export * from './weapp/life-cycle'
