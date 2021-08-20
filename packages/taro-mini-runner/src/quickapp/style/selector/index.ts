/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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
