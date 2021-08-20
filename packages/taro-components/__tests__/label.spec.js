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
import {
  Label,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup
} from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Label', () => {
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

  it('label contain subject', async () => {
    const ref = React.createRef()
    const onChange = sinon.spy()
    const app = (
      <CheckboxGroup onChange={onChange}>
        <Label>
          <Checkbox value='dog' ref={ref} />
          <div id='dog'>dog</div>
        </Label>
        <Label>
          <Checkbox value='cat' checked />
          <div id='cat'>cat</div>
        </Label>
      </CheckboxGroup>
    )
    const { node, find } = await mount(app, scratch)
    const target = find('#dog')
    const input = ref.current.querySelector('input')

    assert(node.value.length === 1)
    assert(node.value.includes('cat'))

    simulant.fire(target, 'click')
    await waitForChange(input)

    assert(node.value.length === 2)
    assert(node.value.includes('cat'))
    assert(node.value.includes('dog'))
    assert(onChange.callCount === 1)
  })

  it('label for', async () => {
    const radioGroup = React.createRef()
    const labelRef = React.createRef()
    const onChange = sinon.spy()
    const app = (
      <div>
        <RadioGroup ref={radioGroup} onChange={onChange}>
          <Radio id='gz' value='GuangZhou'>GuangZhou</Radio>
          <Radio id='sz' value='ShenZhen' checked={true}>ShenZhen</Radio>
        </RadioGroup>

        <Label for='gz' ref={labelRef}>广州</Label>
        <Label for='sz'>深圳</Label>
      </div>
    )
    await mount(app, scratch)
    const gz = labelRef.current.querySelector('label')

    assert(radioGroup.current.value === 'ShenZhen')

    simulant.fire(gz, 'click')

    assert(radioGroup.current.value === 'GuangZhou')
    assert(onChange.callCount === 1)
  })
})
