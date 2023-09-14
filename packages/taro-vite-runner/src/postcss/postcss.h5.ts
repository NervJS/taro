import { isNodeModule, isNpmPkg, recursiveMerge } from '@tarojs/helper'
import path from 'path'
import { sync as resolveSync } from 'resolve'

import { logger } from '../utils/logger'

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



const taroModuleRgx = [/@tarojs[/\\_]components/, /\btaro-components\b/]
const defaultEsnextModuleRgx = [
  /@tarojs[/\\_]components/,
  /\btaro-components\b/,
  /@tarojs[/\\_]taro-h5/,
  /\btaro-h5\b/,
  /@tarojs[/\\_]router/,
  /\btaro-router\b/
]
const isTaroModule = (filename: string) => taroModuleRgx.some(reg => reg.test(filename))


const isEsnextModule = (filename: string, esnextModules) => {
  const esnextModuleRules = [...defaultEsnextModuleRgx, ...esnextModules]
  return esnextModuleRules.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(filename)
    } else {
      return filename.indexOf(pattern) > -1
    }
  })
}

const getPostcssExclude = (esnextModules: string []) => {
  return (filename) => {
    if (isTaroModule(filename)) {
      return true
    } else if (isEsnextModule(filename, esnextModules)) {
      return false
    } else {
      return isNodeModule(filename)
    }
  }
}

const plugins: any[] = []

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  option = {} as IPostcssOption,
  esnextModules
}): [string, any, Func?][] {
  const { autoprefixer, pxtransform, htmltransform, ...options } = option
  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }
 
  // 由于 vite 缺少 postcss 文件的 filter 能力，所以只能针对 postcss-pxtransform 这个插件，在内部进行 filter，后面跟进 vite 的特性可以进行修改
  defaultPxtransformOption.config.exclude = getPostcssExclude(esnextModules)
  const autoprefixerOption = recursiveMerge<TogglableOptions>({}, defaultAutoprefixerOption, autoprefixer)
  const pxtransformOption = recursiveMerge<TogglableOptions>({}, defaultPxtransformOption, pxtransform)
  const htmltransformOption = recursiveMerge({}, defaultHtmltransformOption, htmltransform)

  return [
    ['autoprefixer', autoprefixerOption, require('autoprefixer')],
    ['postcss-pxtransform', pxtransformOption, require('postcss-pxtransform')],
    ['postcss-html-transform', htmltransformOption, require('postcss-html-transform')],
    ['postcss-plugin-constparse', defaultConstparseOption, require('postcss-plugin-constparse')],
    ...Object.entries(options)
  ]
}

export const getPostcssPlugins = function (appPath: string, option = {} as IPostcssOption) {
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
      logger.info(msg)
    }
  })

  return plugins
}


