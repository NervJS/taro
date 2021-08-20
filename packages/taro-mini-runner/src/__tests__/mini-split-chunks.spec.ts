/*!
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

import * as fs from 'fs-extra'
import * as path from 'path'

let compile
let readDir

describe('mini-split-chunks', () => {
  beforeAll(() => {
    jest.unmock('webpack')
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      const compiler = require('./utils/compiler')
      compile = compiler.compile
      readDir = compiler.readDir
    })
  })

  test('should process mini-split-chunks', async () => {
    const appName = 'mini-split-chunks'
    const { stats, config } = await compile(appName, {
      webpackChain (chain) {
        chain.merge({
          externals: [
            'lodash'
          ]
        })
      },
      optimizeMainPackage: {
        enable: true,
        exclude: [
          path.resolve(__dirname, './fixtures/mini-split-chunks/src/utils/testExcludeString.js'),
          (module) => module.resource?.indexOf('testExcludeFunction') >= 0
        ]
      },
      postcss: {
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    })

    const assets = stats.toJson().assets || []
    expect(assets.length).toMatchSnapshot()

    const files = readDir(fs, config.outputRoot)

    /**
     * 因为该plugin输出的文件名跟用户路径有关，snapshot输出的文件内容不稳定，这里改用判断输出文件是否存在来测试
     */
    files.forEach(file => {
      const fileContent = fs.readFileSync(file).toString()
      const jsExt = '.js'
      const wxssExt = '.wxss'
      const needTestPages = [
        'packageA/detail/index',
        'packageA/my/index',
        'packageB/list/index'
      ]
      const checkChunksExist = ({ ext, regexp }) => {
        const isNeedTestFile = needTestPages.find(needTestPage => new RegExp(`${needTestPage}${ext}$`).test(file))

        if (!isNeedTestFile) return

        const matchChunks = (fileContent || '').match(new RegExp(regexp, 'g'))
        const chunkPaths = (matchChunks || []).map(chunkPath => {
          return chunkPath.replace(new RegExp(regexp), '$1')
        })

        chunkPaths.forEach(chunkPath => {
          const chunkExt = ext === jsExt ? jsExt : ''
          const chunkAbsolutePath = path.resolve(file, '..', chunkPath + chunkExt)
          const isExists = fs.pathExistsSync(chunkAbsolutePath)

          // 根据match到的module path查看输出的chunk是否存在
          expect(isExists).toBe(true)
        })
      }

      // js
      if (path.extname(file) === jsExt) {
        checkChunksExist({
          ext: jsExt,
          regexp: 'require\\("(.*)"\\);'
        })
      }

      // wxss
      if (path.extname(file) === wxssExt) {
        checkChunksExist({
          ext: wxssExt,
          regexp: new RegExp('@import "(.*)";')
        })
      }
    })
  })
})
