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
