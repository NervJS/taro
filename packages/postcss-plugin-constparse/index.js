const PLATFORM = {
  WEAPP: 'weapp',
  H5: 'h5'
}

const postcssPluginConstparse = (opts = {}) => {
  opts = Object.assign({
    constants: [{
      key: 'taro-tabbar-height',
      val: '50PX'
    }]
  }, opts)

  return {
    postcssPlugin: 'postcss-plugin-constparse',
    Declaration (decl) {
      if (opts.platform === PLATFORM.WEAPP) return
      let value = decl.value
      opts.constants.forEach(item => {
        value = value.replace(new RegExp(item.key, 'g'), item.val)
      })
      decl.value = value
    }
  }
}

postcssPluginConstparse.postcss = true
export default postcssPluginConstparse
