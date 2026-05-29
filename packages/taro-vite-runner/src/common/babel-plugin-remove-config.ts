import type * as BabelCore from '@babel/core'

export default (id = '') => {
  return function pluginRemovePageConfig (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> {
    const { types: t } = babel

    return {
      name: 'plugin:remove_pageconfig',
      visitor: {
        CallExpression (nodePath, state) {
          if (!/\.config\.(t|j)sx?$/.test(state.filename || id)) return

          const { callee } = nodePath.node
          if (!t.isIdentifier(callee)) return
          if (!['defineAppConfig', 'definePageConfig'].includes(callee.name)) return

          nodePath.remove()
        }
      }
    }
  }
}
