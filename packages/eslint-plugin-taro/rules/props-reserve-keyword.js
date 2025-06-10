const { DEFAULT_Components_SET } = require('../constant')
const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '在小程序是保留关键字，请使用其他 props 名'

const reserveKeyWords = new Set([
  'class',
  'id'
])

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'props-reserve-keyword')
  },

  create (context) {
    return {
      JSXAttribute (node) {
        if (node.parent.type !== 'JSXOpeningElement') {
          return
        }
        const componentName = node.parent.name.name
        if (DEFAULT_Components_SET.has(componentName)) {
          return
        }
        const propKey = typeof node.name === 'object' ? node.name.name : node.name
        if (reserveKeyWords.has(propKey)) {
          context.report({
            message: `\`${propKey}\`` + ERROR_MESSAGE,
            node
          })
        }
      }
    }
  }
}
