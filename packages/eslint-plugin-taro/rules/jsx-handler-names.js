const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = 'JSX 事件名需以 `on` 命名'

module.exports = {
  meta: {
    docs: {
      url: buildDocsMeta(ERROR_MESSAGE, 'jsx-handler-names')
    }
  },

  create (context) {
    const eventHandlerPropPrefix = 'on'

    const PROP_EVENT_HANDLER_REGEX = new RegExp(`^(${eventHandlerPropPrefix}[A-Z].*|ref)$`)

    return {
      JSXAttribute (node) {
        if (!node.value || !node.value.expression || !node.value.expression.object) {
          return
        }

        const propKey = typeof node.name === 'object' ? node.name.name : node.name

        if (propKey === 'ref') {
          return
        }

        const propIsEventHandler = PROP_EVENT_HANDLER_REGEX.test(propKey)

        if (propIsEventHandler) {
          context.report({
            node: node,
            message: ERROR_MESSAGE
          })
        }
      }
    }
  }
}
