module.exports = function pluginRemovePageConfig (babel) {
  const { types: t } = babel

  return {
    name: 'plugin:remove_pageconfig',
    visitor: {
      CallExpression (nodePath, state) {
        if (!/src/.test(state.filename)) return
        if (/\.config\.(t|j)sx?$/.test(state.filename)) return

        const { callee } = nodePath.node
        if (!t.isIdentifier(callee, { name: 'definePageConfig' })) return

        nodePath.remove()
      }
    }
  }
}
