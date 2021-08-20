/*
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

const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能在包含 JSX 元素的 map 循环中使用 if 表达式'

function findParent (node, cb) {
  // eslint-disable-next-line
  while (node = node.parent) {
    if (cb(node)) return node
  }
  return null
}

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'if-statement-in-map-loop')
  },

  create (context) {
    function isArrayMapCall (s) {
      return s && s.type === 'CallExpression' &&
        s.callee.type === 'MemberExpression' &&
        s.callee.property.name === 'map' &&
        Array.isArray(s.arguments) &&
        s.arguments[0].body &&
        s.arguments[0].body.type === 'BlockStatement'
    }
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const callExpr = parents.find(isArrayMapCall)
        if (!callExpr) {
          return
        }
        const ifStatement = parents.find(p => p.type === 'IfStatement')
        if (ifStatement) {
          const hasCallExpr = findParent(ifStatement, isArrayMapCall)
          if (hasCallExpr) {
            context.report({
              message: ERROR_MESSAGE,
              node: ifStatement
            })
          }
        }
      }
    }
  }
}
