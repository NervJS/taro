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
import cjs from 'rollup-plugin-commonjs'
import babel from '@rollup/plugin-babel'

const baseConfig = {
  input: 'src/index.js',
  external: d => {
    return /^@tarojs\/runtime$/.test(d) || d.includes('@babel/runtime')
  },
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    cjs(),
    babel({
      babelHelpers: 'runtime'
    })
  ]
}

const common = Object.assign({}, baseConfig, {
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  }
})

const umd = Object.assign({}, baseConfig, {
  output: {
    file: 'dist/taro.js',
    format: 'umd',
    name: 'Taro',
    sourcemap: true,
    exports: 'named',
    globals: {
      '@babel/runtime/helpers/typeof': '_typeof',
      '@babel/runtime/helpers/objectSpread2': '_objectSpread',
      '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
      '@babel/runtime/helpers/createClass': '_createClass',
      '@babel/runtime/helpers/defineProperty': '_defineProperty',
      '@tarojs/runtime': 'runtime'
    }
  }
})

const esm = Object.assign({}, baseConfig, {
  output: {
    sourcemap: true,
    format: 'es',
    file: 'dist/index.esm.js'
  }
})

module.exports = [common, umd, esm]
