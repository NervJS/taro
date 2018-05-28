const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '暂不支持在 render() 之外的方法定义 JSX'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-jsx-in-class-method')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const classMethod = parents.find(p => (
          p.type === 'ClassMethod' ||
          p.type === 'ClassProperty' ||
          p.type === 'MethodDefinition' ||
          p._babelType === 'ClassMethod')
        )
        if (classMethod && classMethod.key.name !== 'render') {
          context.report({
            message: ERROR_MESSAGE,
            node: classMethod
          })
        }
      }
    }
  }
}
