import '@tarojs/components/dist/taro-components/taro-components.css'

import { applyPolyfills } from '@tarojs/components/loader'

applyPolyfills().then(function () {
  if (USE_HTML_COMPONENTS) {
    // @ts-ignore
    import('./components').then(({ defineCustomElements }) => {
      defineCustomElements()
    })
  } else {
    import('@tarojs/components/loader').then(({ defineCustomElements }) => {
      defineCustomElements(window)
    })
  }
  // TODO 提供 componentConfig.includes 配置，根据 collectComponents 收集使用的组件注册，放到 loader 中完成
})

export * from './components'
