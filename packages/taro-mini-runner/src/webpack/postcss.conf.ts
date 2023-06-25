import { isNpmPkg, recursiveMerge } from '@tarojs/helper'
import * as path from 'path'
import { sync as resolveSync } from 'resolve'

import type { IHtmlTransformOption, IPostcssOption } from '@tarojs/taro/types/compile'

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
    platform: process.env.TARO_ENV
  }
}

const defaultUrlOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    limit: 1000,
    url: 'inline'
  }
}

const defaultHtmltransformOption: IHtmlTransformOption = {
  enable: false,
  config: {
    platform: process.env.TARO_ENV,
    removeCursorStyle: true
  }
}

const optionsWithDefaults = ['autoprefixer', 'pxtransform', 'cssModules', 'url', 'htmltransform']

const plugins = [] as any[]

export const getPostcssPlugins = function (appPath: string, {
  isBuildQuickapp = false,
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
  const urlOption = recursiveMerge({}, defaultUrlOption, postcssOption.url)
  const htmltransformOption: IHtmlTransformOption = recursiveMerge({}, defaultHtmltransformOption, postcssOption.htmltransform)
  if (autoprefixerOption.enable) {
    const autoprefixer = require('autoprefixer')
    plugins.push(autoprefixer(autoprefixerOption.config))
  }

  if (pxtransformOption.enable && !isBuildQuickapp) {
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
