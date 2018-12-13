const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '从 this.props 而来的函数名必须要以 `on` 开头'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'this-props-function')
  },

  create (context) {
    return {
      CallExpression (node) {
        if (node.callee.type === 'MemberExpression') {
          const { object, property } = node.callee
          if (
            object.type === 'MemberExpression' &&
            object.object.type === 'ThisExpression' &&
            object.property.name === 'props' &&
            property.type === 'Identifier' &&
            !/^(on|dispatch)[A-Z_]/.test(property.name) &&
            property.name !== 'dispatch'
          ) {
            context.report({
              message: '从 this.props 而来的函数名必须要以 `on` 或 `dispatch` 开头',
              node
            })
          }
        }
      }
    }
  }
}
