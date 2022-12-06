import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { Radio, RadioGroup } from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'

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
