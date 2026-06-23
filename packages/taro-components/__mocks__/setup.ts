/* eslint-disable no-useless-constructor, @typescript-eslint/no-unused-vars */
process.env.TARO_ENV = 'h5'
process.env.TARO_PLATFORM = 'web'
process.env.SUPPORT_TARO_POLYFILL = 'disabled'

// @ts-ignore
globalThis.MutationObserver = class {
  constructor (_callback) {}
  disconnect () {}
  observe (_element, _initObject) {}
}
