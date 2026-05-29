const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能使用 Array#map 之外的方法操作 JSX 数组'
// 可以传值的数组方法
const ARRAY_METHODS_EXCEPT_MAP = new Set([
  'concat',
  'copyWithin',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'flatMap',
  'forEach',
  'pop',
  'push',
  'reduce',
  'reduceRight',
  'some',
  'shift',
  'unshift'
])

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'manipulate-jsx-as-array')
  },

  create (context) {
    const sourceCode = context.getSourceCode()

    return {
      JSXElement (node) {
        const parents = sourceCode.getAncestors(node)
        const callExpression = parents.find(p => p.type === 'CallExpression' && p.callee.type === 'MemberExpression')
        if (callExpression && ARRAY_METHODS_EXCEPT_MAP.has(callExpression.callee.property.name)) {
          context.report({
            message: ERROR_MESSAGE,
            node: callExpression
          })
        }
      }
    }
  }
}
