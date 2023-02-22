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
    jest.resetModules()
    const compiler = require('./utils/compiler')
    compile = compiler.compile
    readDir = compiler.readDir
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
