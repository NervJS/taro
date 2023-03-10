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

import * as cssWhat from 'css-what'
const simpleSelectorRegex = /^[.#]?[A-Za-z0-9_\-:]+$/
const compoundSelectorRegex = /^([.#]?[A-Za-z0-9_-]+(\s+|\s*>\s*))+([.#]?[A-Za-z0-9_\-:]+)$/
export default function rewriter (selector, rule, output) {
  if (!(simpleSelectorRegex.test(selector) || compoundSelectorRegex.test(selector))) {
    output.logs.push({
      reason: 'W:选择器`' + selector + '`不支持',
      line: rule.position.start.line,
      column: rule.position.start.column
    })
    return false
  }
  if (~selector.indexOf(':before') || ~selector.indexOf(':after') || ~selector.indexOf(':last-child') || ~selector.indexOf(':first-child')) {
    output.logs.push({
      reason: 'W:选择器`' + selector + '`不支持',
      line: rule.position.start.line,
      column: rule.position.start.column
    })
    return false
  }
  selector = cssWhat.parse(selector)[0].map(subselect => {
    if (subselect.type === 'descendant') {
      return ' '
    } else if (subselect.type === 'attribute') {
      if (subselect.name === 'class') {
        return '.' + subselect.value
      } else if (subselect.name === 'id') {
        return '#' + subselect.value
      }
    }
    return ''
  }).join('')
  return selector
}
