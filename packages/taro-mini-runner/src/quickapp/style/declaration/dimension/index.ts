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
  height: (value, declaration, addDeclaration) => {
    if (~value.indexOf('auto') || ~value.indexOf('inherit')) {
      addDeclaration('display', 'flex') // 部分应用利用height:0,height:auto来实现隐藏,显示
      //    addDeclaration('flex-direction', 'row')
      return 'I:'
    }
    if (parseInt(value) === 0) {
      addDeclaration('display', 'none') // 部分应用利用height:0,height:auto来实现隐藏,显示
      return 'I:'
    }
    return ''
  },
  'max-height': 'I:',
  'max-width': 'I:',
  'min-height': 'I:',
  'min-width': 'I:',
  width: (value, declaration, addDeclaration) => {
    if (~value.indexOf('auto') || ~value.indexOf('inherit')) {
      addDeclaration('display', 'flex') // 部分应用利用height:0,height:auto来实现隐藏,显示
      //    addDeclaration('flex-direction', 'row')
      return 'I:'
    }
    if (parseInt(value, 10) === 0) {
      addDeclaration('display', 'none') // 部分应用利用height:0,height:auto来实现隐藏,显示
      return 'I:'
    }
    return ''
  }
}
