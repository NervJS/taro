import { recursiveMerge } from '@tarojs/helper'

import postcssAlias from './postcss-alias'
import { createGetPostcssPlugins } from './postcss-plugins'

import type { Func, IHtmlTransformOption, IPostcssOption } from '@tarojs/taro/types/compile'

const platform = process.env.TARO_ENV
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

  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }

  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, pxtransform)
  const htmltransformOption: IHtmlTransformOption = recursiveMerge({}, defaultHtmltransformOption, htmltransform)

  return [
    ['postcss-import', {}, require('postcss-import')],
    ['autoprefixer', autoprefixerOption, require('autoprefixer')],
    ['postcss-pxtransform', pxtransformOption, require('postcss-pxtransform')],
    ['postcss-alias', { config: { alias } }, postcssAlias],
    ['postcss-url', { ...defaultUrlOption, ...(options?.url || {}) }, require('postcss-url')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ...Object.entries(options)
  ]
}

export const getPostcssPlugins = createGetPostcssPlugins(pluginName => `缺少postcss插件${pluginName}, 已忽略`)
