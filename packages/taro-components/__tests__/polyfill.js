import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.mjs'
import '../dist/taro-components/taro-components.css'

// 此文件只要 import 一次即可
applyPolyfills().then(() => {
  defineCustomElements(window)
})
