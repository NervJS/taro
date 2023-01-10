import '@tarojs/components/dist/taro-components/taro-components.css'

import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'

if (USE_HTML_COMPONENTS) {
  // 验证 includeDefineCustomElements 和 autoDefineCustomElements 与 react 结合方案
  // FIXME useHtmlComponents 模式下需逐个注册不包含的组件
  // 根据 collectComponents 收集使用的组件注册，放到 loader 中完成
  applyPolyfills().then(function () {
    defineCustomElements(window)
  })
} else {
  applyPolyfills().then(function () {
    defineCustomElements(window)
  })
}

export * from './components'
