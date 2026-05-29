const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '暂不支持在 render() 之外的方法定义 JSX'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-jsx-in-class-method')
  },

  create (context) {
    const sourceCode = context.getSourceCode()

    return {
      JSXElement (node) {
        const parents = sourceCode.getAncestors(node)
        const classMethod = parents.find(p => (
          p.type === 'ClassMethod' ||
          p.type === 'ClassProperty' ||
          p.type === 'PropertyDefinition' ||
          p.type === 'MethodDefinition' ||
          p._babelType === 'ClassMethod') && p.key.name !== 'render'
        )
        if (classMethod) {
          context.report({
            message: ERROR_MESSAGE,
            node: classMethod
          })
        }
      }
    }
  }
}
