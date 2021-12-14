import { fromByteArray, toByteArray } from 'base64-js'

import { temporarilyNotSupport } from '../utils'

// TODO env 环境变量

export const canIUse = temporarilyNotSupport('canIUse')

export function arrayBufferToBase64 (arrayBuffer) {
  return fromByteArray(arrayBuffer)
}

export function base64ToArrayBuffer (base64) {
  return toByteArray(base64)
}

export * from './system'
export * from './update'
export * from './weapp/life-cycle'
export * from './weapp/app-event'
export * from './debug'
export * from './performance'
export * from './crypto'
