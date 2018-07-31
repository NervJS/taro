const { buildDocsMeta, isTaroComponent } = require('../utils/utils')

const NUMBER_ERROR = '方法名包含数字可能会在小程序中无法使用'
const UNDERSCOPE_ERROR = '方法名以下划线 `_` 开头或结尾可能在小程序无法使用'
const LENGTH_ERROR = '方法名的长度大于 20 可能在小程序中无法使用'

module.exports = {
  meta: {
    docs: buildDocsMeta('方法命名规范', 'no-function-number-literal')
  },

  create (context) {
    function examine (key) {
      if (/\d/g.test(key.name)) {
        context.report({
          message: NUMBER_ERROR,
          node: key
        })
      }
      if (key.name.startsWith('_') || key.name.endsWith('_')) {
        context.report({
          message: UNDERSCOPE_ERROR,
          node: key
        })
      }
      if (key.name.length >= 20) {
        context.report({
          message: LENGTH_ERROR,
          node: key
        })
      }
    }

    return {
      MethodDefinition (node) {
        if (!isTaroComponent(context, node)) {
          return
        }
        const key = node.key
        if (key.type === 'Identifier') {
          examine(key)
        }
      },
      ClassProperty (node) {
        if (!isTaroComponent(context, node)) {
          return
        }
        const key = node.key
        const value = node.value
        if (
          key.type === 'Identifier' &&
          (value.type === 'ArrowFunctionExpression' || value.type === 'FunctionExpression')
        ) {
          examine(key)
        }
      }
    }
  }
}
