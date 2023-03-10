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

import * as React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import Button from '../components/Button'

describe('<Button />', () => {
  it('render default', () => {
    const { getByTestId, getAllByText, getAllByA11yState } = render(<Button>BUTTON</Button>)
    expect(getAllByText('BUTTON')).toHaveLength(1)
    expect(() => getByTestId('loading')).toThrow(
      'Unable to find an element with testID: loading'
    )
    expect(getAllByA11yState({ disabled: false })).toHaveLength(1)
  })

  it('render loading button', () => {
    const { getByTestId, getByLabelText } = render(<Button loading />)
    expect(getByTestId('loading')).toHaveStyle({
      marginRight: 0
    })
    expect(getByLabelText('loading image')).toHaveProp('source', 1)
  })

  it('render loading & warn button with text', () => {
    const { getByTestId, getByLabelText } = render(<Button type='warn' loading >BUTTON</Button>)
    expect(getByTestId('loading')).toHaveStyle({
      marginRight: 5
    })
    expect(getByLabelText('loading image')).toHaveProp('source', 1)
  })

  it('disabled button', () => {
    const { getAllByA11yState } = render(<Button disabled />)
    expect(getAllByA11yState({ disabled: true })).toHaveLength(1)
  })

  it('mini size', () => {
    const { getByText, getByA11yState } = render(<Button size="mini">BUTTON</Button>)
    const text = getByText('BUTTON')
    const view = getByA11yState({ disabled: false })
    expect(view).toContainElement(text)
    expect(view).toHaveStyle({
      height: 30
    })
  })

  it('plain button', () => {
    const { getByA11yState } = render(<Button plain />)
    const view = getByA11yState({ disabled: false })
    expect(view).toHaveStyle({
      backgroundColor: 'transparent'
    })
  })

  it('plain and disabled button', () => {
    const { getByText } = render(<Button disabled plain>BUTTON</Button>)
    const text = getByText('BUTTON')
    expect(text).toHaveStyle({
      color: 'rgba(53,53,53,0.6)'
    })
  })

  it('type primary and disabled', () => {
    const { getByText } = render(<Button type="primary" disabled>BUTTON</Button>)
    const text = getByText('BUTTON')
    expect(text).toHaveStyle({
      color: 'rgba(255,255,255,0.6)'
    })
  })

  it('onClick', () => {
    const onClick = jest.fn()
    const { getByText } = render(<Button onClick={onClick}>BUTTON</Button>)
    fireEvent.press(getByText('BUTTON'))
    expect(onClick).toHaveBeenCalled()
  })
})
