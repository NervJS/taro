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

const ERROR_MESSAGE = 'JSX 事件名需以 `on` 命名'

module.exports = {
  meta: {
    docs: {
      url: buildDocsMeta(ERROR_MESSAGE, 'jsx-handler-names')
    }
  },

  create (context) {
    const sourceCode = context.getSourceCode()

    const eventHandlerPropPrefix = 'on'

    const PROP_EVENT_HANDLER_REGEX = new RegExp(`^(${eventHandlerPropPrefix}[A-Z].*|ref)$`)

    return {
      JSXAttribute (node) {
        if (!node.value || !node.value.expression || !node.value.expression.object) {
          return
        }

        const propKey = typeof node.name === 'object' ? node.name.name : node.name
        const source = sourceCode.getText(node.value.expression)

        if (propKey === 'key') {
          return
        }

        const propIsEventHandler = PROP_EVENT_HANDLER_REGEX.test(propKey)
        const isPropValueFunction = source.startsWith('this.props.on') ||
          (
            source.startsWith('this.') &&
            !['this.state.', 'this.props.', 'this.$router.', 'this.config'].some(v => source.startsWith(v))
          )

        if (!propIsEventHandler && isPropValueFunction) {
          context.report({
            node,
            message: ERROR_MESSAGE
          })
        }
      }
    }
  }
}
