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
        let matchCallExpression = false
        let matchIfStatement = false
        let ifStatement = null

        // 想念 for..of 的第一天
        for (let index = 0; index < parents.length; index++) {
          const statement = parents[index]
          if (
            statement.type === 'CallExpression' &&
            statement.callee.type === 'MemberExpression' &&
            statement.callee.property.name === 'map'
          ) {
            matchCallExpression = true
          }
          if (statement.type === 'IfStatement') {
            matchIfStatement = true
            ifStatement = statement
          }
        }

        if (matchCallExpression && matchIfStatement) {
          context.report({
            message: ERROR_MESSAGE,
            node: ifStatement
          })
        }
      }
    }
  }
}
