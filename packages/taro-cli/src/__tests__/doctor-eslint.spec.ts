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
import validator from '../doctor/eslintValidator'

describe('eslint validator of doctor', () => {
  let cwd = ''
  beforeEach(() => {
    cwd = process.cwd()
  })

  afterEach(() => {
    process.chdir(cwd)
  })

  it('should lint for react', () => {
    process.chdir(path.join(__dirname, 'fixtures/default'))
    const { raw } = validator({
      projectConfig: {
        framework: 'react',
        sourceRoot: 'src'
      }
    })

    expect(raw).toBe('')
  })

  it('should lint for nerv', () => {
    process.chdir(path.join(__dirname, 'fixtures/nerv'))
    const { raw } = validator({
      projectConfig: {
        framework: 'nerv',
        sourceRoot: 'src'
      }
    })

    expect(raw.includes('\'a\' is assigned a value but never used'))
  })

  it('should lint for vue', () => {
    process.chdir(path.join(__dirname, 'fixtures/vue'))
    const { raw } = validator({
      projectConfig: {
        framework: 'vue',
        sourceRoot: 'src'
      }
    })

    expect(raw).toBe('')
  })
})
