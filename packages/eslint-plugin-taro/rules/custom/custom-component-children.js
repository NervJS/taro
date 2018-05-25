const { buildDocsMeta } = require('../../utils/utils')
// eslint-disable-next-line
const { DEFAULT_Components_SET } = require('../../components')

const ERROR_MESSAGE = '不能在自定义组件中写 children'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'custom-component-children')
  },

  create (context) {
    return {
      JSXElement (node) {
        const { name } = node
        if (
          DEFAULT_Components_SET.has(name) &&
          node.children
            .filter(children => children.type === 'JSXText' && children.value.trim() === '')
            .length > 0
        ) {
          context.report({
            message: ERROR_MESSAGE,
            node: node
          })
        }
      }
    }
  }
}
