import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.js'
import '../dist/taro-components/taro-components.css'

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

applyPolyfills().then(() => {
  defineCustomElements(window)
})
