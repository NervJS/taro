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

import { merge } from 'lodash'
import { getCacheKey, transform as babelTransform } from 'metro-react-native-babel-transformer'

import { getProjectConfig } from './utils'

const _babelTransform = ({ src, filename, options, plugins }) => {
  // 获取rn配置中的moodifyBabelConfig
  // 与参数plugins合并，然后传给babelTransform
  return babelTransform({ src, filename, options, plugins })
}

const getTransformer = (pkgName) => {
  // TODO: 利用缓存，参见metro对transformer的缓存处理
  return require(pkgName)
}

const transform = ({ src, filename, options, plugins }) => {
  const config = getProjectConfig()
  const rules: Record<string, any> = [
    {
      test: /\.(css|scss|sass|less|styl|stylus|pcss)/,
      transformer: '@tarojs/rn-style-transformer',
      configOpt: { config: config }
    },
    {
      // TODO:处理引用的外部资源文件
      test: /\.(png|jpg|jpeg|bmp)/,
      transformer: ''
    }
  ]
  for (let i = 0; i < rules.length; i++) {
    const match = filename.match(rules[i].test)
    if (match && match.length) {
      const mixOptions = merge({}, options, rules[i].configOpt)
      return getTransformer(rules[i].transformer).transform({ src, filename, options: mixOptions })
    }
  }
  return _babelTransform({ src, filename, options, plugins })
}

export {
  getCacheKey,
  transform
}

module.exports.transform = function ({ src, filename, options }) {
  return transform({ src, filename, options, plugins: [] })
}
