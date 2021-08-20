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


const comment = (msg, url) => 'Taro comment: ' + msg + '.' + (url ? '[兼容写法参考](' + url + ')' : '')

// 注释子组件
export const addComment = (childNode, url) => `<!--${comment('unsupported subcomponent', url)}${childNode}-->`

export const uniqTypeof = (name: string) => {
  const typeMap = {
    '[object Boolean]': 'boolean',
    '[object String]': 'string',
    '[object Number]': 'number',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Null]': 'null',
    '[object Undefined]': 'undefined',
    '[object Symbol]': 'symbol',
    '[object Object]': 'object'
  }
  return typeMap[Object.prototype.toString.call(name)]
}
