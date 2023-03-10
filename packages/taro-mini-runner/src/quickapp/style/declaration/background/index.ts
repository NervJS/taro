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
  background: (value, declaration, addDeclaration) => {
    if (~value.indexOf('linear-gradient')) { // 线性
      // 按照指定方向渐变时，必须有to在direction前。
      const DIR_REG = /linear-gradient\((top|right|bottom|left)/
      const ret = value.match(DIR_REG)
      if (ret) {
        declaration.value = value.replace(DIR_REG, 'linear-gradient(to ' + ret[1])
      }
      return ''
    }
    const values = value.split(' ')
    if (~values[0].indexOf('url')) {
      addDeclaration('background-image', value)
    } else {
      // 颜色值为transparent时忽略
      if (!~value.indexOf('transparent')) {
        addDeclaration('background-color', value)
      }
    }
    return 'I:'
  },
  'background-color': (value, _, __) => {
    if (~value.indexOf('transparent')) {
      return 'I:'
    }
  },
  'background-image': '',
  'background-size': '',
  'background-repeat': '',
  'background-attachment': 'I:',
  'background-position': '',
  'background-origin': 'I:',
  'background-clip': 'I:'
}
