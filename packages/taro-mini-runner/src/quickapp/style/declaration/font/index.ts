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
  'font-size': (value, declaration, _) => {
    if (~value.indexOf('inherit')) {
      return 'I:'
    }
    // 直接替换成px
    if (~value.indexOf('pt')) {
      declaration.value = declaration.value.replace('pt', 'px')
    }
  },
  'font-weight': (value, declaration, _) => {
    if (value === 400) {
      declaration.value = 'normal'
    } else if (value > 400) {
      declaration.value = 'bold'
    } else if (!['lighter', 'bold', 'bolder'].includes(value)) {
      return 'I:'
    }
  },
  'font-style': '',
  'font-family': 'I:',
  'font-variant': 'I:'
}
