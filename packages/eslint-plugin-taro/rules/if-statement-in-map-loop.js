const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能在包含 JSX 元素的 map 循环中使用 if 表达式'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'if-statement-in-map-loop')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const ifStatement = parents.find(p => p.type === 'IfStatement')
        if (ifStatement) {
          const hasCallExpr = context.getAncestors(ifStatement).some(s => {
            return s.type === 'CallExpression' &&
            s.callee.type === 'MemberExpression' &&
            s.callee.property.name === 'map'
          })
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
