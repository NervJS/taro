import { recursiveMerge } from '@tarojs/helper'

import type { Func, IHtmlTransformOption, IPostcssOption } from '@tarojs/taro/types/compile'

export { getPostcssPlugins } from '@tarojs/runner-utils/dist/bundler/postcss/postcss-plugins'

const platform = process.env.TARO_ENV
const defaultAutoprefixerOption = {
  enable: false,
  config: {
    flexbox: 'no-2009'
  }
}
const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform,
    methods: ['platform'],
  }
}

const defaultUrlOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    url: 'inline'
  }
}

const defaultHtmltransformOption: IHtmlTransformOption = {
  enable: false,
  config: {
    platform,
    removeCursorStyle: true
  }
}

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  postcssOption = {} as IPostcssOption<'mini'>,
  alias = {}
}): [string, any, Func?][] {
  const { autoprefixer, pxtransform, htmltransform, ...options } = postcssOption
  const basePxOption = recursiveMerge({}, defaultPxtransformOption)

  if (designWidth) {
    basePxOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    basePxOption.config.deviceRatio = deviceRatio
  }

  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge({}, basePxOption, pxtransform)
  const htmltransformOption: IHtmlTransformOption = recursiveMerge({}, defaultHtmltransformOption, htmltransform)

  return [
    ['postcss-import', {}, require('postcss-import')],
    ['autoprefixer', autoprefixerOption, require('autoprefixer')],
    ['postcss-pxtransform', pxtransformOption, require('postcss-pxtransform')],
    ['postcss-alias', { config: { alias } }, require('./postcss-alias').default],
    ['postcss-url', defaultUrlOption, require('postcss-url')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ...Object.entries(options)
  ]
}
