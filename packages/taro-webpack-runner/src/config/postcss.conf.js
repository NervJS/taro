const autoprefixer = require('autoprefixer')
const pxtransform = require('postcss-pxtransform')

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
  const customPlugins = customPostcssConf.plugins || []
  if (isEmptyObject(customAutoprefixerConf) || customAutoprefixerConf.enable) {
    plugins.push(autoprefixer(Object.assign({}, defaultAutoprefixerConf, customAutoprefixerConf)))
  }
  plugins.push(pxtransform({
    designWidth,
    platform: 'h5'
  }))
  return plugins.concat(customPlugins)
}
