import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.mjs'
import '../dist/taro-components/taro-components.css'

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
let applied = false
if (!applied) {
  // 此文件只要 import 一次即可
  applyPolyfills().then(() => {
    defineCustomElements(window)
    applied = true
  })
}
