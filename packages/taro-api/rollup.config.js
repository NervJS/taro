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
 *  SOFTWARE.
 */

import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const baseConfig = {
  input: 'src/index.js',
  external: d => {
    return /^@tarojs\/runtime$/.test(d) || d.includes('@babel/runtime')
  },
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    commonjs(),
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
