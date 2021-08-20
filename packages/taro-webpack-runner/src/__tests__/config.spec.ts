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
    const assets = stats.toJson().assets || []

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
    const assets = stats.toJson().assets || []

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
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
