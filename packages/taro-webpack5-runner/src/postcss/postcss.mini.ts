import { isNpmPkg, recursiveMerge } from '@tarojs/helper'
import path from 'path'
import { sync as resolveSync } from 'resolve'

import type { IPostcssOption } from '@tarojs/taro/types/compile'

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
  enable: false,
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

const optionsWithDefaults = ['autoprefixer', 'pxtransform', 'cssModules', 'url', 'htmltransform']

const plugins = [] as any[]

export const getPostcssPlugins = function (appPath: string, {
  designWidth,
  deviceRatio,
  postcssOption = {} as IPostcssOption
}) {
  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }

  const autoprefixerOption = recursiveMerge({}, defaultAutoprefixerOption, postcssOption.autoprefixer)
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, postcssOption.pxtransform)
  const htmltransformOption = recursiveMerge({}, defaultHtmltransformOption, postcssOption.htmltransform)
  const urlOption = recursiveMerge({}, defaultUrlOption, postcssOption.url)
  if (autoprefixerOption.enable) {
    const autoprefixer = require('autoprefixer')
    plugins.push(autoprefixer(autoprefixerOption.config))
  }

  if (pxtransformOption.enable) {
    const pxtransform = require('postcss-pxtransform')
    plugins.push(pxtransform(pxtransformOption.config))
  }
  if (urlOption.enable) {
    const url = require('postcss-url')
    plugins.push(url(urlOption.config))
  }
  if (htmltransformOption?.enable) {
    const htmlTransform = require('postcss-html-transform')
    plugins.push(htmlTransform(htmltransformOption.config))
  }
  plugins.unshift(require('postcss-import'))
  Object.entries(postcssOption).forEach(([pluginName, pluginOption]) => {
    if (optionsWithDefaults.indexOf(pluginName) > -1) return
    if (!pluginOption || !pluginOption.enable) return

    if (!isNpmPkg(pluginName)) { // local plugin
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
