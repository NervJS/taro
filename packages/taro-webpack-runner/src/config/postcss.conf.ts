import { isNpmPkg, recursiveMerge } from '@tarojs/helper'
import { Func } from '@tarojs/runtime'
import type { IPostcssOption, TogglableOptions } from '@tarojs/taro/types/compile'
import * as path from 'path'
import { sync as resolveSync } from 'resolve'

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
  enable: false,
  config: {
    url: 'inline'
  }
}

const plugins: any[] = []

export const getDefaultPostcssConfig = function ({
  designWidth,
  deviceRatio,
  option = {} as IPostcssOption
}): [string | Func, any][] {
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
    [require('postcss-import'), {}],
    [require('autoprefixer'), autoprefixerOption],
    [require('postcss-pxtransform'), pxtransformOption],
    [require('postcss-html-transform'), htmltransformOption],
    [require('postcss-plugin-constparse'), defaultConstparseOption],
    [require('postcss-url'), urlOption],
    ...Object.entries(options)
  ]
}

export const getPostcssPlugins = function (appPath: string, option = {} as IPostcssOption) {
  option.forEach(([plugin, pluginOption]) => {
    if (!pluginOption) return
    if (Object.hasOwnProperty.call(pluginOption, 'enable') && !pluginOption.enable) return

    if (typeof plugin !== 'string') {
      plugins.push(plugin(pluginOption.config || {}))
      return
    }

    if (!isNpmPkg(plugin)) {
      // local plugin
      plugin = path.join(appPath, plugin)
    }

    try {
      const pluginPath = resolveSync(plugin, { basedir: appPath })
      plugins.push(require(pluginPath)(pluginOption.config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少 postcss 插件 "${plugin}", 已忽略` : e
      console.log(msg)
    }
  })

  return plugins
}
