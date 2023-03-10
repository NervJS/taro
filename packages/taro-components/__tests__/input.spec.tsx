/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { h } from '@stencil/core'
import { newSpecPage, SpecPage } from '@stencil/core/testing'

import { Input } from '../src/components/input/input'

describe('Input', () => {
  let page: SpecPage

  it('props', async () => {
    let maxLength = 10
    const disabled = false
    let value = ''
    const placeholder = 'placeholder'
    const autoFocus = true
    let type = 'text'
    const onFocus = jest.fn()

    page = await newSpecPage({
      components: [Input],
      template: () => (<taro-input-core
        maxlength={maxLength}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        type={type}
        autoFocus={autoFocus}
        onFocus={onFocus}
      />),
    })
    const input = page.root?.querySelector('input')
    expect(input?.classList.contains('weui-input')).toEqual(true)
    expect(input?.getAttribute('maxlength')).toEqual(maxLength.toString())
    expect(input?.getAttribute('placeholder')).toEqual(placeholder)
    expect(input?.type).toEqual(type)

    input?.focus()
    expect(onFocus).toHaveBeenCalledTimes(1)
    // assert($(input).is(':focus'))
    // assert(document.activeElement === input)

    value = 'test'
    type = 'password'
    maxLength = 4
    page.root?.setAttribute('value', value)
    page.root?.setAttribute('maxlength', maxLength.toString())
    page.root?.setAttribute('type', type)
    // @ts-ignore
    input.value = value
    input?.dispatchEvent(new Event('input'))
    await page.waitForChanges()

    expect(page.root?.getAttribute('value')).toEqual(value)
    expect(input?.type).toEqual(type)

    expect(page.root).toMatchSnapshot()
  })

  it('event', async () => {
    const maxLength = 4
    const value = 'value'
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const onKeyDown = jest.fn()
    const onConfirm = jest.fn()
    const onInput = jest.fn()
    page = await newSpecPage({
      components: [Input],
      template: () => (<taro-input-core
        maxlength={maxLength}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onConfirm={onConfirm}
        onInput={onInput}
      />),
    })
    const input = page.root?.querySelector('input')

    input?.focus()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocus.mock.calls[0][0].detail).toEqual({ value })

    input?.blur()
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(onBlur.mock.calls[0][0].detail).toEqual({ value })

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', keyCode: 46 }))
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown.mock.calls[0][0].detail).toEqual({ cursor: value.length, keyCode: 46, value })
    expect(onConfirm).toHaveBeenCalledTimes(0)

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', keyCode: 69 }))
    expect(onKeyDown).toHaveBeenCalledTimes(2)
    expect(onKeyDown.mock.calls[1][0].detail).toEqual({ cursor: value.length, keyCode: 69, value })
    expect(onConfirm).toHaveBeenCalledTimes(0)

    input?.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    const inputEvent = {
      data: 'a',
      inputType: 'insertText'
    }
    // @ts-ignore
    input?.dispatchEvent(new CustomEvent('input', inputEvent))
    expect(onInput).toHaveBeenCalledTimes(1)

    expect(page.root).toMatchSnapshot()
  })
})
