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
