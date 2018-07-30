const { buildDocsMeta, isTaroComponent } = require('../utils/utils')

function createErrorMsg (name, type) {
  return `${name} 是 Taro 的内部保留${type}，请改变变量名`
}

const RESERVE_PROPERIES = new Set([
  '$components',
  '$$components',
  '$routers',
  '$path',
  '$name',
  '$isComponent',
  'nextProps',
  '_dirty',
  '_disable',
  '_pendingStates',
  '_pendingCallbacks',
  '$parent',
  '$data',
  '$app',
  'defaultData'
])

const RESERVE_METHODS = new Set([
  '_init',
  '_initData',
  '_createData'
])

module.exports = {
  meta: {
    docs: buildDocsMeta('内部保留属性/方法', 'no-stateless-component')
  },

  create (context) {
    return {
      MethodDefinition (node) {
        if (!isTaroComponent(context, node)) {
          return
        }
        const name = node.key.name
        if (RESERVE_METHODS.has(name)) {
          context.report({
            message: createErrorMsg(name, '方法'),
            node
          })
        }
      },
      ClassProperty (node) {
        if (!isTaroComponent(context, node)) {
          return
        }
        const name = node.key.name
        if (RESERVE_PROPERIES.has(name)) {
          context.report({
            message: createErrorMsg(name, '属性'),
            node
          })
        }
      }
    }
  }
}
