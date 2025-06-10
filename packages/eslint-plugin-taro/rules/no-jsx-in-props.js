const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不允许在 JSX 参数(props)中传入 JSX 元素'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-jsx-in-props')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const jsxAttr = parents.find(p => p.type === 'JSXAttribute')
        if (jsxAttr) {
          context.report({
            message: ERROR_MESSAGE,
            node: jsxAttr
          })
        }
      }
    }
  }
}
