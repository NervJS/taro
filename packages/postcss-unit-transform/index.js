const postcss = require('postcss')

module.exports = postcss.plugin('postcss-taro-unit-transform', plugin)

function plugin (opts) {
  return function (root) {
    root.walkDecls(function (decl) {
      let value = decl.value
      value = value.replace(/\b-?(\d+(\.\d+)?)px\b/ig, function (match, size) {
        return Number(size) === 0 ? '0px': parseFloat(size) * 2 + 'px'
      }).replace(/\b-?(\d+(\.\d+)?)rpx\b/ig, function (match, size) {
        return size + 'px'
      })
      decl.value = value
    })
  }
}
