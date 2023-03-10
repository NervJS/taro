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

import { omit, dismemberStyle, parseStyles } from '../utils'

describe('Utils', () => {
  describe('omit should works well', () => {
    it('functional test', () => {
      const obj = { a: 'miao', b: 'miao2', c: 'miao3' }
      expect(omit(obj, ['a'])).not.toHaveProperty('a')
    })

    it('default parameter', () => {
      expect(omit()).toEqual({})
    })
  })

  describe('dismemberStyle should works well', () => {
    it('functional test', () => {
      const result = dismemberStyle({
        alignSelf: 'center',
        flex: 1,
        unknownProperty: 'unknownProperty'
      } as any)
      // @todo so much properties!!!
      expect(result).toHaveProperty('wrapperStyle.alignSelf')
      expect(result).toHaveProperty('innerStyle.flex')
      expect(result).toHaveProperty('innerStyle.unknownProperty')
    })

    it('default parameter', () => {
      expect(dismemberStyle()).toEqual({
        wrapperStyle: {},
        innerStyle: {}
      })
    })
  })

  describe('parseStyles should works well', () => {
    it('functional test', () => {
      const result = parseStyles('line-height: 60px; color: red;')
      expect(result).toEqual({
        lineHeight: '60px',
        color: 'red'
      })
    })

    it('default parameter', () => {
      expect(parseStyles()).toEqual({})
    })
  })
})
