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

import { compile, getOutput } from './utils/compiler'

describe('subpackages', () => {
  test('should process subpackages', async () => {
    const { stats, config } = await compile('subpackages', {
      webpackChain (chain) {
        const config = chain.optimization.get('splitChunks')
        chain.optimization
          .splitChunks({
            ...config,
            cacheGroups: {
              ...config.cacheGroups,
              subutils: {
                name: 'sub-utils',
                minChunks: 2,
                test: module => /[\\/]packageA[\\/]/.test(module.resource),
                priority: 200
              }
            }
          })
      },
      addChunkPages (pages) {
        pages.set('packageA/detail/index', ['sub-utils'])
        pages.set('packageA/my/index', ['sub-utils'])
      }
    })
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
