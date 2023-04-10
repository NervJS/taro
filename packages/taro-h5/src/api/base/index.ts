import { fromByteArray, toByteArray } from 'base64-js'

import { temporarilyNotSupport } from '../../utils'

export const env = {
  FRAMEWORK: process.env.FRAMEWORK,
  TARO_ENV: process.env.TARO_ENV,
  TARO_PLATFORM: process.env.TARO_PLATFORM,
  TARO_VERSION: process.env.TARO_VERSION,
}

export const canIUse = temporarilyNotSupport('canIUse')

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
