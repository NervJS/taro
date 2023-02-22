/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { isNpmPkg, recursiveMerge } from '@tarojs/helper'
import * as path from 'path'
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

export const getPostcssPlugins = function (appPath: string, option = {} as IPostcssOption) {
  option.forEach(([pluginName, pluginOption, pluginPkg]) => {
    if (!pluginOption) return
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
