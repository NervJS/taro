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

import * as Memoryfs from 'memory-fs'
import * as path from 'path'
import * as prettier from 'prettier'
import * as webpack from 'webpack'

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
