import { fromByteArray, toByteArray } from 'base64-js'

export const env = {
  FRAMEWORK: process.env.FRAMEWORK,
  TARO_ENV: process.env.TARO_ENV,
  TARO_PLATFORM: process.env.TARO_PLATFORM,
  TARO_VERSION: process.env.TARO_VERSION,
}

export function canIUse (schema: string) {
  // TODO：根据 schema 生成支持情况 or 在插件内注入该方法
  return !!schema
}

export function arrayBufferToBase64 (arrayBuffer: ArrayBuffer) {
  return fromByteArray(arrayBuffer as Uint8Array)
}

export function base64ToArrayBuffer (base64: string) {
  return toByteArray(base64)
}

export * from './crypto'
export * from './debug'
export * from './performance'
export * from './system'
export * from './update'
export * from './weapp/app-event'
export * from './weapp/life-cycle'
