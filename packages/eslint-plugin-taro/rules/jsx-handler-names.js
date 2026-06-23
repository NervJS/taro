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
