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

const { join } = require('path')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('@rollup/plugin-babel').default
const common = require('rollup-plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  external: d => {
    return d.includes('@tarojs/runtime') || d.includes('@tarojs/taro') || d.includes('@babel/runtime')
  },
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: join(cwd, 'dist/with-weapp.js'),
      format: 'umd',
      name: 'TaroWithWeapp',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: false
    }),
    common({
      include: 'node_modules/**'
    }),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', 'ts', 'tsx'],
      babelHelpers: 'runtime'
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/index.esm.js')
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
