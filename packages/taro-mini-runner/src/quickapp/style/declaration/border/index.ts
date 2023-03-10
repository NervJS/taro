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

function valueType (value) {
  const styles = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']
  // 需要考虑到0px简写为0的情况，否则会当作color处理。
  if (/px/ig.test(value) || parseInt(value, 10) === 0 || value === 'none') {
    return 'width'
  } else if (~styles.indexOf(value)) {
    return 'style'
  } else {
    return 'color'
  }
}

function setStyle (direction, value, addDeclaration) {
  const values = value.split(' ')
  for (let i = 0, length = values.length; i < length; i++) {
    const borderProperty = `border-${direction}-${valueType(values[i])}`
    if (values[i] === 'none') {
      values[i] = '0'
    }
    if (/\S+style$/.test(borderProperty)) {
      addDeclaration('border-style', values[i])
    } else {
      addDeclaration(borderProperty, values[i])
    }
  }
  return 'I:'
}

function setWidth (value, declaration) {
  const styles = ['thin', 'medium', 'thick', 'inherit']
  const values = ['1px', '2px', '3px', '1px']
  const valueList = value.split(' ')
  value = valueList[0]
  if (~styles.indexOf(value)) {
    const index = styles.indexOf(value)
    value = values[index]
  }
  if (~value.indexOf('%')) {
    value = 750 / 100 * parseInt(value, 10) + 'px'
  }
  declaration.value = value
}

export default {
  border: (value, declaration, _) => {
    if (value === 'none') {
      declaration.value = 0
    }
    return ''
  },
  'border-color': '',
  'border-style': '',
  'border-width': (value, declaration, _) => { // width也不支持百分数，后期在转换
    setWidth(value, declaration)
  },
  'border-radius': (value, declaration, _) => { // width也不支持百分数，后期在转换
    if (~value.indexOf('%')) {
      // 其实应当按照当前组件的宽高为基准计算，但这里拿不到，暂时这样处理下。
      value = 750 / 100 * parseInt(value, 10) + 'px'
      declaration.value = value
    }
  },
  'border-top': (value, declaration, addDeclaration) => {
    return setStyle('top', value, addDeclaration)
  },
  'border-bottom': (value, declaration, addDeclaration) => {
    return setStyle('bottom', value, addDeclaration)
  },
  'border-left': (value, declaration, addDeclaration) => {
    return setStyle('left', value, addDeclaration)
  },
  'border-right': (value, declaration, addDeclaration) => {
    return setStyle('right', value, addDeclaration)
  },
  'border-left-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-right-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-top-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-bottom-width': (value, declaration, _) => {
    setWidth(value, declaration)
  },
  'border-left-color': '',
  'border-right-color': '',
  'border-top-color': '',
  'border-bottom-color': '',
  'border-left-radius': '',
  'border-right-radius': '',
  'border-top-radius': '',
  'border-top-left-radius': '',
  'border-top-right-radius': '',
  'border-bottom-radius': '',
  'border-bottom-left-radius': '',
  'border-bottom-right-radius': '',
  'border-top-style': 'I:',
  'border-bottom-style': 'I:',
  'border-left-style': 'I:',
  'border-right-style': 'I:'
}
