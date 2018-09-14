import * as autoprefixer from 'autoprefixer';
import * as constparse from 'postcss-plugin-constparse';
import * as pxtransform from 'postcss-pxtransform';

import { PostcssOption } from '../util/types';

const defaultAutoprefixerOption = {
  browsers: [
    'Android >= 4',
    'iOS >= 6'
  ],
  flexbox: 'no-2009'
}
const defaultPxtransformOption: any = {
  platform: 'h5'
}

const defaultConstparseOption = {
  constants: [{
    key: 'taro-tabbar-height',
    val: '50PX'
  }],
  platform: 'h5'
}

const plugins = [] as any[]

export const getPostcssPlugins = function ({
  designWidth,
  deviceRatio,
  postcssOption = {} as PostcssOption
}) {
  const isAutoprefixerEnabled = (postcssOption.autoprefixer && postcssOption.autoprefixer.enable === false)
    ? false
    : true
  const isPxtransformEnabled = (postcssOption.pxtransform && postcssOption.pxtransform.enable === false)
    ? false
    : true
  const customPlugins = postcssOption.plugins || []

  if (isAutoprefixerEnabled) {
    const customAutoprefixerOption = postcssOption.autoprefixer ? postcssOption.autoprefixer.config : {}
    plugins.push(autoprefixer(Object.assign(defaultAutoprefixerOption, customAutoprefixerOption) as autoprefixer.Options))
  }

  if (isPxtransformEnabled) {
    const customPxtransformOption = postcssOption.pxtransform ? postcssOption.pxtransform.config : {}

    if (designWidth) {
      defaultPxtransformOption.designWidth = designWidth
    }
  
    if (deviceRatio) {
      defaultPxtransformOption.deviceRatio = deviceRatio
    }
    plugins.push(pxtransform(Object.assign(defaultPxtransformOption, customPxtransformOption)))
  }

  plugins.push(constparse(defaultConstparseOption))

  return plugins.concat(customPlugins)
}
