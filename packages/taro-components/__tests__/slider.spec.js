import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { Slider } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Slider', () => {
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
    const wrapper = await mount(<Slider />, scratch)
    const { node } = wrapper
    const inner = wrapper.find('.weui-slider__inner')
    const track = wrapper.find('.weui-slider__track')
    const handler = wrapper.find('.weui-slider__handler')
    let box = wrapper.find('.weui-slider-box__value')

    assert(inner.style.backgroundColor === 'rgb(233, 233, 233)')
    assert(track.style.width === '0%')
    assert(track.style.backgroundColor === 'rgb(26, 173, 25)')
    assert(handler.style.left === '0%')
    assert(handler.style.width === '28px')
    assert(handler.style.height === '28px')
    assert(handler.style.backgroundColor === 'rgb(255, 255, 255)')
    assert(box === null)
    assert(node.disabled === false)

    const value = 50
    const activeColor = 'rgb(97, 144, 232)'
    const backgroundColor = 'rgb(255, 0, 0)'
    const blockColor = 'rgb(51, 51, 51)'
    const blockSize = 20

    await wrapper.setProps({
      value,
      activeColor,
      backgroundColor,
      blockColor,
      blockSize,
      showValue: true,
      disabled: true
    })

    box = wrapper.find('.weui-slider-box__value')

    assert(inner.style.backgroundColor === backgroundColor)
    assert(track.style.width === `${value}%`)
    assert(track.style.backgroundColor === activeColor)
    assert(handler.style.left === `${value}%`)
    assert(handler.style.width === `${blockSize}px`)
    assert(handler.style.height === `${blockSize}px`)
    assert(handler.style.backgroundColor === blockColor)
    assert(box.textContent === `${value}`)
    assert(node.disabled === true)
  })

  it('should be max', async () => {
    const max = 200
    const current = 300
    const wrapper = await mount(<Slider max={max} value={current} />, scratch)
    const { node } = wrapper

    assert(node.value === max)
  })

  it('should be min', async () => {
    const min = 50
    const current = 0
    const wrapper = await mount(<Slider min={min} value={current} />, scratch)
    const { node } = wrapper

    assert(node.value === min)
  })

  it('steps', async () => {
    const wrapper = await mount(<Slider min={50} max={200} step={2} value={79} />, scratch)
    const { node } = wrapper
    const track = wrapper.find('.weui-slider__track')
    const handler = wrapper.find('.weui-slider__handler')

    assert(node.value === 80)
    assert(track.style.width === '20%')
    assert(handler.style.left === '20%')
  })

  it('events', async () => {
    const onChange = sinon.spy()
    const onChanging = sinon.spy()
    const app = (
      <Slider
        onChange={onChange}
        onChanging={onChanging}
      />
    )

    const wrapper = await mount(app, scratch)
    const inner = wrapper.find('.weui-slider__inner')
    const handler = wrapper.find('.weui-slider__handler')
    const innerWidth = inner.getBoundingClientRect().width
    const rect = handler.getBoundingClientRect()
    const centerPoint = (rect.left + rect.right) / 2

    const touchStart = new Touch({
      identifier: 0,
      target: handler,
      pageX: centerPoint
    })
    simulant.fire(handler, 'touchstart', { targetTouches: [touchStart] })

    const touchMove = new Touch({
      identifier: 0,
      target: handler,
      pageX: centerPoint + innerWidth / 2
    })
    simulant.fire(handler, 'touchmove', { targetTouches: [touchMove] })

    simulant.fire(handler, 'touchend')

    assert(onChanging.calledOnce === true)
    assert(onChanging.firstCall.args[0].detail.value === 50)
    assert(onChange.calledOnce === true)
    assert(onChange.firstCall.args[0].detail.value === 50)
    assert(wrapper.node.value === 50)
  })
})
