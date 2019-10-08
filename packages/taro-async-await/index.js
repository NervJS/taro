// support for async functions

if (process.env.TARO_ENV !== 'alipay') {
  const g = typeof window !== 'undefined' &&
  window.Math === Math ? window : typeof global === 'object' ? global : this

  if (!g.Promise) {
    g.Promise = require('promise-polyfill')
  }
  if (!g.regeneratorRuntime) {
    g.regeneratorRuntime = require('regenerator-runtime/runtime')
  }
} else {
  void 0
}
