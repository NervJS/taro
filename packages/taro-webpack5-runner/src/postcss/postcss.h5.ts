import { isNpmPkg, recursiveMerge } from '@tarojs/helper'
import path from 'path'
import { sync as resolveSync } from 'resolve'

import type { Func, IPostcssOption, TogglableOptions } from '@tarojs/taro/types/compile'

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
const defaultHtmltransformOption: {
  [key: string]: any
} = {
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

const plugins: any[] = []

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  option = {} as IPostcssOption
}): [string, any, Func?][] {
  const { autoprefixer, pxtransform, htmltransform, url, ...options } = option
  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }
  const autoprefixerOption = recursiveMerge<TogglableOptions>({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge<TogglableOptions>({}, defaultPxtransformOption, pxtransform)
  const htmltransformOption = recursiveMerge({}, defaultHtmltransformOption, htmltransform)
  const urlOption = recursiveMerge({}, defaultUrlOption, url)

  return [
    ['postcss-import', {}, require('postcss-import')],
    ['autoprefixer', autoprefixerOption, require('autoprefixer')],
    ['postcss-pxtransform', pxtransformOption, require('postcss-pxtransform')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ['postcss-plugin-constparse', defaultConstparseOption, require('postcss-plugin-constparse')],
    ['postcss-url', urlOption, require('postcss-url')],
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
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少 postcss 插件 "${pluginName}", 已忽略` : e
      console.log(msg)
    }
  })

  return plugins
}
