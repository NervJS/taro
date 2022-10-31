import '../dist/taro-components/taro-components.css'

import { applyPolyfills, defineCustomElements } from '../loader/index.es2017.js'

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

global.ENABLE_INNER_HTML = true
global.ENABLE_ADJACENT_HTML = true
global.ENABLE_SIZE_APIS = true
global.ENABLE_TEMPLATE_CONTENT = true
global.ENABLE_MUTATION_OBSERVER = true
global.ENABLE_CLONE_NODE = true
global.ENABLE_CONTAINS = true

applyPolyfills().then(() => {
  defineCustomElements(window)
})
