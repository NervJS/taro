import { TaroPlatformWeb } from '@tarojs/service'
import path from 'path'

import { resolveSync } from './utils'

import type { IPluginContext, TConfig } from '@tarojs/service'

const compLibraryAlias = {
  'vue': 'vue2',
  'vue3': 'vue3'
}

const PACKAGE_NAME = '@tarojs/plugin-platform-h5'
export default class H5 extends TaroPlatformWeb {
  platform = 'h5'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`

  constructor (ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close () {
        this.modifyWebpackConfig()
      }
    })
  }

  get framework () {
    return this.ctx.initialConfig.framework || 'react'
  }

  get useHtmlComponents () {
    return !!this.ctx.initialConfig.h5?.useHtmlComponents
  }

  get useDeprecatedAdapterComponent () {
    return !!this.ctx.initialConfig.h5?.useDeprecatedAdapterComponent
  }

  get componentLibrary () {
    if (this.useHtmlComponents && this.framework === 'react') {
      return './runtime/components'
    } else if (this.useDeprecatedAdapterComponent) {
      return `@tarojs/components/lib/component-lib/${compLibraryAlias[this.framework] || 'react'}`
    } else {
      return `@tarojs/components/lib/${compLibraryAlias[this.framework] || 'react'}`
    }
  }

  get componentAdapter () {
    return path.join(path.dirname(require.resolve('@tarojs/components')), '..', 'lib')
  }

  /**
   * 修改 Webpack 配置
   */
  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const rules = chain.module.rules
      const script = rules.get('script')
      const babelLoader = script.uses.get('babelLoader')
      babelLoader.set('options', {
        ...babelLoader.get('options'),
        plugins: [
          [require('babel-plugin-transform-taroapi'), {
            packageName: '@tarojs/taro',
            apis: require(resolveSync('./taroApis'))
          }]
        ]
      })

      const alias = chain.resolve.alias
      // TODO 考虑集成到 taroComponentsPath 中，与小程序端对齐
      alias.set('@tarojs/components$', require.resolve(this.componentLibrary))
      alias.set('@tarojs/components/lib', this.componentAdapter)
      alias.set('@tarojs/router$', require.resolve('@tarojs/router'))
      alias.set('@tarojs/taro', require.resolve('./runtime/apis'))
      chain.plugin('mainPlugin')
        .tap(args => {
          args[0].loaderMeta ||= {
            extraImportForWeb: '',
            execBeforeCreateWebApp: ''
          }

          // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
          if (this.useDeprecatedAdapterComponent) {
            args[0].loaderMeta.extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`
            args[0].loaderMeta.execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`
          }

          if (!this.useHtmlComponents) {
            args[0].loaderMeta.extraImportForWeb += `import { defineCustomElementTaroPullToRefresh } from '@tarojs/components/dist/components'\n`
            args[0].loaderMeta.execBeforeCreateWebApp += `defineCustomElementTaroPullToRefresh()\n`
          }

          switch (this.framework) {
            case 'vue':
              args[0].loaderMeta.extraImportForWeb += `import { initVue2Components } from '@tarojs/components/lib/vue2/components-loader'\nimport * as list from '@tarojs/components'\n`
              args[0].loaderMeta.execBeforeCreateWebApp += `initVue2Components(list)\n`
              break
            case 'vue3':
              args[0].loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`
              args[0].loaderMeta.execBeforeCreateWebApp += `initVue3Components(component, list)\n`
              break
            default:
              if (this.useHtmlComponents) {
                args[0].loaderMeta.extraImportForWeb += `import { PullDownRefresh } from '@tarojs/components'\n`
                args[0].loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`
              }
          }
          return args
        })

      // Note: 本地调试 stencil 组件库时，如果启用 sourceMap 则需要相关配置
      chain.module.rule('map')
        .test(/\.map$/).type('json')
    })
  }
}
