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

export const comment = (msg, url) => 'Taro comment: ' + msg + '.' + (url ? '[兼容写法参考](' + url + ')' : '')
/**
 * 在rule中删除指定declaration
 */
export const removeDeclaration = (declaration, rule) => rule.declarations.splice(rule.declarations.findIndex(v => v.property === declaration.property && v.value === declaration.value), 1)
/**
 * 在rule中增加一条declaration
 */
export const addDeclaration = (property, value, rule) => rule.declarations.push({
  type: 'declaration',
  property,
  value
})
/**
 * 在rule中增加一条comment
 */
export const addComment = (property, value, rule) => rule.declarations.push({
  type: 'comment',
  comment: `${property}:${value}; ${comment('unsupported style', 'https://doc.quickapp.cn/widgets/common-styles.html')}`
})

export const getDeclarationValue = (property, rule) => {
  const declarations = rule.declarations.filter(declaration => declaration.property === property)
  return (declarations.length && declarations[0]) || false
}
