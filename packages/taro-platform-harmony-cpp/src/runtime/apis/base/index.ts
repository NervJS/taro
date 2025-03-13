import { temporarilyNotSupport } from '../utils'

export * from './system'
export const canIUse = /* @__PURE__ */ temporarilyNotSupport('canIUse')
export const arrayBufferToBase64 = /* @__PURE__ */ temporarilyNotSupport('arrayBufferToBase64')
export const base64ToArrayBuffer = /* @__PURE__ */ temporarilyNotSupport('base64ToArrayBuffer')
export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/base/crypto'
export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/base/debug'
export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/base/performance'
export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/base/update'
export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/base/weapp/app-event'
export * from '@tarojs/plugin-platform-harmony-ets/dist/apis/base/weapp/life-cycle'
