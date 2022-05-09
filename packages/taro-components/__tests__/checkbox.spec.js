import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { Checkbox, CheckboxGroup } from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Checkbox', () => {
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

  it('checkbox', async () => {
    const value = 'taro'
    const red = 'rgb(255, 0, 0)'
    const wrapper = await mount(<Checkbox value={value} color={red} />, scratch)
    const { node } = wrapper
    const input = wrapper.find('input')

    assert(node.value === value)
    assert(node.checked === false)
    assert(input.checked === false)

    simulant.fire(input, 'click')
    await waitForChange(input)

    assert(input.checked === true)
    assert(input.style.color === red)
  })

  it('checkbox-group', async () => {
    const lastCheckbox = React.createRef()
    const list = [
      { value: '美国' },
      { value: '中国', checked: 'true' },
      { value: '巴西' },
      { value: '日本' },
      { value: '英国' },
      { value: '法国' }
    ]
    const onChange = sinon.spy()
    const app = (
      <CheckboxGroup name='checkbox' onChange={onChange}>
        {list.map(item => (
          <Checkbox
            key={item.value}
            value={item.value}
            checked={item.checked}
            ref={lastCheckbox}
          />
        ))}
      </CheckboxGroup>
    )
    const wrapper = await mount(app, scratch)
    const { node } = wrapper
    const lastCheckboxInput = lastCheckbox.current.querySelector('input')

    assert(node.value.length === 1)
    assert(node.value.includes('中国') === true)
    assert(wrapper.findAll('taro-checkbox-core[name=checkbox]').length === list.length)

    simulant.fire(lastCheckboxInput, 'click')
    await waitForChange(lastCheckboxInput)

    assert(node.value.length === 2)
    assert(node.value.includes('中国') === true)
    assert(node.value.includes('法国') === true)
    assert(onChange.callCount === 1)
    assert(onChange.firstCall.args[0].detail.value === node.value)
  })
})
