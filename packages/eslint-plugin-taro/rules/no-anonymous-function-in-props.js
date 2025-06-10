const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能在 JSX 参数中使用匿名函数'

function isArrayMapCall (s) {
  return s && s.type === 'CallExpression' &&
    s.callee.type === 'MemberExpression' &&
    s.callee.property.name === 'map' &&
    Array.isArray(s.arguments) &&
    s.arguments.length > 0 &&
    s.arguments[0].body &&
    s.arguments[0].body.type === 'BlockStatement'
}

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-anonymous-function-in-props')
  },

  create (context) {
    const sourceCode = context.getSourceCode()
    const parentIsJSXAttribute = (node) => {
      const parents = sourceCode.getAncestors(node)
      const jsxAttr = parents.find(p => p.type === 'JSXAttribute')
      if (jsxAttr && jsxAttr.name.name !== 'ref' && !isArrayMapCall(node.parent)) {
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
