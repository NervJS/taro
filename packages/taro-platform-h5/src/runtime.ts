import '@tarojs/components/dist/taro-components/taro-components.css'

import { applyPolyfills, defineCustomElements } from './runtime-utils'

// FIXME useHtmlComponents 模式下不导入
applyPolyfills().then(function () {
  defineCustomElements(window)
})
