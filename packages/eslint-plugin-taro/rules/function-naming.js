const { buildDocsMeta, isTaroComponent } = require('../utils/utils')

const NUMBER_ERROR = '方法名包含数字可能会在小程序中无法使用'
const UNDERSCOPE_ERROR = '方法名以下划线 `_` 开头或结尾可能在小程序无法使用'
const LENGTH_ERROR = '方法名的长度大于 22 可能在小程序中无法使用'

const lifeCycles = new Set([
  'shouldComponentUpdate',
  'getDerivedStateFromProps',
  'getSnapshotBeforeUpdate',
  'componentWillReceiveProps',
  'componentDidCatchError',
  'componentDidNotFound',
  'componentDidCatch'
])

module.exports = {
  meta: {
    docs: buildDocsMeta('方法命名规范', 'function-naming')
  },

  create (context) {
    function examine (key) {
      if (lifeCycles.has(key.name)) {
        return
      }
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
      if (key.name.length >= 22) {
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
          value &&
          (value.type === 'ArrowFunctionExpression' || value.type === 'FunctionExpression')
        ) {
          examine(key)
        }
      }
    }
  }
}
