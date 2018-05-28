const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '不能在 JSX 参数中使用对象展开符(Object spread)'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-spread-in-props')
  },

  create (context) {
    return {
      JSXSpreadAttribute (node) {
        context.report({
          message: ERROR_MESSAGE,
          node
        })
      }
    }
  }
}
