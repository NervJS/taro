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

import { BaseConfig } from './BaseConfig'

import type { MiniBuildConfig } from '../utils/types'

export class MiniBaseConfig extends BaseConfig {
  defaultTerserOptions = {
    parse: {
      ecma: 8
    },
    compress: {
      ecma: 5,
      warnings: false,
      arrows: false,
      collapse_vars: false,
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      inline: false,
      loops: false,
      negate_iife: false,
      properties: false,
      reduce_funcs: false,
      reduce_vars: false,
      switches: false,
      toplevel: false,
      typeofs: false,
      booleans: true,
      if_return: true,
      sequences: true,
      unused: true,
      conditionals: true,
      dead_code: true,
      evaluate: true
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true
    }
  }

  constructor (appPath: string, config: Partial<MiniBuildConfig>) {
    super(appPath, config)
    this.chain.merge({
      resolve: {
        mainFields: ['browser', 'module', 'jsnext:main', 'main'],
        alias: {
          // 小程序使用 regenerator-runtime@0.11
          'regenerator-runtime': require.resolve('regenerator-runtime'),
          // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': require.resolve('@tarojs/runtime'),
          '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js')
        },
        // [Webpack 4] config.node: { fs: false, path: false }
        // [Webpack 5] config.resolve.fallback
        fallback: {
          fs: false,
          path: false
        }
      },
      optimization: {
        sideEffects: true
      },
      performance: {
        maxEntrypointSize: 2 * 1000 * 1000
      }
    })

    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
