const autoprefixer = require('autoprefixer')
const pxtransform = require('postcss-pxtransform')
const constparse = require('postcss-plugin-constparse')
const { isEmptyObject } = require('../util')

const defaultAutoprefixerConf = {
  browsers: [
    'Android >= 4',
    'iOS >= 6'
  ],
  flexbox: 'no-2009'
}

const plugins = []

exports.getPostcssPlugins = function (config) {
  const designWidth = config.designWidth || 750
  const useModuleConf = config.module || {}
  const customPostcssConf = useModuleConf.postcss || {}
  const customAutoprefixerConf = customPostcssConf.autoprefixer || {}
  const customPxtransformConf = customPostcssConf.pxtransform || {}
  const customPlugins = customPostcssConf.plugins || []
  if (isEmptyObject(customAutoprefixerConf) || customAutoprefixerConf.enable) {
    plugins.push(autoprefixer(Object.assign({}, defaultAutoprefixerConf, customAutoprefixerConf)))
  }

  plugins.push(pxtransform(Object.assign({}, customPxtransformConf, {
    designWidth,
    platform: 'h5'
  })))

  plugins.push(constparse({
    constants: [{
      key: 'taro-tabbar-height',
      val: '50PX'
    }],
    platform: 'h5'
  }))

  return plugins.concat(customPlugins)
}
