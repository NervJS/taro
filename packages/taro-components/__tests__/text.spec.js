import * as assert from 'assert'
import React from 'react'

import { Text } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Text', () => {
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
    const wrapper = await mount(<Text />, scratch)
    const { node } = wrapper
    const computedStyle = window.getComputedStyle(node)

    assert(computedStyle.userSelect === 'none')

    await wrapper.setProps({
      selectable: true,
      className: 'foo'
    })

    assert(computedStyle.userSelect === 'text')
    assert(node.classList.contains('taro-text__selectable') === true)
    assert(node.classList.contains('foo') === true)
    assert(node.classList.contains('hydrated') === true)
  })

  it('slot', async () => {
    const { node } = await mount(<Text>Taro Next</Text>, scratch)

    assert(node.textContent === 'Taro Next')
  })
})
