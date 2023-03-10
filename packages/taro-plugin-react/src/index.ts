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

import { fs } from '@tarojs/helper'
import { isString } from '@tarojs/shared'

import { modifyH5WebpackChain } from './webpack.h5'
import { modifyMiniWebpackChain } from './webpack.mini'

import type { IPluginContext } from '@tarojs/service'
import type { Plugin } from 'esbuild'

export type Frameworks = 'react' | 'preact' | 'nerv'

export default (ctx: IPluginContext) => {
  const { framework } = ctx.initialConfig

  if (framework !== 'react' && framework !== 'nerv' && framework !== 'preact') return

  ctx.modifyWebpackChain(({ chain }) => {
    // 通用
    setAlias(framework, chain)
    chain
      .plugin('definePlugin')
      .tap(args => {
        const config = args[0]
        config.__TARO_FRAMEWORK__ = `"${framework}"`
        return args
      })

    if (process.env.TARO_ENV === 'h5') {
      // H5
      modifyH5WebpackChain(ctx, framework, chain)
    } else {
      // 小程序
      modifyMiniWebpackChain(ctx, framework, chain)
    }
  })

  ctx.modifyRunnerOpts(({ opts }) => {
    if (!opts?.compiler) return

    if (isString(opts.compiler)) {
      opts.compiler = {
        type: opts.compiler
      }
    }

    const { compiler } = opts
    if (compiler.type === 'webpack5') {
      // 提供给 webpack5 依赖预编译收集器的第三方依赖
      const deps = [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@tarojs/plugin-framework-react/dist/runtime'
      ]
      compiler.prebundle ||= {}
      const prebundleOptions = compiler.prebundle
      prebundleOptions.include ||= []
      prebundleOptions.include = prebundleOptions.include.concat(deps)
      prebundleOptions.exclude ||= []
      prebundleOptions.exclude.push(/mobx/) // 依赖会对 webpack 修改，默认排除
      if (prebundleOptions.enable === false) return

      const taroReactPlugin: Plugin = {
        name: 'taroReactPlugin',
        setup (build) {
          build.onLoad({ filter: /taro-h5[\\/]dist[\\/]api[\\/]taro/ }, ({ path }) => {
            const content = fs.readFileSync(path).toString()
            return {
              contents: require('./api-loader')(content)
            }
          })
        }
      }

      prebundleOptions.esbuild ||= {}
      const esbuildConfig = prebundleOptions.esbuild
      esbuildConfig.plugins ||= []
      esbuildConfig.plugins.push(taroReactPlugin)
    }
  })
}

function setAlias (framework: Frameworks, chain) {
  const alias = chain.resolve.alias

  switch (framework) {
    case 'preact':
      alias.set('react', 'preact/compat')
      alias.set('react-dom/test-utils', 'preact/test-utils')
      alias.set('react-dom', 'preact/compat')
      alias.set('react/jsx-runtime', 'preact/jsx-runtime')
      break
    case 'nerv':
      alias.set('react$', 'nervjs')
      alias.set('react-dom$', 'nervjs')
      break
  }
}
