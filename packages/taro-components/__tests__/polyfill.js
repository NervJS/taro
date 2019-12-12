import { applyPolyfills, defineCustomElements } from '../dist/loader'

// 此文件只要 import 一次即可
applyPolyfills().then(() => {
  defineCustomElements(window)
})
