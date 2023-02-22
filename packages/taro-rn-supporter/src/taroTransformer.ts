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

import { injectDefineConfigHeader } from '@tarojs/helper'
import { merge } from 'lodash'
import { getCacheKey, transform as babelTransform } from 'metro-react-native-babel-transformer'
import { sep } from 'path'

import { entryFilePath } from './defaults'
import { getProjectConfig, getRNConfig } from './utils'

const normalizeEntryFilePath = entryFilePath.replace(/\//g, sep)

const configBabelTransform = ({ src, filename, options, plugins }) => {
  // 获取rn配置中的moodifyBabelConfig
  // 与参数plugins合并，然后传给babelTransform
  const _plugins = plugins || []
  _plugins.push(injectDefineConfigHeader)
  return babelTransform({ src, filename, options, plugins: _plugins })
}

const getTransformer = (pkgName) => {
  // TODO: 利用缓存，参见metro对transformer的缓存处理
  return require(pkgName)
}

const transform = ({ src, filename, options, plugins }) => {
  const config = getProjectConfig()
  const rnConfig = getRNConfig()
  const entry = rnConfig?.entry || 'app'
  const rules: Record<string, any> = [
    {
      test: /\.(css|scss|sass|less|styl|stylus|pcss)/,
      transformer: '@tarojs/rn-style-transformer',
      configOpt: { config: config }
    },
    {
      test: /\.(svg|svgx)/, // .svg 文件仅在 enableSvgTransform 为 true 才会生效
      transformer: 'react-native-svg-transformer'
    },
    {
      // TODO:处理引用的外部资源文件
      test: /\.(png|jpg|jpeg|bmp)/,
      transformer: ''
    }, {
      test: /\.(js|ts|jsx|tsx)/,
      transformer: '@tarojs/rn-transformer',
      configOpt: {
        entry: entry,
        sourceRoot: config?.sourceRoot,
        appName: rnConfig.appName,
        designWidth: rnConfig.designWidth ? rnConfig.designWidth : config.designWidth,
        deviceRatio: rnConfig.designWidth ? rnConfig.deviceRatio : config.deviceRatio,
        nextTransformer: /\.config\.(t|j)sx?$/.test(filename) ? configBabelTransform : babelTransform,
        isEntryFile: filename_ => {
          return filename_.includes(normalizeEntryFilePath)
        },
        rn: rnConfig
      }
    }
  ]
  for (let i = 0; i < rules.length; i++) {
    const match = filename.match(rules[i].test)
    if (match && match.length) {
      const mixOptions = merge({}, options, rules[i].configOpt)
      return getTransformer(rules[i].transformer).transform({ src, filename, options: mixOptions })
    }
  }
  return babelTransform({ src, filename, options, plugins })
}

export {
  getCacheKey,
  transform
}

module.exports.transform = function ({ src, filename, options }) {
  return transform({ src, filename, options, plugins: [] })
}
