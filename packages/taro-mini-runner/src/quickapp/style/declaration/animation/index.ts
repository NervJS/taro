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

function setValue (index, value, addDeclaration) {
  const keyDate = ['animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count']
  const valueData = {
    'animation-duration': /^\d*\.?\d+(s|ms)$/,
    'animation-timing-function': /^(linear|ease|ease-in|ease-out|ease-in-out)$/,
    'animation-delay': /^\d*\.?\d+(s|ms)$/,
    'animation-iteration-count': /^(infinite|\d+)$/
  }
  if (valueData[keyDate[index]] && valueData[keyDate[index]].test(value)) {
    addDeclaration(keyDate[index], value)
  } else if (valueData[keyDate[1]].test(value)) {
    addDeclaration(keyDate[1], value)
  } else if (valueData[keyDate[3]].test(value)) {
    addDeclaration(keyDate[3], value)
  } else if (valueData[keyDate[0]].test(value)) {
    addDeclaration(keyDate[0], value)
  }
}

export default {
  animation: (value, declaration, addDeclaration) => {
    if (~value.indexOf('steps')) {
      value = value.replace(/steps.+end\)/, 'linear')
    }
    const list = value.split(/\s+/)
    addDeclaration('animation-name', list[0])
    for (let i = 1, len = list.length; i < len; i++) {
      setValue(i - 1, list[i], addDeclaration)
    }
    return 'I:'
  },
  'animation-name': '',
  'animation-duration': '',
  'animation-timing-function': (value, _declaration, _addDeclaration) => {
    const cont = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']
    if (~cont.indexOf(value)) {
      return ''
    }
    return 'I:'
  },
  'animation-delay': '',
  'animation-iteration-count': (value, _declaration, _addDeclaration) => {
    if (value === 'infinite') {
      return 'I:'
    }
    return ''
  },
  'animation-direction': 'I:',
  'animation-fill-mode': (value, _declaration, _addDeclaration) => {
    const list = ['none', 'forwards']
    if (~list.indexOf(value)) {
      return ''
    }
    return 'I:'
  }
}
