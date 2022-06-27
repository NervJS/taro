import * as assert from 'assert'
import React from 'react'

import { View } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('style', () => {
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

  it('should apply style as String', async () => {
    const { node } = await mount(<View style='font-size: 30px' />, scratch)
    assert(node.style.fontSize === '30px')
  })

  it('should support animation-iteration-count as number', async () => {
    const { node } = await mount(<View style={{ animationIterationCount: 1 }} />, scratch)
    assert(node.style.animationIterationCount === '1')
  })

  it('should support value of style as Number', async () => {
    const { node } = await mount(<View style={{ fontSize: 30 }} />, scratch)
    assert(node.style.fontSize === '30px')
  })

  it('should not add "px" suffix for custom properties', async () => {
    const { node } = await mount(<View style={{ '--taro': '100px' }} />, scratch)

    assert(node.style.cssText === '--taro:100px;')
    assert(node.style.getPropertyValue('--taro') === '100px')
  })
})
