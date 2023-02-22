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

import * as path from 'path'
import * as Chain from 'webpack-chain'

import { compile, getOutput } from './utils/compiler'

const sourceRoot = 'origin'
const outputRoot = 'output'

describe('config', () => {
  test('should build from origin and pipe to output', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      outputRoot
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should copy assets', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      copy: {
        patterns: [{
          from: `${sourceRoot}/weapp`,
          to: 'dist/weapp'
        }, {
          from: `${sourceRoot}/irrelevant.txt`,
          to: 'dist/irrelevant.txt'
        }],
        options: {}
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should modify webpack chain', async () => {
    const fn = jest.fn()
    await compile('config', {
      sourceRoot,
      webpackChain: chain => fn(chain instanceof Chain)
    })

    expect(fn).toBeCalledWith(true)
  })

  test('should resolved alias', async () => {
    const { stats, config } = await compile('config', {
      sourceRoot,
      entry: {
        extra: [`./${sourceRoot}/alias/files/index/index.js`]
      },
      alias: {
        '@/utils': path.resolve(__dirname, './fixtures/config/origin/alias/utils')
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
