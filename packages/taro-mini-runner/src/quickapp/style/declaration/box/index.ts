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
  'box-sizing': 'I:',
  'box-flex': 'I:',
  'box-align': 'I:',
  'box-orient': (value, declaration, addDeclaration) => {
    const boxOrient = {
      horizontal: 'row',
      vertical: 'row-reverse',
      'inline-axis': 'row',
      'block-axis': 'row-reverse',
      inherit: ''
    }
    if (value === 'inherit') {
      return 'I:'
    }
    // flex-direction 不支持 row-reverse
    if (!~boxOrient[value].indexOf('row-reverse')) {
      addDeclaration('flex-direction', boxOrient[value])
    }
    return 'I:'
  },
  float: 'E:',
  content: 'I:',
  overflow: 'I:',
  'overflow-x': 'I:',
  'overflow-y': 'I:',
  'overflow-scrolling': 'I:'
}
