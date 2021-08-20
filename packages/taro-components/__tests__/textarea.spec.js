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
import { Textarea } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Textarea', () => {
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
    const onFocus = sinon.spy()
    const wrapper = await mount(<Textarea autoFocus onFocus={onFocus} />, scratch)
    const { node } = wrapper
    const textarea = wrapper.find('textarea')

    assert(node.value === '')
    assert(textarea.value === '')
    assert(textarea.getAttribute('placeholder') === null)
    assert(textarea.getAttribute('maxlength') === '140')

    const value = 'taro'
    const placeholder = 'type sth...'
    const maxlength = 10

    await wrapper.setProps({
      value,
      placeholder,
      maxlength
    })

    assert(node.value === value)
    assert(textarea.value === value)
    assert(textarea.getAttribute('placeholder') === placeholder)
    assert(textarea.getAttribute('maxlength') === String(maxlength))
    assert(onFocus.callCount === 1)
  })

  it('events', async () => {
    const onInput = sinon.spy()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    let value = 'taro'

    const app = (
      <Textarea
        value={value}
        onInput={e => onInput(e.detail.value)}
        onFocus={e => onFocus(e.detail.value)}
        onBlur={e => onBlur(e.detail.value)}
      />
    )

    const wrapper = await mount(app, scratch)
    const textarea = wrapper.find('textarea')

    textarea.focus()
    assert(onFocus.calledOnceWith(value) === true)

    value = 'taroa'
    textarea.value = value
    simulant.fire(textarea, 'input', {
      data: 'a',
      inputType: 'insertText'
    })
    assert(onInput.calledOnceWith(value) === true)

    textarea.blur()
    assert(onBlur.calledOnceWith(value) === true)
  })
})
