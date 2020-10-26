import React from 'react'
import * as assert from 'assert'
import { Canvas } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Canvas', () => {
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
    const canvasId = 'my-canvas'
    const wrapper = await mount(<Canvas canvasId={canvasId} />, scratch)
    const canvas = wrapper.find('canvas')

    assert(canvas instanceof HTMLCanvasElement)
    assert(canvas.getAttribute('canvas-id') === canvasId)
    assert(canvas.width === 300)
    assert(canvas.height === 150)
  })
})
