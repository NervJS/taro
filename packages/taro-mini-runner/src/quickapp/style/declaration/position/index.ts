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

import { getDeclarationValue } from '../../util'

function setValue (value, _) {
  const valueList = ['inherit', 'auto']
  if (~valueList.indexOf(value)) {
    return 'I:'
  }
  return ''
}

export default {
  bottom: (value, declaration, _) => {
    return setValue(value, declaration)
  },
  // 'display': '',
  display: (value, declaration, addDeclaration, rule) => {
    // 暂时忽略掉不支持的情况
    if (!~['flex', 'none'].indexOf(value)) {
      return 'E:'
    }
    if (value === 'flex') { // 因全局设置了flex-direction:column,故,当display:flex且未指定direction,还原为默认值row
      if (!getDeclarationValue('flex-direction', rule)) {
        addDeclaration('flex-direction', 'row')
      }
    }
  },
  left: (value, declaration, _) => {
    return setValue(value, declaration)
  },
  position: (value, declaration, _) => {
    if (value === 'static') {
      declaration.value = 'none'
    } else if (value === 'absolute' || value === 'relative') {
      // https://doc.quickapp.cn/widgets/common-styles.html?h=position
      return '' // E:
    } else if (value !== 'fixed') {
      return 'I:'
    }
  },
  right: (value, declaration, _) => {
    return setValue(value, declaration)
  },
  top: (value, declaration, _) => {
    return setValue(value, declaration)
  },
  overflow: 'I:',
  'vertical-align': 'I:',
  'z-index': 'I:'
}
