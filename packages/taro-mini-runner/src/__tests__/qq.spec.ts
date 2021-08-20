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

import { QQ } from '@tarojs/plugin-platform-qq'
import * as helper from '@tarojs/helper'
import { compile, getOutput } from './utils/compiler'

const program = new QQ({ helper } as any, {})
const customConfig = {
  buildAdapter: 'qq',
  globalObject: program.globalObject,
  fileType: program.fileType,
  template: program.template,
  runtimePath: program.runtimePath
}

describe('qq', () => {
  test('should build qq app', async () => {
    const { stats, config } = await compile('react', customConfig)
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })

  test('should base template loop 10 times', async () => {
    const { stats, config } = await compile('react', customConfig)
    const assets = stats.toJson().assets || []

    expect(assets.length).toMatchSnapshot()

    const output = getOutput(stats, config)
    expect(output).toMatchSnapshot()
  })
})
