const { DEFAULT_Components_SET } = require('../constant')
const { buildDocsMeta, isTaroComponent } = require('../utils/utils')

const ERROR_MESSAGE = '组件名不得与小程序内置组件名重复'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'class-naming')
  },

  create (context) {
    return {
      ClassDeclaration (node) {
        const id = node.id
        if (isTaroComponent(context, node) && id && DEFAULT_Components_SET.has(id.name)) {
          context.report({
            message: ERROR_MESSAGE,
            node: id
          })
        }
      }
    }
  }
}
