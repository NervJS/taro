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

import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import * as path from 'path'
import ts from 'rollup-plugin-ts'

const cwd = __dirname

const baseConfig = {
  input: path.join(cwd, 'src/index.ts'),
  external: d => {
    return d.includes('@tarojs/runtime') || d.includes('@tarojs/taro') || d.includes('@babel/runtime')
  },
  output: [
    {
      file: path.join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: path.join(cwd, 'dist/with-weapp.js'),
      format: 'umd',
      name: 'TaroWithWeapp',
      sourcemap: true,
      exports: 'named',
      globals: {
        '@babel/runtime/helpers/defineProperty': '_defineProperty',
        '@babel/runtime/helpers/toConsumableArray': '_toConsumableArray',
        '@babel/runtime/helpers/slicedToArray': '_slicedToArray',
        '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
        '@babel/runtime/helpers/createClass': '_createClass',
        '@babel/runtime/helpers/assertThisInitialized': '_assertThisInitialized',
        '@babel/runtime/helpers/get': '_get',
        '@babel/runtime/helpers/inherits': '_inherits',
        '@babel/runtime/helpers/possibleConstructorReturn': '_possibleConstructorReturn',
        '@babel/runtime/helpers/getPrototypeOf': '_getPrototypeOf',
        '@babel/runtime/helpers/typeof': '_typeof',
        '@tarojs/runtime': 'runtime',
        '@tarojs/taro': 'taro'
      }
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: false
    }),
    ts(),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output[0], {
    sourcemap: true,
    format: 'es',
    file: path.join(cwd, 'dist/index.esm.js')
  })
})

function rollup () {
  const target = process.env.TARGET

  if (target === 'umd') {
    return baseConfig
  } else if (target === 'esm') {
    return esmConfig
  } else {
    return [baseConfig, esmConfig]
  }
}
module.exports = rollup()
