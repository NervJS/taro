const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不支持在 switch 语句中使用 JSX'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'switch-jsx')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const jsxAttr = parents.find(p => p.type === 'SwitchCase' || p.type === 'SwitchStatement')
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
