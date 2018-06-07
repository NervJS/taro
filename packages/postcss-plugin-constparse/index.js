const postcss = require('postcss')

module.exports = postcss.plugin('postcss-plugin-constparse', plugin)

function plugin (opts) {
  opts = opts || {
    constants: [{
      key: 'taro-tabbar-height',
      val: '50PX'
    }]
  }
  return function (root) {
    root.walkDecls(function (decl) {
      let value = decl.value
      opts.constants.forEach(item => {
        value = value.replace(new RegExp(item.key, 'g'), item.val)
      })
      decl.value = value
    })
  }
}
