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

describe('react', () => {
  process.env.FRAMEWORK = 'react'
  const runtime = require('../../dist/runtime.esm')
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('event should work', () => {
    const div = document.createElement('div')
    const spy = jest.fn()
    div.addEventListener('tap', spy)
    const event = runtime.createEvent({ type: 'tap' }, div)
    div.dispatchEvent(event)
    expect(spy).toBeCalledTimes(1)
  })
})
