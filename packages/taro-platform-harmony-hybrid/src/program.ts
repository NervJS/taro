import { TaroPlatformWeb } from '@tarojs/service'
import path from 'path'

import { resolveSync } from './resolve'

import type { IPluginContext, TConfig } from '@tarojs/service'

const compLibraryAlias = {
  vue3: 'vue3',
}

const PACKAGE_NAME = '@tarojs/plugin-platform-harmony-hybrid'
export default class H5 extends TaroPlatformWeb {
  platform = 'harmony-hybrid'
  runtimePath = `${PACKAGE_NAME}/dist/runtime`

  constructor (ctx: IPluginContext, config: TConfig) {
    super(ctx, config)
    this.setupTransaction.addWrapper({
      close () {
        this.modifyWebpackConfig()
      },
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

  get apiLibrary () {
    return require.resolve('./runtime/apis')
  }

  get aliasFramework (): string {
    return compLibraryAlias[this.framework] || 'react'
  }

  get componentLibrary () {
    if (this.useHtmlComponents && this.aliasFramework === 'react') {
      return require.resolve('./runtime/components')
    } else if (this.useDeprecatedAdapterComponent) {
      return require.resolve(`@tarojs/components/lib/${this.aliasFramework}/component-lib`)
    } else {
      return require.resolve(`@tarojs/plugin-platform-harmony-hybrid/dist/components/${this.aliasFramework}`)
    }
  }

  get componentAdapter () {
    return path.join(path.dirname(require.resolve('@tarojs/components')), '..', 'lib')
  }

  get routerLibrary () {
    return require.resolve('@tarojs/router')
  }

  get libraryDefinition () {
    return resolveSync('./definition.json')
  }

  /**
   * 修改 Webpack 配置
   */
  modifyWebpackConfig () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const rules = chain.module.rules
      const script = rules.get('script')
      const babelLoader = script.uses.get('babelLoader')
      const routerApis = new Set(['navigateTo', 'navigateBack', 'redirectTo', 'reLaunch', 'switchTab'])
      let apis = require(resolveSync('./taroApis'))
      apis = new Set(Array.from(apis).filter((x: string) => !routerApis.has(x)))
      babelLoader.set('options', {
        ...babelLoader.get('options'),
        plugins: [
          [
            require('babel-plugin-transform-taroapi'),
            {
              packageName: '@tarojs/taro',
              apis,
              definition: require(this.libraryDefinition),
            },
          ],
        ],
      })

      const alias = chain.resolve.alias
      // TODO 考虑集成到 taroComponentsPath 中，与小程序端对齐
      alias.set('@tarojs/components$', this.componentLibrary)
      alias.set('@tarojs/components/lib', this.componentAdapter)
      alias.set('@tarojs/router$', this.routerLibrary)
      alias.set('@tarojs/taro', this.apiLibrary)
      chain.plugin('mainPlugin').tap((args) => {
        args[0].loaderMeta ||= {
          extraImportForWeb: '',
          execBeforeCreateWebApp: '',
        }

        // Note: 旧版本适配器不会自动注册 Web Components 组件，需要加载 defineCustomElements 脚本自动注册使用的组件
        if (this.useDeprecatedAdapterComponent) {
          args[0].loaderMeta.extraImportForWeb += `import { applyPolyfills, defineCustomElements } from '@tarojs/components/loader'\n`
          args[0].loaderMeta.execBeforeCreateWebApp += `applyPolyfills().then(() => defineCustomElements(window))\n`
        }

        if (!this.useHtmlComponents) {
          args[0].loaderMeta.extraImportForWeb += `import { defineCustomElementTaroPullToRefreshCore } from '@tarojs/components/dist/components'\n`
          args[0].loaderMeta.execBeforeCreateWebApp += `defineCustomElementTaroPullToRefreshCore()\n`
        }

        switch (this.framework) {
          case 'vue3':
            args[0].loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components/lib/vue3/components-loader'\nimport * as list from '@tarojs/components'\n`
            args[0].loaderMeta.execBeforeCreateWebApp += `initVue3Components(component, list)\n`
            break
          default:
            if (this.useHtmlComponents) {
              args[0].loaderMeta.extraImportForWeb += `import '${require.resolve(
                '@tarojs/components-react/dist/index.css'
              )}'\nimport { PullDownRefresh } from '@tarojs/components'\n`
              args[0].loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`
            }
        }
        return args
      })

      // 修改htmlWebpackPlugin插件的script脚本
      chain.plugin('htmlWebpackPlugin').tap((args) => {
        const options = this.config?.postcss?.pxtransform?.config || {}
        // const max = options?.maxRootSize ?? 40
        // const min = options?.minRootSize ?? 20
        const baseFontSize = options?.baseFontSize || 20// (min > 1 ? min : 20)
        const designWidth = (input => typeof this.config.designWidth === 'function'
          ? this.config.designWidth(input)
          : this.config.designWidth)(baseFontSize)
        const rootValue = baseFontSize / this.config.deviceRatio![designWidth!] * 2
        let htmlScript = ''
        if ((this.config?.targetUnit ?? 'rem') === 'rem') {
          /**
           * 缩放策略为：
           * 1. 手机-竖屏，缩放策略为“自动缩放”
           * 2. 折叠屏、Pad竖屏，缩放策略为“依据设计尺寸，大小不变”
           * 3. Pad(模屏)、2in1(默认)，缩放策略为“依据设计尺寸，大小不变”
           * 4. 2in1（全屏），缩放策略为“依据设计尺寸，大小不变”
           */
          htmlScript = `!function(n){function f(){var e=n.document.documentElement;var w=Math.floor(e.getBoundingClientRect().width);if(w<600){var x=${rootValue}*w/${designWidth};e.style.fontSize=x+"px"}else if(w<840){w=${designWidth}/2;var x=${rootValue}*w/${designWidth};e.style.fontSize=x+"px"}else if(w<1440){w=${designWidth}/2;var x=${rootValue}*w/${designWidth};e.style.fontSize=x+"px"}else{w=${designWidth}/2;var x=${rootValue}*w/${designWidth};e.style.fontSize=x+"px"}}n.addEventListener("resize",(function(){f()}));f()}(window);`
        }
        args[0].script = htmlScript
        return args
      })

      // 修改h5平台的rule的正则表达式
      chain.module
        .rule('process-import-taro-h5')
        .test(/(plugin|taro)-platform-harmony-hybrid[\\/]dist[\\/]api[\\/]apis[\\/]taro/)

      // Note: 本地调试 stencil 组件库时，如果启用 sourceMap 则需要相关配置
      chain.module
        .rule('map')
        .test(/\.map$/)
        .type('json')
    })
  }
}
