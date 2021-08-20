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

import typescript from 'rollup-plugin-typescript2'

const { join } = require('path')

const cwd = __dirname

const baseConfig = {
  input: join(cwd, 'src/index.ts'),
  output: [
    {
      file: join(cwd, 'dist/index.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          preserveConstEnums: true
        }
      }
    })
  ]
}
const esmConfig = Object.assign({}, baseConfig, {
  output: Object.assign({}, baseConfig.output, {
    sourcemap: true,
    format: 'es',
    file: join(cwd, 'dist/shared.esm.js')
  }),
  plugins: [
    typescript()
  ]
})

// template 只在编译时使用
const templateConfig = {
  input: join(cwd, 'src/template.ts'),
  output: [
    {
      file: join(cwd, 'dist/template.js'),
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    typescript()
  ]
}

module.exports = [baseConfig, esmConfig, templateConfig]
