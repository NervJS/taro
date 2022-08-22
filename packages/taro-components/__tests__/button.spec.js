import * as assert from 'assert'
import * as React from 'react'
import * as sinon from 'sinon'

import { Button } from '../h5/react'
import { mount } from './test-tools'
import { delay, waitForChange } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

function fireTouchEvent (el, type) {
  const e = document.createEvent('UIEvent')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

describe('Button', () => {
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
    const size = 'mini'
    const plain = true
    const loading = true
    const disabled = false

    class App extends React.Component {
      state = {
        size,
        plain,
        loading,
        disabled
      }

      render () {
        const {
          size,
          plain,
          loading,
          disabled
        } = this.state
        return (
          <Button
            size={size}
            plain={plain}
            loading={loading}
            disabled={disabled}
          >
            button
          </Button>
        )
      }
    }

    const wrapper = await mount(<App />, scratch)
    const node = wrapper.node

    assert(!node.type) /** local: '', ci: undefined */
    assert(node.plain === true)
    assert(node.loading === true)
    assert(node.size === 'mini')
    assert(node.disabled === false)
    await delay(3000)
    const icon = node.getElementsByTagName('i')[0]
    assert(icon.className === 'weui-loading')
    assert(node.textContent === 'button')

    wrapper.setState({
      plain: false
    })
    assert(node.plain === false)

    wrapper.setState({
      loading: false
    })
    await waitForChange(icon)
    assert(node.loading === false)
    assert(icon.parentNode === null)

    wrapper.setState({
      disabled: true
    })
    assert(node.disabled === true)

    wrapper.setState({
      size: 'big'
    })
    assert(node.size === 'big')
  })

  it('event', async () => {
    const clickSpy = sinon.spy()
    const touchStartSpy = sinon.spy()
    const touchEndSpy = sinon.spy()

    const hoverStartTime = 50
    const hoverStayTime = 100

    class App extends React.Component {
      state = {
        hoverStartTime,
        hoverStayTime
      }

      render () {
        const { hoverStartTime, hoverStayTime } = this.state
        return (
          <Button
            size="fork"
            hoverStartTime={hoverStartTime}
            hoverStayTime={hoverStayTime}
            onClick={() => clickSpy()}
            onTouchStart={() => touchStartSpy()}
            onTouchEnd={() => touchEndSpy()}
          >
            button
          </Button>
        )
      }
    }

    const { node } = await mount(<App />, scratch)

    assert(node.hoverStartTime === hoverStartTime)
    assert(node.hoverStayTime === hoverStayTime)
    assert(node.hoverClass === 'button-hover')

    node.click()
    assert(clickSpy.callCount === 1)

    fireTouchEvent(node, 'touchstart')
    assert(touchStartSpy.callCount === 1)

    await delay(hoverStartTime + 10)
    assert(node.classList.contains('button-hover'))

    fireTouchEvent(node, 'touchend')
    assert(touchEndSpy.callCount === 1)

    await delay(hoverStayTime + 10)
    assert(node.classList.contains('button-hover') === false)
  })
})
