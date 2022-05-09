import * as assert from 'assert'
import React from 'react'
import simulant from 'simulant'
import * as sinon from 'sinon'

import { Textarea } from '../h5/react'
import { mount } from './test-tools'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const h = React.createElement

describe('Textarea', () => {
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
    const onFocus = sinon.spy()
    const wrapper = await mount(<Textarea autoFocus onFocus={onFocus} />, scratch)
    const { node } = wrapper
    const textarea = wrapper.find('textarea')

    assert(node.value === '')
    assert(textarea.value === '')
    assert(textarea.getAttribute('placeholder') === null)
    assert(textarea.getAttribute('maxlength') === '140')
    assert(textarea.getAttribute('rows') === null)

    const value = 'taro'
    const placeholder = 'type sth...'
    const maxlength = 10
    const autoHeight = true

    await wrapper.setProps({
      value,
      placeholder,
      maxlength,
      autoHeight
    })

    assert(node.value === value)
    assert(textarea.value === value)
    assert(textarea.getAttribute('placeholder') === placeholder)
    assert(textarea.getAttribute('maxlength') === String(maxlength))
    assert(onFocus.callCount === 1)
    assert(textarea.getAttribute('rows') === '1')
  })

  it('events', async () => {
    const onInput = sinon.spy()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    const onLineChange = sinon.spy()
    let value = 'taro'

    const app = (
      <Textarea
        value={value}
        onInput={e => onInput(e.detail.value)}
        onFocus={e => onFocus(e.detail.value)}
        onBlur={e => onBlur(e.detail.value)}
        onLineChange={e => onLineChange(e.detail.value)}
      />
    )

    const wrapper = await mount(app, scratch)
    const textarea = wrapper.find('textarea')

    textarea.focus()
    assert(onFocus.calledOnceWith(value) === true)

    value = 'taroa'
    textarea.value = value
    simulant.fire(textarea, 'input', {
      data: 'a',
      inputType: 'insertText'
    })
    assert(onInput.calledOnceWith(value) === true)

    textarea.blur()
    assert(onBlur.calledOnceWith(value) === true)

    value = 'tarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotarotaro'
    textarea.value = value
    simulant.fire(textarea, 'input', {
      data: 'a',
      inputType: 'insertText'
    })
    assert(onLineChange.callCount === 1)
  })
})
