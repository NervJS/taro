import React from 'react'
import * as assert from 'assert'
import simulant from 'simulant'
import * as sinon from 'sinon'
import { Switch } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Switch', () => {
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
    const wrapper = await mount(<Switch checked={true} />, scratch)
    const { node } = wrapper
    const input = wrapper.find('input')
    const inputStyle = window.getComputedStyle(input)

    assert(node.checked === true)
    assert(node.value === true)
    assert(input.className === 'weui-switch')
    assert(inputStyle.borderColor === 'rgb(4, 190, 2)')
    assert(inputStyle.backgroundColor === 'rgb(4, 190, 2)')

    const color = 'rgb(255, 0, 0)'

    await wrapper.setProps({
      type: 'checkbox',
      color
    })

    assert(input.className === 'weui-checkbox')
    assert(inputStyle.backgroundColor === color)
  })

  it('events', async () => {
    const onChange = sinon.spy()
    const { node, find } = await mount(<Switch onChange={onChange} />, scratch)
    const input = find('input')

    assert(node.checked === false)
    assert(node.value === false)

    simulant.fire(input, 'click')

    assert(node.value === true)
    assert(onChange.callCount === 1)
    assert(onChange.firstCall.args[0].detail.value === true)
  })
})
