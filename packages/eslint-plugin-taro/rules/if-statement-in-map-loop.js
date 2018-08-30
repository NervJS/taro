const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能在包含 JSX 元素的 map 循环中使用 if 表达式'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'if-statement-in-map-loop')
  },

  create (context) {
    function isArrayMapCall (s) {
      return s && s.type === 'CallExpression' &&
        s.callee.type === 'MemberExpression' &&
        s.callee.property.name === 'map' &&
        Array.isArray(s.arguments) &&
        s.arguments[0].body &&
        s.arguments[0].body.type === 'BlockStatement'
    }
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const callExpr = parents.find(isArrayMapCall)
        if (!callExpr) {
          return
        }
        const ifStatement = parents.find(p => p.type === 'IfStatement')
        if (ifStatement) {
          const hasCallExpr = context.getAncestors(ifStatement).find(isArrayMapCall)
          if (hasCallExpr) {
            context.report({
              message: ERROR_MESSAGE,
              node: ifStatement
            })
          }
        }
      }
    }
  }
}
