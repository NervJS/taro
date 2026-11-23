import { recursiveMerge } from '@tarojs/helper'

import postcssAlias from './postcss-alias'

import type { Func, IHtmlTransformOption, IPostcssOption } from '@tarojs/taro/types/compile'

export { getPostcssPlugins } from './postcss-plugins'

const defaultAutoprefixerOption = {
  enable: true,
  config: {
    flexbox: 'no-2009'
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

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  postcssOption = {} as IPostcssOption<'mini'>,
  alias = {}
}): [string, any, Func?][] {
  const platform = process.env.TARO_ENV
  const { autoprefixer, pxtransform, htmltransform, ...options } = postcssOption

  const basePxOption: Record<string, any> = {
    enable: true,
    config: {
      platform
    }
  }
  const baseHtmlOption: IHtmlTransformOption = {
    enable: false,
    config: {
      platform,
      removeCursorStyle: true
    }
  }

  if (designWidth) {
    basePxOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    basePxOption.config.deviceRatio = deviceRatio
  }

  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge({}, basePxOption, pxtransform)
  const htmltransformOption: IHtmlTransformOption = recursiveMerge({}, baseHtmlOption, htmltransform)

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
