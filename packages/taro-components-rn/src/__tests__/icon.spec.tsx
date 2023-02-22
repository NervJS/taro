/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team
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
import { Platform } from 'react-native'
import { render } from '@testing-library/react-native'
import Icon from '../components/Icon'

describe('<Icon />', () => {
  describe('ios & android', () => {
    Platform.OS = 'ios'

    const TestedIcon = (<Icon type='success' size={50} />)

    it('simple structure check', () => {
      const { getByTestId } = render(TestedIcon)
      const image = getByTestId('image')
      expect(image).toHaveStyle({
        width: 50,
        height: 50,
      })
    })

    it('specific color', () => {
      const { getByTestId } = render(<Icon type="success" color="red" />)
      const image = getByTestId('image')
      expect(image).toHaveStyle({
        tintColor: 'red'
      })
    })

    it('invalid prop value check', () => {
      // @ts-ignore
      const { getByTestId } = render(<Icon type='miao' />)
      expect(() => getByTestId('image')).toThrow(
        'Unable to find an element with testID: image'
      )
    })
  })
})
