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
