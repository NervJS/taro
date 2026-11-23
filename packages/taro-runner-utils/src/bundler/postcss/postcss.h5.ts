import { recursiveMerge } from '@tarojs/helper'

import postcssAlias from './postcss-alias'

import type { Func, IHtmlTransformOption, IPostcssOption, TogglableOptions } from '@tarojs/taro/types/compile'

export { getPostcssPlugins } from './postcss-plugins'

const platform = 'h5'
const defaultAutoprefixerOption = {
  enable: true,
  config: {
    flexbox: 'no-2009'
  }
}
const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform
  }
}
const defaultConstparseOption = {
  constants: [
    {
      key: 'taro-tabbar-height',
      val: '50PX'
    }
  ],
  platform
}
const defaultHtmltransformOption: IHtmlTransformOption = {
  enable: true,
  config: {
    platform,
    removeCursorStyle: false
  }
}
const defaultUrlOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    url: 'rebase'
  }
}

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  option = {} as IPostcssOption<'h5'>,
  alias = {}
}): [string, any, Func?][] {
  const { autoprefixer, pxtransform, htmltransform, url, ...options } = option
  const basePxOption = recursiveMerge({}, defaultPxtransformOption)
  if (designWidth) {
    basePxOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    basePxOption.config.deviceRatio = deviceRatio
  }
  const autoprefixerOption = recursiveMerge<TogglableOptions>({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge<TogglableOptions>({}, basePxOption, pxtransform)
  const htmltransformOption: IHtmlTransformOption = recursiveMerge({}, defaultHtmltransformOption, htmltransform)
  const urlOption = recursiveMerge({}, defaultUrlOption, url)

  return [
    ['postcss-import', {}, require('postcss-import')],
    ['autoprefixer', autoprefixerOption, require('autoprefixer')],
    ['postcss-pxtransform', pxtransformOption, require('postcss-pxtransform')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ['postcss-plugin-constparse', defaultConstparseOption, require('postcss-plugin-constparse')],
    ['postcss-alias', { config: { alias } }, postcssAlias],
    ['postcss-url', urlOption, require('postcss-url')],
    ...Object.entries(options)
  ]
}
