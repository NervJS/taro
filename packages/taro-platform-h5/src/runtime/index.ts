import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'

if (!USE_HTML_COMPONENTS) {
  require('@tarojs/components/dist/taro-components/taro-components.css')
  applyPolyfills().then(function () {
    defineCustomElements(window)
    // process.env.NODE_ENV === 'production' 提供 componentConfig.includes 配置，根据 collectComponents 收集使用的组件注册，放到 loader 中完成 (生产环境)
  })
}

export * from './components'
