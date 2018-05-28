const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能在 JSX 参数中使用匿名函数'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-spread-in-props')
  },

  create (context) {
    const parentIsJSXAttribute = (node) => {
      const parents = context.getAncestors(node)
      const jsxAttr = parents.find(p => p.type === 'JSXAttribute')
      if (jsxAttr) {
        context.report({
          message: ERROR_MESSAGE,
          node: jsxAttr
        })
      }
    }

    return {
      FunctionExpression: parentIsJSXAttribute,
      ArrowFunctionExpression: parentIsJSXAttribute
    }
  }
}
