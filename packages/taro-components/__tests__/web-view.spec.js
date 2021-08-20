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

import React from 'react'
import * as assert from 'assert'
import * as sinon from 'sinon'
import { WebView } from '../h5/react'
import { mount } from './test-tools'
import { delay } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('WebView', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  const TARO = 'https://taro.jd.com/home/in.html'

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('should show an iframe', async () => {
    const wrapper = await mount(<WebView src={TARO} />, scratch)
    const iframe = wrapper.find('iframe')

    assert(iframe.src === TARO)
  })

  it('events', async () => {
    const onLoad = sinon.spy()
    await mount(<WebView src='' onLoad={onLoad} />, scratch)

    await delay(30)
    assert(onLoad.callCount === 1)
  })
})
