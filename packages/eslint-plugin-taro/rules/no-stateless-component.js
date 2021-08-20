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

const ERROR_MESSAGE = '暂不支持无状态组件（stateless component）'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-stateless-component')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const funcDecl = parents.find(p => p.type === 'FunctionDeclaration')
        if (parents.some(p => p.type === 'JSXElement')) {
          return
        }
        if (funcDecl) {
          context.report({
            message: ERROR_MESSAGE,
            node: funcDecl
          })
        }

        const funcExpression = parents.find(p => p.type === 'ArrowFunctionExpression' || p.type === 'FunctionExpression')

        if (funcExpression && funcExpression.parent.type !== 'MethodDefinition') {
          const arrowFuncParents = context.getAncestors(funcExpression)
          const isMapCallExpr = arrowFuncParents.some(p =>
            p.type === 'CallExpression' &&
            p.callee.type === 'MemberExpression' &&
            p.callee.property.type === 'Identifier' &&
            p.callee.property.name === 'map'
          )
          // console.log(mapCallExpr, 'mapCallExpr')
          const varDecl = arrowFuncParents.some(p => p.type === 'VariableDeclaration')
          if (varDecl && !isMapCallExpr) {
            context.report({
              message: ERROR_MESSAGE,
              node: funcExpression
            })
          }
        }
      }
    }
  }
}
