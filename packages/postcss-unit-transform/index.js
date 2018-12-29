const postcss = require('postcss')

module.exports = postcss.plugin('postcss-taro-unit-transform', plugin)

function plugin (opts) {
  return function (root) {
    root.walkDecls(function (decl) {
      let value = decl.value
      value = value.replace(/([0-9.]+)px/ig, function (match, size) {
        return (parseInt(size, 10) * 2) + 'px'
      }).replace(/([0-9.]+)rpx/ig, function (match, size) {
        return size + 'px'
      })
      decl.value = value
    })
  }
}
