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

export default {
  color: (value) => {
    if (~value.indexOf('inherit')) {
      return 'I:'
    }
  },
  'line-height': '',
  'text-align': (value, declaration, addDeclaration) => {
    addDeclaration('align-items', 'center')
    addDeclaration('justify-content', 'center')
    if (~value.indexOf('justify')) {
      return 'I:'
    }
  },
  'text-decoration': (value) => {
    if (~['overline', 'blink'].indexOf(value)) {
      return 'I:'
    }
  },
  'text-overflow': (value) => {
    // 在设置了行数的情况下生效
    if (!value) {
      return 'I:'
    }
  },
  'white-space': 'I:',
  'word-wrap': 'I:',
  'word-break': 'I:',
  'text-align-last': 'I:',
  'line-clamp': (value, declaration, addDeclaration) => {
    if (value > 0) {
      addDeclaration('lines', value)
    }
    return 'I:'
  },
  lines: ''
}
