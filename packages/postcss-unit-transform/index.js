const postcss = require('postcss')

module.exports = postcss.plugin('postcss-taro-unit-transform', plugin)

function plugin (opts) {
  return function (root) {
    root.walkDecls(function (decl) {
      let value = decl.value
      value = value.replace(/\b-?(\d+(\.\d+)?)px\b/ig, function (match, size) {
        // 绝对值<1的非0数值转十进制后会被转成0,赋值为1
        return Number(size) === 0 ? '0px': parseInt(size, 10) !== 0? (parseInt(size, 10) * 2) + 'px': '1px'
      }).replace(/\b-?(\d+(\.\d+)?)rpx\b/ig, function (match, size) {
        return size + 'px'
      })
      decl.value = value
    })
  }
}
