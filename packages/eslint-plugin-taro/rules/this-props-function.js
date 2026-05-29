const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '从 this.props 而来的函数名必须要以 `on` 或 `dispatch` 或 `render` 开头。详情：https://nervjs.github.io/taro/docs/event.html#%E4%BB%BB%E4%BD%95%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%BC%A0%E9%80%92%E9%83%BD%E8%A6%81%E4%BB%A5-on-%E5%BC%80%E5%A4%B4'

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
            property.name !== 'dispatch' &&
            !/^render[A-Z]/.test(property.name)
          ) {
            context.report({
              message: ERROR_MESSAGE,
              node
            })
          }
        }
      }
    }
  }
}
