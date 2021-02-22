import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.mjs'
import '../dist/taro-components/taro-components.css'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

applyPolyfills().then(() => {
  defineCustomElements(window)
  applied = true
})
