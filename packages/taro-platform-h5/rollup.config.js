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
 *  SOFTWARE.
 */

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { merge } from 'lodash'
import * as path from 'path'
import externals from 'rollup-plugin-node-externals'
import ts from 'rollup-plugin-ts'

import exportNameOnly from './build/rollup-plugin-export-name-only'

const cwd = __dirname

const baseConfig = {
  output: {
    format: 'es',
    exports: 'named',
    sourcemap: true,
  },
  treeshake: false
}

function getPlugins (pre = [], post = []) {
  return [
    ...pre,
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    ts({
      sourcemap: true,
    }),
    commonjs(),
    ...post
  ]
}

const variesConfig = [{
  input: path.join(cwd, 'src/index.ts'), // 供 CLI 编译时使用的 Taro 插件入口
  output: {
    file: path.join(cwd, 'dist/index.js'),
    format: 'cjs'
  },
  plugins: getPlugins([externals()])
}, {
  input: [
    path.join(cwd, 'src/runtime/index.ts'), // 供 Loader 使用的运行时入口
    path.join(cwd, 'src/runtime/apis/index.ts'), // API
    path.join(cwd, 'src/runtime/components/index.ts'), // Components Library
  ],
  output: {
    dir: path.join(cwd, 'dist'),
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: getPlugins([externals()])
}, {
  input: path.join(cwd, 'src/runtime/apis/index.ts'), // 供 babel-plugin-transform-taroapi 使用，为了能 tree-shaking
  output: {
    file: 'dist/taroApis.js',
    format: 'cjs',
    inlineDynamicImports: true
  },
  plugins: getPlugins([
    externals({
      exclude: ['@tarojs/components', '@tarojs/taro-h5']
    })
  ], [exportNameOnly()])
}]

export default variesConfig.map(v => merge({}, baseConfig, v))
