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

import { mergeWith } from 'lodash'

import { getLoaderMeta} from './loader-meta'

import type { IPluginContext } from '@tarojs/service'
import type { Frameworks } from './index'

export function modifyH5WebpackChain (ctx: IPluginContext, framework: Frameworks, chain) {
  setLoader(framework, chain)
  setPlugin(ctx, framework, chain)

  chain.merge({
    module: {
      rule: {
        'process-import-taro': {
          test: /taro-h5[\\/]dist[\\/]api[\\/]taro/,
          loader: require.resolve('./api-loader')
        }
      }
    }
  })
}

function setLoader (framework: Frameworks, chain) {
  function customizer (object = '', sources = '') {
    if ([object, sources].every(e => typeof e === 'string')) return object + sources
  }
  chain.plugin('mainPlugin')
    .tap(args => {
      args[0].loaderMeta = mergeWith(
        getLoaderMeta(framework), args[0].loaderMeta, customizer
      )
      return args
    })
}

function setPlugin (ctx: IPluginContext, framework: Frameworks, chain) {
  const config = ctx.initialConfig
  const webpackConfig = chain.toConfig()
  const isProd = webpackConfig.mode === 'production'
  if (!isProd && config.h5?.devServer?.hot !== false) {
    // 默认开启 fast-refresh
    if (framework === 'react') {
      chain
        .plugin('fastRefreshPlugin')
        .use(require('@pmmmwh/react-refresh-webpack-plugin'))
    } else if (framework === 'preact') {
      chain
        .plugin('hotModuleReplacementPlugin')
        .use(require('webpack').HotModuleReplacementPlugin)
      chain
        .plugin('fastRefreshPlugin')
        .use(require('@prefresh/webpack'))
    }
  }
}
