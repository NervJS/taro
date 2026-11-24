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
    const readonly = true
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
        readonly={readonly}
      />),
    })
    const input = page.root?.querySelector('input')
    expect(input?.classList.contains('weui-input')).toEqual(true)
    expect(input?.getAttribute('maxlength')).toEqual(maxLength.toString())
    expect(input?.getAttribute('placeholder')).toEqual(placeholder)
    expect(input?.type).toEqual(type)
    expect(input?.getAttribute('readonly')).toEqual(readonly ? 'readonly' : undefined)

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

  describe('native input ref lifecycle', () => {
    beforeEach(async () => {
      page = await newSpecPage({
        components: [Input],
        html: '<taro-input-core value="initial"></taro-input-core>'
      })
    })

    it.each([undefined, null])('ignores value updates while the native ref is %s', ref => {
      Reflect.set(page.rootInstance, 'inputRef', ref)

      expect(() => page.rootInstance.watchValue('next')).not.toThrow()
    })

    it.each([undefined, null])('resolves focus while the native ref is %s', async ref => {
      Reflect.set(page.rootInstance, 'inputRef', ref)

      await expect(page.rootInstance.focus()).resolves.toBeUndefined()
    })

    it('renders the latest controlled value after the native ref becomes available', async () => {
      Reflect.set(page.rootInstance, 'inputRef', undefined)

      page.root!.value = 'updated before ref'
      await page.waitForChanges()

      expect(page.root!.querySelector('input')!.value).toBe('updated before ref')
      page.root!.value = 'updated after ref'
      await page.waitForChanges()
      expect(page.root!.querySelector('input')!.value).toBe('updated after ref')
    })

    it('normalizes nullish values and focuses an available native input', async () => {
      const input = page.root!.querySelector('input')!
      const focus = jest.spyOn(input, 'focus')

      page.rootInstance.watchValue(null)
      expect(input.value).toBe('')
      page.rootInstance.watchValue('non-empty')
      expect(input.value).toBe('non-empty')
      await page.rootInstance.focus()
      expect(focus).toHaveBeenCalledTimes(1)
    })
  })
})
