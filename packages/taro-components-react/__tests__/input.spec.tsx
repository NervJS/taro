import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Input from '../src/components/input'

type InputInstance = React.Component & {
  inputRef: HTMLInputElement | null | undefined
  componentDidMount: () => void
  componentWillUnmount: () => void
}

const InputClass = (Input as unknown as {
  render: (props: object, ref: null) => React.ReactElement
}).render({}, null).type as unknown as new (props: object) => InputInstance

describe('Input native ref lifecycle', () => {
  it.each([undefined, null])('safely unmounts a file input when its native ref is %s', ref => {
    const instance = new InputClass({ type: 'file' })
    instance.inputRef = ref

    expect(() => instance.componentWillUnmount()).not.toThrow()
  })

  it.each(['file', 'text'])('removes the %s input native listener when a ref is available', type => {
    const instance = new InputClass({ type })
    const input = document.createElement('input')
    const addListener = jest.spyOn(input, 'addEventListener')
    const removeListener = jest.spyOn(input, 'removeEventListener')
    instance.inputRef = input

    instance.componentDidMount()
    instance.componentWillUnmount()

    const event = type === 'file' ? 'change' : 'textInput'
    expect(addListener).toHaveBeenCalledWith(event, expect.any(Function))
    expect(removeListener).toHaveBeenCalledWith(event, addListener.mock.calls[0][1])
  })

  it('preserves controlled values and clears forwarded refs across form remounts', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container, rerender, unmount } = render(<Input ref={ref} value='personal' />)

    expect(container.querySelector('input')).toHaveValue('personal')
    expect(ref.current).toBe(container.querySelector('input'))
    rerender(<Input key='company' ref={ref} value='company' />)
    expect(container.querySelector('input')).toHaveValue('company')
    expect(ref.current).toBe(container.querySelector('input'))
    rerender(<Input key='company' ref={ref} value='' />)
    expect(container.querySelector('input')).toHaveValue('')
    unmount()
    expect(ref.current).toBeNull()
  })

  it('keeps Chinese composition input behavior unchanged', () => {
    const onInput = jest.fn()
    const { container } = render(<Input value='' onInput={onInput} />)
    const input = container.querySelector('input')!

    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: 'zhong' } })
    expect(onInput).not.toHaveBeenCalled()
    fireEvent.compositionEnd(input, { target: { value: '中' } })
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(onInput.mock.calls[0][0].detail.value).toBe('中')
  })
})
