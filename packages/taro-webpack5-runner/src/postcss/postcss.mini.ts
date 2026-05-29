import path from 'node:path'

import { isNpmPkg, recursiveMerge, resolveSync } from '@tarojs/helper'

import type { Func, IHtmlTransformOption, IPostcssOption, TogglableOptions } from '@tarojs/taro/types/compile'

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

const plugins = [] as any[]

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
    ['postcss-alias', { config: { alias } }, require('./postcss-alias').default],
    ['postcss-url', { ...defaultUrlOption, ...(options?.url || {}) }, require('postcss-url')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ...Object.entries(options)
  ]
}

export const getPostcssPlugins = function (appPath: string, option: [string, TogglableOptions<Record<string, unknown>>, Func?][] = []) {
  option.forEach(([pluginName, pluginOption, pluginPkg]) => {
    if (!pluginOption || ['cssModules', 'url'].includes(pluginName)) return
    if (Object.hasOwnProperty.call(pluginOption, 'enable') && !pluginOption.enable) return

    if (pluginPkg) {
      plugins.push(pluginPkg(pluginOption.config || {}))
      return
    }

    if (!isNpmPkg(pluginName)) {
      // local plugin
      pluginName = path.isAbsolute(pluginName) ? pluginName : path.join(appPath, pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: appPath }) || ''
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少postcss插件${pluginName}, 已忽略` : e
      console.log(msg)
    }
  })

  return plugins
}
