import { isNpmPkg, recursiveMerge } from '@tarojs/helper'
import path from 'path'
import { sync as resolveSync } from 'resolve'

import type { Func, IPostcssOption, TogglableOptions } from '@tarojs/taro/types/compile'

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

const defaultHtmltransformOption: {
  [key: string]: any
} = {
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
  postcssOption = {} as IPostcssOption
}): [string, any, Func?][] {
  const { autoprefixer, pxtransform, htmltransform, url, ...options } = postcssOption

  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }

  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, pxtransform)
  const htmltransformOption = recursiveMerge({}, defaultHtmltransformOption, htmltransform)
  const urlOption = recursiveMerge({}, defaultUrlOption, url)

  return [
    ['postcss-import', {}, require('postcss-import')],
    ['autoprefixer', autoprefixerOption, require('autoprefixer')],
    ['postcss-pxtransform', pxtransformOption, require('postcss-pxtransform')],
    ['postcss-url', urlOption, require('postcss-url')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ...Object.entries(options)
  ]
}


export const getPostcssPlugins = function (appPath: string, option: [string, TogglableOptions<Record<string, unknown>>, Func?][] = []) {
  option.forEach(([pluginName, pluginOption, pluginPkg]) => {
    if (!pluginOption || ['cssModules'].includes(pluginName)) return
    if (Object.hasOwnProperty.call(pluginOption, 'enable') && !pluginOption.enable) return

    if (pluginPkg) {
      plugins.push(pluginPkg(pluginOption.config || {}))
      return
    }

    if (!isNpmPkg(pluginName)) {
      // local plugin
      pluginName = path.join(appPath, pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: appPath })
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少postcss插件${pluginName}, 已忽略` : e
      console.log(msg)
    }
  })

  return plugins
}
