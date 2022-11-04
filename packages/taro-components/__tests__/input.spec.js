import * as assert from 'assert'
import $ from 'jquery'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { Input } from '../h5/react'
import { mount } from './test-tools'
import { waitForChange } from './utils'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Input', () => {
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

    const maxLength = 10
    const disabled = false
    const value = ''
    const placeholder = 'placeholder'
    const autoFocus = true

    const focusSpy = sinon.spy()

    /**
     * @type {import('react').ReactInstance}
     */
    let instance

    class App extends React.Component {
      state = {
        maxLength,
        disabled,
        value,
        placeholder,
        autoFocus,
        type: 'text'
      }

      constructor (props) {
        super(props)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        instance = this
      }

      render () {
        const {
          maxLength,
          disabled,
          value,
          placeholder,
          type,
          autoFocus
        } = this.state

        return (
          <Input
            ref={ref}
            maxlength={maxLength}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            type={type}
            autoFocus={autoFocus}
            onFocus={() => {
              focusSpy()
            }}
          />
        )
      }
    }

    await mount(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    /**
     * @type {HTMLInputElement}
     */
    const input = node.children[0]
    assert(input.classList.contains('weui-input'))
    assert(input.getAttribute('maxlength') === maxLength.toString())
    assert(input.getAttribute('placeholder') === placeholder)
    assert(input.type === 'text')
    input.focus()
    assert(focusSpy.callCount === 1)
    // assert($(input).is(':focus'))
    // assert(document.activeElement === input)

    instance.setState({
      value: 'test',
      maxLength: 4,
      type: 'password'
    })

    await waitForChange(input)
    assert(input.value === 'test')
    assert(input.type === 'password')
  })

  it('event', async () => {
    const ref = React.createRef()

    const focusSpy = sinon.spy()
    const blurSpy = sinon.spy()
    const confirm = sinon.spy()
    const inputSpy = sinon.spy()
    const keydownSpy = sinon.spy()
    const value = 'value'

    class App extends React.Component {
      state = {
        value: ''
      }

      render () {
        return (
          <Input
            ref={ref}
            onFocus={(e) => {
              focusSpy(e.detail.value)
            }}
            maxLength={4}
            value={value}
            onBlur={(e) => blurSpy(e.detail.value)}
            onKeyDown={(e) => keydownSpy(e.detail.value)}
            onConfirm={() => confirm()}
            onInput={(e) => {
              inputSpy(e.detail.value)
            }}
          />
        )
      }
    }

    await mount(<App />, scratch)

    /**
     * @type {HTMLElement}
     */
    const node = ref.current

    await waitForChange(node)

    const input = $(node.children[0])

    input.focus()
    assert(focusSpy.calledOnce)
    assert(focusSpy.calledWith(value))

    input.blur()
    assert(blurSpy.calledOnce)
    assert(focusSpy.calledWith(value))

    simulant.fire(input[0], 'keydown')
    assert(keydownSpy.callCount === 1)
    assert(keydownSpy.calledWith(value))

    simulant.fire(input[0], 'keydown')
    assert(keydownSpy.callCount === 2)
    assert(keydownSpy.calledWith(value))
    assert(confirm.callCount === 0)

    simulant.fire(input[0], 'keydown', {
      keyCode: 13
    })
    assert(confirm.callCount === 1)
    simulant.fire(input[0], 'input', {
      data: 'a',
      inputType: 'insertText'
    })
    assert(inputSpy.callCount === 1)
  })
})
