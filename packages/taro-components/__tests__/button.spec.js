import * as React from 'react'
import ReactDOM from 'react-dom'
import { Button } from '../h5/react'
import { waitForChange, delay } from './utils'
import * as assert from 'assert'
import * as sinon from 'sinon'

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
    const ref = React.createRef()

    const size = 'mini'
    const plain = true
    const loading = true
    const disabled = false
    /**
     * @type {import('react').ReactInstance}
     */
    let instance

    class App extends React.Component {
      state = {
        size,
        plain,
        loading,
        disabled
      }

      constructor (props) {
        super(props)
        instance = this
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
            ref={ref}
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

    ReactDOM.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    /**
     * @type {HTMLButtonElement}
     */
    const button = node
    assert(button.type === '')
    assert(button.plain === true)
    assert(button.loading === true)
    assert(button.size === 'mini')
    assert(button.disabled === false)
    const icon = button.getElementsByTagName('i')[0]
    assert(icon.className === 'weui-loading')
    assert(button.textContent === 'button')

    instance.setState({
      plain: false
    })
    await waitForChange(button)
    assert(button.plain === false)

    instance.setState({
      loading: false
    })
    await waitForChange(button)
    assert(button.loading === false)
    assert(icon.parentNode === null)

    instance.setState({
      disabled: true
    })
    await waitForChange(button)
    assert(button.disabled === true)

    instance.setState({
      size: 'big'
    })
    await waitForChange(button)
    assert(button.size === 'big')
  })

  it('event', async () => {
    const ref = React.createRef()

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
        const {
          hoverStartTime,
          hoverStayTime
        } = this.state
        return (
          <Button
            ref={ref}
            size="fork"
            hoverStartTime={hoverStartTime}
            hoverStayTime={hoverStayTime}
            onClick={() => {
              clickSpy()
            }}
            onTouchStart={() => {
              touchStartSpy()
            }}
            onTouchEnd={() => touchEndSpy()}
          >
            button
          </Button>
        )
      }
    }

    ReactDOM.render(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)
    assert(node.hoverStartTime === hoverStartTime)
    assert(node.hoverStayTime === hoverStayTime)
    assert(node.hoverClass === 'button-hover')
    /**
     * @type {HTMLButtonElement}
     */
    const button = node
    button.click()
    assert(clickSpy.callCount === 1)

    fireTouchEvent(button, 'touchstart')
    assert(touchStartSpy.callCount === 1)
    await delay(hoverStartTime + 10)

    // assert(button.classList.contains('button-hover'))

    fireTouchEvent(button, 'touchend')
    await delay(hoverStayTime + 10)
    assert(button.classList.contains('button-hover') === false)
    assert(touchStartSpy.callCount === 1)
  })
})
