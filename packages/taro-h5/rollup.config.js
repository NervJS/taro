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

import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { mergeWith } from 'lodash'
import externals from 'rollup-plugin-node-externals'
import postcss from 'rollup-plugin-postcss'
import ts from 'rollup-plugin-ts'

const baseConfig = {
  output: {
    sourcemap: true,
    exports: 'named'
  },
  treeshake: false,
  plugins: [
    externals({
      devDeps: false
    }),
    resolve({
      preferBuiltins: false,
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main']
    }),
    ts({
      sourceMap: true,
    }),
    commonjs(),
    postcss({
      inject: { insertAt: 'top' }
    })
  ]
}

const variesConfig = [{
  input: ['src/index.ts', 'src/api/index.ts', 'src/api/taro.ts'],
  output: {
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src'
  }
}]

if (process.env.NODE_ENV === 'production') {
  variesConfig.push({
    input: 'src/index.ts',
    output: {
      format: 'cjs',
      file: 'dist/index.cjs.js',
      inlineDynamicImports: true
    }
  }, {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      inlineDynamicImports: true
    }
  })
}

export default variesConfig.map(v => {
  const customizer = function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
    if (typeof objValue === 'object') {
      return mergeWith({}, objValue, srcValue, customizer)
    }
  }
  return mergeWith({}, baseConfig, v, customizer)
})
