const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '定义 ref 在微信小程序不会起作用'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-ref')
  },

  create (context) {
    return {
      JSXAttribute (node) {
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'ref') {
          context.report({
            message: ERROR_MESSAGE,
            node
          })
        }
      }
    }
  }
}
