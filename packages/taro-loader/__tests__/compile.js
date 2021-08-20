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

import * as path from 'path'
import * as webpack from 'webpack'
import * as Memoryfs from 'memory-fs'
import * as prettier from 'prettier'

function run (compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) {
        reject(stats.toJson().errors)
      }

      resolve(stats)
    })
  })
}

export function pretty (s) {
  return prettier.format(s, { parser: 'babel' })
}

export async function compile (fixture, { type, framework }) {
  const compiler = webpack({
    context: __dirname,
    entry: `./fixtures/${fixture}`,
    output: {
      path: path.resolve(__dirname, './fixtures'),
      filename: 'bundle.txt'
    },
    externals: ['@tarojs/runtime', 'vue', 'react-dom', 'react', 'vue', './app'],
    module: {
      rules: [{
        test: /\.txt$/,
        use: [
          {
            loader: path.resolve(__dirname, `../lib/${type}.js`),
            options: {
              framework
            }
          }
        ]
      }, {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }]
    }
  })

  compiler.outputFileSystem = new Memoryfs()

  const stats = await run(compiler)
  const output = stats.toJson().modules.find(m => m.depth === 0).source

  return prettier.format(output, { parser: 'babel' })
}

// exports.compile = compile
