/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as path from 'path'
import * as Chain from 'webpack-chain'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'

export default (appPath: string) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
      symlinks: true,
      modules: [
        'node_modules',
        path.join(appPath, 'node_modules')
      ],
      alias: {
        // 小程序使用 regenerator-runtime@0.11
        'regenerator-runtime': require.resolve('regenerator-runtime'),
        // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
        '@tarojs/runtime': require.resolve('@tarojs/runtime'),
        '@tarojs/shared': require.resolve('@tarojs/shared')
      }
    },
    resolveLoader: {
      modules: [
        'node_modules'
      ]
    },
    optimization: {
      sideEffects: true
    }
  })

  chain.resolve
    .plugin('MultiPlatformPlugin')
    .use(MultiPlatformPlugin, ['described-resolve', 'resolve', {
      chain
    }])

  return chain
}
