/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { TaroPlatformWeb } from '@tarojs/service'

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

  get componentLibrary () {
    if (this.useHtmlComponents && this.framework === 'react') {
      return './runtime/components'
    } else {
      return `@tarojs/components/lib/${compLibraryAlias[this.framework] || 'react'}`
    }
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
      alias.set('@tarojs/router$', require.resolve('@tarojs/router'))
      alias.set('@tarojs/taro', require.resolve('./runtime/apis'))
      chain.plugin('mainPlugin')
        .tap(args => {
          args[0].loaderMeta ||= {
            extraImportForWeb: '',
            execBeforeCreateWebApp: ''
          }
          switch (this.framework) {
            case 'vue':
              args[0].loaderMeta.extraImportForWeb += `import { initVue2Components } from '@tarojs/components'\n`
              args[0].loaderMeta.execBeforeCreateWebApp += `initVue2Components()\n`
              break
            case 'vue3':
              args[0].loaderMeta.extraImportForWeb += `import { initVue3Components } from '@tarojs/components'\n`
              args[0].loaderMeta.execBeforeCreateWebApp += `initVue3Components(component)\n`
              break
            default:
              if (this.useHtmlComponents) {
                args[0].loaderMeta.extraImportForWeb += `import { PullDownRefresh } from '@tarojs/components'\n`
                args[0].loaderMeta.execBeforeCreateWebApp += `config.PullDownRefresh = PullDownRefresh\n`
              }
          }
          return args
        })
    })
  }
}
