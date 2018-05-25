const { buildDocsMeta } = require('../../utils/utils')
// eslint-disable-next-line
const { DEFAULT_Components_SET } = require('../../components')

const ERROR_MESSAGE = '不能使用 Array#map 之外的方法操作 JSX 数组'

const ARRAY_METHODS = new Set([
  'concat',
  'copyWithin',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'flatMap',
  'forEach',
  'map',
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
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const callExpression = parents.find(p => p.type === 'CallExpression' && p.callee.type === 'MemberExpression')
        if (callExpression && ARRAY_METHODS.has(callExpression.callee.property.name)) {
          context.report({
            message: ERROR_MESSAGE,
            node: callExpression
          })
        }
      }
    }
  }
}
