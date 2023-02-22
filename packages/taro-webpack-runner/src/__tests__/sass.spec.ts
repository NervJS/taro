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

import { compile, getOutput } from './utils/compiler'

describe('sass', () => {
  test('should build app with scss', async () => {
    const { stats, config } = await compile('sass')
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should build app with sass', async () => {
    const { stats, config } = await compile('sass', {
      sourceRoot: 'input'
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should set global sass content with source', async () => {
    const { stats, config } = await compile('sass', {
      framework: 'react',
      sass: {
        resource: path.resolve(__dirname, './fixtures/sass/src/common/global.scss')
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should set global sass content with source & dir', async () => {
    const { stats, config } = await compile('sass', {
      framework: 'react',
      sass: {
        resource: 'common/global.scss',
        projectDirectory: path.resolve(__dirname, './fixtures/sass/src')
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should set global sass content with data', async () => {
    const { stats, config } = await compile('sass', {
      framework: 'react',
      sass: {
        resource: 'common/global.scss',
        projectDirectory: path.resolve(__dirname, './fixtures/sass/src'),
        data: '.body {background-color: red;}'
      }
    })
    const assets = stats?.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
