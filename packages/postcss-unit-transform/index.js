function plugin () {
  return {
    postcssPlugin: 'postcss-taro-unit-transform',
    Once (root) {
      root.walkDecls(decl => {
        let value = decl.value
        value = value.replace(/\b-?(\d+(\.\d+)?)px\b/ig, function (_match, size) {
          return Number(size) === 0 ? '0px' : parseFloat(size) * 2 + 'px'
        }).replace(/\b-?(\d+(\.\d+)?)rpx\b/ig, function (_match, size) {
          return size + 'px'
        })
        decl.value = value
      })
    }
  }
}
plugin.postcss = true

module.exports = plugin
