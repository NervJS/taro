/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import * as Chain from 'webpack-chain'

import type { BuildConfig } from '../util/types'

export default (_appPath: string, _config: Partial<BuildConfig>) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.vue'],
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
      symlinks: true,
      alias: {
        // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
        '@tarojs/runtime': require.resolve('@tarojs/runtime'),
        '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js')
      }
    },
    resolveLoader: {
      modules: ['node_modules']
    }
  })

  // Note: stencil 开发环境环境会加载 map 文件，需要额外配置
  chain.module
    .rule('map')
    .test(/\.map$/)
    .type('json')

  chain.resolve
    .plugin('MultiPlatformPlugin')
    .use(MultiPlatformPlugin, ['described-resolve', 'resolve', {
      chain
    }])

  return chain
}
