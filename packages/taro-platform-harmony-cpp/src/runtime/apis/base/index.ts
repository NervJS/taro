import { temporarilyNotSupport } from '../utils'

export const canIUse = /* @__PURE__ */ temporarilyNotSupport('canIUse')
export const arrayBufferToBase64 = /* @__PURE__ */ temporarilyNotSupport('arrayBufferToBase64')
export const base64ToArrayBuffer = /* @__PURE__ */ temporarilyNotSupport('base64ToArrayBuffer')

export * from './crypto'
export * from './debug'
export * from './performance'
export * from './system'
export * from './update'
export * from './weapp/app-event'
export * from './weapp/life-cycle'
