import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.mjs'

// 此文件只要 import 一次即可
applyPolyfills().then(() => {
  defineCustomElements(window)
})
