/*
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

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'

// 供 Loader 使用的运行时入口
export default {
  external: d => {
    return /^react$/.test(d) || /^@tarojs\/taro$/.test(d) || /^@tarojs\/taro-h5$/.test(d) || d.includes('@babel/runtime')
  },
  input: {
    'view/index': 'src/components/view/index.tsx',
    'scroll-view/index': 'src/components/scroll-view/index.tsx',
    'text/index': 'src/components/text/index.tsx',
    'pull-down-refresh/index': 'src/components/pull-down-refresh/index.tsx',
    'image/index': 'src/components/image/index.tsx',
    'swiper/index': 'src/components/swiper/index.tsx'
  },
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: false
    }),
    postcss({
      inject: { insertAt: 'top' }
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ],
  output: {
    entryFileNames: '[name].js',
    dir: 'dist',
    chunkFileNames: '[name].js',
    format: 'es',
    sourcemap: true
  }
}
