import React from 'react'
import * as assert from 'assert'
import simulant from 'simulant'
import { spy } from 'sinon'
import { View } from '../h5/react'
import { delay } from './utils'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('View', () => {
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
    const { node } = await mount(<View />, scratch)

    assert(node.hoverClass === undefined)
    assert(node.hoverStartTime === 50)
    assert(node.hoverStayTime === 400)
  })

  it('slot', async () => {
    const app = (
      <View>
        <div />
        <div />
        i m div
      </View>
    )

    const { node } = await mount(app, scratch)

    assert(node.childNodes.length === 3)
  })

  it('should update props successfully', async () => {
    let hoverClass = 'hover'
    let hoverStartTime = 100
    let hoverStayTime = 300

    const app = (
      <View
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

    const { node } = await mount(<View hoverClass={hoverClass}/>, scratch)

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
    const { node } = await mount(<View onLongPress={onLongPressSpy} />, scratch)

    simulant.fire(node, 'touchstart')
    await delay(400)

    assert(onLongPressSpy.calledOnce)
  })
})
