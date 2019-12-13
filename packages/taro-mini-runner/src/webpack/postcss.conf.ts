import * as path from 'path'

import * as autoprefixer from 'autoprefixer'
import * as pxtransform from 'postcss-pxtransform'
import { sync as resolveSync } from 'resolve'
import { IPostcssOption } from '@tarojs/taro/types/compile'

import { isNpmPkg, recursiveMerge } from '../utils'
import browserList from '../config/browser_list'

const defaultAutoprefixerOption = {
  enable: true,
  config: {
    browsers: browserList,
    flexbox: 'no-2009'
  }
}
const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'weapp'
  }
}

const optionsWithDefaults = ['autoprefixer', 'pxtransform', 'cssModules', 'url']

const plugins = [] as any[]

export const getPostcssPlugins = function (appPath: string, {
  isQuickapp = false,
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

  if (autoprefixerOption.enable) {
    plugins.push(autoprefixer(autoprefixerOption.config))
  }

  if (pxtransformOption.enable && !isQuickapp) {
    plugins.push(pxtransform(pxtransformOption.config))
  }

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
