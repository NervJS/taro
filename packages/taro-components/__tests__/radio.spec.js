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
import simulant from 'simulant'
import * as sinon from 'sinon'
import { Radio, RadioGroup } from '../h5/react'
import { waitForChange } from './utils'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Radio', () => {
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

  it('radio', async () => {
    const value = 'taro'
    const wrapper = await mount(<Radio value={value} />, scratch)
    const { node } = wrapper
    const input = wrapper.find('input')

    assert(node.value === value)
    assert(node.checked === false)
    assert(input.checked === false)

    simulant.fire(input, 'click')
    await waitForChange(input)

    assert(node.checked === true)
    assert(input.checked === true)
  })

  it('radio-group', async () => {
    const secondRadio = React.createRef()
    const lastRadio = React.createRef()
    const list = [
      { value: '美国' },
      { value: '中国', checked: 'true', ref: secondRadio },
      { value: '巴西' },
      { value: '日本' },
      { value: '英国' },
      { value: '法国', ref: lastRadio }
    ]
    const onChange = sinon.spy()
    const app = (
      <RadioGroup name='radio' onChange={onChange}>
        {list.map(item => (
          <Radio
            key={item.value}
            value={item.value}
            checked={item.checked}
            ref={item.ref}
          />
        ))}
      </RadioGroup>
    )
    const wrapper = await mount(app, scratch)
    const { node } = wrapper
    const lastRadioInput = lastRadio.current.querySelector('input')

    assert(node.value === '中国')
    assert(secondRadio.current.checked === true)
    assert(wrapper.findAll('taro-radio-core[name=radio]').length === list.length)

    simulant.fire(lastRadioInput, 'click')
    await waitForChange(lastRadioInput)

    assert(secondRadio.current.checked === false)
    assert(lastRadio.current.checked === true)
    assert(node.value === '法国')
    assert(onChange.callCount === 1)
    assert(onChange.firstCall.args[0].detail.value === node.value)
  })
})
