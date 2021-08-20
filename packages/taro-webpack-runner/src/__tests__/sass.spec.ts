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
import { compile, getOutput } from './utils/compiler'

describe('sass', () => {
  test('should build app with scss', async () => {
    const { stats, config } = await compile('sass')
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should build app with sass', async () => {
    const { stats, config } = await compile('sass', {
      sourceRoot: 'input'
    })
    const assets = stats.toJson().assets || []

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
    const assets = stats.toJson().assets || []

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
    const assets = stats.toJson().assets || []

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
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
