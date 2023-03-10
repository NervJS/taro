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

export default {
  flex: (value, declaration, addDeclaration) => {
    const props = ['grow', 'shrink', 'basis']
    if (value.match(/\s+/g)) {
      const values = value.split(' ')
      values.forEach((item, index) => {
        // flex-basis的值不支持设置为auto，且只支持具体的数值，差异过大暂时忽略。
        if (props[index] !== 'basis') {
          addDeclaration('flex-' + props[index], item)
        }
      })
      return 'I:'
    } else if (value === 'auto') {
      return 'I:'
    } else {
      return ''
    }
  },
  'flex-grow': '',
  'flex-shrink': '',
  'flex-basis': 'I:',
  'flex-direction': (value, _, __) => {
    if (~value.indexOf('row-reverse')) {
      return 'I:'
    }
  },
  'flex-wrap': '',
  'justify-content': (value, declaration, __) => {
    const content = ['flex-start', 'flex-end', 'center', 'space-between']
    if (value === 'space-around') {
      declaration.value = 'space-between'
      return ''
    }
    if (~content.indexOf(value)) { // justify-content:space-around
      return ''
    }
    return 'I:'
  },
  'align-items': '',
  'align-content': ''
}
