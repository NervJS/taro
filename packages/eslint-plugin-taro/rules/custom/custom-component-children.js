const { buildDocsMeta } = require('../../utils/utils')
// eslint-disable-next-line
const { DEFAULT_Components_SET } = require('../../components')

const ERROR_MESSAGE = '不能在自定义组件中写 children'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'custom-component-children')
  },

  create (context) {
    function isChildrenNotEmpty (children) {
      return !(
        (children.type === 'JSXText' || children.type === 'Literal') &&
        children.value.trim() === ''
      )
    }

    return {
      JSXElement (node) {
        const { name } = node.openingElement.name
        if (
          !DEFAULT_Components_SET.has(name) &&
          node.children
            .filter(isChildrenNotEmpty)
            .length > 0
        ) {
          context.report({
            message: ERROR_MESSAGE,
            node
          })
        }
      }
    }
  }
}
