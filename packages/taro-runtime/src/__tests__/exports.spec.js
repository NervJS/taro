/*
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

describe('style', () => {
  const runtime = require('../../dist/runtime.esm')

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('bom', () => {
    const window = runtime.window
    expect(window).not.toBeUndefined()
    expect(window.navigator).not.toBeUndefined()
    expect(window.document).not.toBeUndefined()
    expect(runtime.document).toBe(window.document)
    expect(runtime.navigator).toBe(window.navigator)
  })

  it('dom', () => {
    expect(runtime.TaroElement).not.toBeUndefined()
    expect(runtime.TaroNode).not.toBeUndefined()
    expect(runtime.TaroText).not.toBeUndefined()
  })

  it('event', () => {
    expect(runtime.createEvent).not.toBeUndefined()
    expect(runtime.TaroEvent).not.toBeUndefined()
  })

  it('dsl', () => {
    expect(runtime.createComponentConfig).not.toBeUndefined()
    expect(runtime.createPageConfig).not.toBeUndefined()
    expect(runtime.createReactApp).not.toBeUndefined()
    expect(runtime.createReactApp).not.toBeUndefined()
  })
})
