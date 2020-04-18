import * as path from 'path'
import * as pxtransform from 'postcss-pxtransform'
import * as stylelint from 'stylelint'
import * as postcssReporter from 'postcss-reporter'
import { sync as resolveSync } from 'resolve'
import { IPostcssOption } from '@tarojs/taro/types/compile'

import { isNpmPkg, recursiveMerge } from '../utils'

const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'rn'
  }
}

const optionsWithDefaults = ['stylelint', 'postcss-reporter', 'pxtransform']

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

  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, postcssOption.pxtransform)

  plugins.push(stylelint({
    configFile: path.resolve(__dirname, '../config/rn-stylelint.json')
  }))
  plugins.push(postcssReporter({clearReportedMessages: true}))

  if (pxtransformOption.enable) {
    plugins.push(pxtransform(pxtransformOption.config))
  }

  Object.entries(postcssOption).forEach(([pluginName, pluginOption]) => {
    if (optionsWithDefaults.indexOf(pluginName) > -1) return
    if (!pluginOption || !pluginOption.enable) return

    if (!isNpmPkg(pluginName)) { // local plugin
      pluginName = path.join(appPath, pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, {basedir: appPath})
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少postcss插件${pluginName}, 已忽略` : e
      console.log(msg)
    }
  })

  return plugins
}
