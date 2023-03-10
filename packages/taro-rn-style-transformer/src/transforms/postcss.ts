/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
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

import { isNpmPkg, printLog, processTypeEnum, recursiveMerge } from '@tarojs/helper'
import * as path from 'path'
import postcss from 'postcss'
import postcssImport from 'postcss-import'
import pxtransform from 'postcss-pxtransform'
import { sync as resolveSync } from 'resolve'

import stylelintConfig from '../config/rn-stylelint.json'
import { resolveStyle } from '../utils'
import reporterSkip from '../utils/reporterSkip'

const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'rn'
  }
}

export function makePostcssPlugins ({
  filename,
  designWidth,
  deviceRatio,
  postcssConfig,
  transformOptions,
  additionalData
}) {
  const optionsWithDefaults = ['pxtransform', 'postcss-import', 'postcss-reporter', 'stylelint', 'cssModules']

  if (designWidth) {
    defaultPxtransformOption.config.designWidth = designWidth
  }

  if (deviceRatio) {
    defaultPxtransformOption.config.deviceRatio = deviceRatio
  }
  const pxtransformOption = recursiveMerge({}, defaultPxtransformOption, postcssConfig.pxtransform)

  const plugins = [
    postcssImport({
      resolve: function resolve (id: string, basedir: string, options: postcssImport.AtImportOptions) {
        return resolveStyle(
          id,
          {
            ...options,
            basedir,
            defaultExt: '.css', // 省略后缀则默认 `.css`
            alias: postcssConfig.alias,
            platform: transformOptions.platform
          }
        )
      }
    })
  ]

  if (pxtransformOption.enable) {
    plugins.push(pxtransform(pxtransformOption.config))
  }

  const skipRows = additionalData ? additionalData.split('\n').length : 0

  plugins.push(
    require('stylelint')(stylelintConfig),
    // @ts-ignore
    reporterSkip({ skipRows, filename }),
    require('postcss-reporter')({ clearReportedMessages: true })
  )

  Object.entries(postcssConfig).forEach(([pluginName, pluginOption]) => {
    if (optionsWithDefaults.indexOf(pluginName) > -1) return
    if (!pluginOption || !(pluginOption as any).enable) return

    if (!isNpmPkg(pluginName)) { // local plugin
      pluginName = path.join(process.cwd(), pluginName)
    }

    try {
      const pluginPath = resolveSync(pluginName, { basedir: process.cwd() })
      plugins.push(require(pluginPath)((pluginOption as any).config || {}))
    } catch (e) {
      const msg = e.code === 'MODULE_NOT_FOUND' ? `缺少postcss插件${pluginName}, 已忽略` : e
      printLog(msg, processTypeEnum.WARNING)
    }
  })

  return plugins
}

export default function transform (src: string, filename: string, { options, plugins }) {
  return postcss(plugins)
    .process(src, { from: filename, ...options })
    .then(result => {
      return result
    })
}
