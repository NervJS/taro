import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import { spy } from 'sinon'

import { CoverView } from '../h5/react'
import { mount } from './test-tools'
import { delay } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('CoverView', () => {
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

  it('default props', async () => {
    const { node } = await mount(<CoverView />, scratch)

    assert(node.hoverClass === undefined)
    assert(node.hoverStartTime === 50)
    assert(node.hoverStayTime === 400)
  })

  it('slot', async () => {
    const app = (
      <CoverView>
        <div />
        <div />
        i m div
      </CoverView>
    )

    const { node } = await mount(app, scratch)

    assert(node.textContent === 'i m div')
  })

  it('should update props successfully', async () => {
    let hoverClass = 'hover'
    let hoverStartTime = 100
    let hoverStayTime = 300

    const app = (
      <CoverView
        hoverClass={hoverClass}
        hoverStartTime={hoverStartTime}
        hoverStayTime={hoverStayTime}
      />
    )

    const wrapper = await mount(app, scratch)
    const { node } = wrapper

    assert(node.hoverClass === hoverClass)
    assert(node.hoverStartTime === hoverStartTime)
    assert(node.hoverStayTime === hoverStayTime)

    hoverClass = 'active'
    hoverStartTime = 200
    hoverStayTime = 600

    await wrapper.setProps({
      hoverClass,
      hoverStartTime,
      hoverStayTime
    })

    assert(node.hoverClass === hoverClass)
    assert(node.hoverStartTime === hoverStartTime)
    assert(node.hoverStayTime === hoverStayTime)
  })

  it('should hover perform correctly', async () => {
    const hoverClass = 'hover'
    const hoverStartTime = 50
    const hoverStayTime = 400

    const { node } = await mount(<CoverView hoverClass={hoverClass}/>, scratch)

    simulant.fire(node, 'touchstart')
    await delay(hoverStartTime + 30)
    assert(node.classList.contains(hoverClass) === true)

    simulant.fire(node, 'touchend')
    await delay(hoverStayTime - 30)
    assert(node.classList.contains(hoverClass) === true)
    await delay(100)
    assert(node.classList.contains(hoverClass) === false)
  })

  it('should trigger longpress', async () => {
    const onLongPressSpy = spy()
    const { node } = await mount(<CoverView onLongPress={onLongPressSpy} />, scratch)

    simulant.fire(node, 'touchstart')
    await delay(400)

    assert(onLongPressSpy.calledOnce)
  })
})
