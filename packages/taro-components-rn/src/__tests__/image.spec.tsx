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
import ClickableImage from '../components/Image'

describe('<Image />', () => {
  it('should Image have src attribute', () => {
    const src = 'https://alo'
    const { getByTestId } = render(<ClickableImage src={src} />)
    const image = getByTestId('image')
    expect(image).toBeTruthy()
    expect(image).toHaveProp('source', { uri: src })
  })

  it('simulates onError events', () => {
    const onError = jest.fn()
    const { getByTestId } = render(
      <ClickableImage
        src='https://alo'
        onError={onError}
      />
    )
    const image = getByTestId('image')
    fireEvent(image, 'Error')
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('simulates onLoad events of local image', () => {
    const onLoad = jest.fn()
    const { getByTestId } = render(
      <ClickableImage
        src={require('./1x1.png')}
        onLoad={onLoad}
      />
    )
    const image = getByTestId('image')
    fireEvent(image, 'Load')
    expect(onLoad).toHaveBeenCalled()
  })
})
