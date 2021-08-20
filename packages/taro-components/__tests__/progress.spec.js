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
import { Progress } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Progress', () => {
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
    const wrapper = await mount(<Progress />, scratch)
    const { node } = wrapper

    let bar = node.querySelector('.weui-progress__bar')
    let innerBar = node.querySelector('.weui-progress__inner-bar')
    let opr = node.querySelector('.weui-progress__opr')

    assert(bar.style.height === '6px')
    assert(bar.style.backgroundColor === 'rgb(235, 235, 235)')
    assert(innerBar.style.width === '0%')
    assert(innerBar.style.transition === 'none 0s ease 0s')
    assert(innerBar.style.backgroundColor === 'rgb(9, 187, 7)')
    assert(innerBar.style.borderRadius === '0px')
    assert(opr === null)

    const percent = 66
    const borderRadius = 10
    const fontSize = 24
    const strokeWidth = 10
    const activeColor = 'yellow'
    const backgroundColor = 'blue'

    await wrapper.setProps({
      percent,
      showInfo: true,
      borderRadius,
      fontSize,
      strokeWidth,
      activeColor,
      backgroundColor,
      active: true
    })

    bar = node.querySelector('.weui-progress__bar')
    innerBar = node.querySelector('.weui-progress__inner-bar')
    opr = node.querySelector('.weui-progress__opr')

    assert(bar.style.height === `${strokeWidth}px`)
    assert(bar.style.backgroundColor === backgroundColor)
    assert(innerBar.style.width === `${percent}%`)
    assert(innerBar.style.transition === 'width 1s ease-in-out 0s')
    assert(innerBar.style.backgroundColor === activeColor)
    assert(innerBar.style.borderRadius === `${borderRadius}px`)
    assert(opr.style.fontSize === `${fontSize}px`)
    assert(opr.innerHTML === `<span>${percent}%</span>`)
  })

  it('should percent between 0~100', async () => {
    const wrapper = await mount(<Progress percent={-18} showInfo />, scratch)
    const { node } = wrapper

    let innerBar = node.querySelector('.weui-progress__inner-bar')
    let opr = node.querySelector('.weui-progress__opr')

    assert(innerBar.style.width === '0%')
    assert(opr.innerHTML === '<span>0%</span>')

    await wrapper.setProps({
      percent: 150
    })

    innerBar = node.querySelector('.weui-progress__inner-bar')
    opr = node.querySelector('.weui-progress__opr')

    assert(innerBar.style.width === '100%')
    assert(opr.innerHTML === '<span>100%</span>')
  })
})
