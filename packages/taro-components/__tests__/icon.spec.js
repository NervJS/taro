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
import { Icon } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Icon', () => {
  /**
   * @type {HTMLElement}
   */
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
    document.body.appendChild(scratch)
  })

  afterEach(() => {
    scratch.parentNode.removeChild(scratch)
    scratch = null
  })

  it('props', async () => {
    const wrapper = await mount(<Icon />, scratch)
    const { node } = wrapper
    const computedStyle = window.getComputedStyle(node)

    assert(computedStyle.fontSize === '23px')

    const type = 'success'
    const size = '40'
    const color = 'rgb(255, 0, 0)'

    await wrapper.setProps({
      type,
      size,
      color
    })

    assert(node.classList.contains(`weui-icon-${type}`))
    assert(computedStyle.fontSize === `${size}px`)
    assert(computedStyle.color === color)
  })
})
