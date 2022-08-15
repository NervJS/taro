import * as assert from 'assert'
import React from 'react'

import { RichText } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

const SNAPSHOT = '<div class="div_class" style="line-height: 60px; color: red; margin-top: 10px; padding: 50px 30px;">Hello&nbsp;World!</div>'

describe('RichText', () => {
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

  it('should render array nodes', async () => {
    const nodes = [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height:    60px;    color:red;margin-top: 10px; padding: 50px 30px'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }]
    const { node } = await mount(<RichText nodes={nodes} />, scratch)

    assert(node.innerHTML === SNAPSHOT)
  })

  it('should render string nodes', async () => {
    const nodes = SNAPSHOT
    const { node } = await mount(<RichText nodes={nodes} />, scratch)

    assert(node.innerHTML === SNAPSHOT)
  })
})
