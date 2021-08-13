const postcss = require('postcss')

module.exports = postcss.plugin('postcss-plugin-constparse', plugin)

const PLATFORM = {
  WEAPP: 'weapp',
  H5: 'h5'
}

function plugin (opts) {
  opts = Object.assign({
    constants: [{
      key: 'taro-tabbar-height',
      val: '50PX'
    }]
  }, opts)
  return function (root) {
    // 在小程序下会忽略
    if (opts.platform === PLATFORM.WEAPP) return
    root.walkDecls(function (decl) {
      let value = decl.value
      opts.constants.forEach(item => {
        value = value.replace(new RegExp(item.key, 'g'), item.val)
      })
      decl.value = value
    })
  }
}
