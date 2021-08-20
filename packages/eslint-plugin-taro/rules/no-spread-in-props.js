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
// eslint-disable-next-line camelcase
const { DEFAULT_Components_SET } = require('../constant')

const ERROR_MESSAGE = '不能在 JSX 参数中使用对象展开符(Object spread)'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-spread-in-props')
  },

  create (context) {
    return {
      JSXSpreadAttribute (node) {
        const parents = context.getAncestors(node)
        const jsx = parents.find(p => p.type === 'JSXOpeningElement')
        if (jsx && jsx.name && jsx.name.name) {
          const componentName = jsx.name.name
          if (DEFAULT_Components_SET.has(componentName)) {
            context.report({
              message: ERROR_MESSAGE,
              node
            })
          }
        }
      }
    }
  }
}
