import * as assert from 'assert'
import React from 'react'

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
