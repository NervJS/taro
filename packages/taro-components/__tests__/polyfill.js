import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.mjs'
import '../dist/taro-components/taro-components.css'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

// 此文件只要 import 一次即可
applyPolyfills().then(() => {
  defineCustomElements(window)
})
