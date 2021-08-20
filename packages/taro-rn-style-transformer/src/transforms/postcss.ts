/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import postcss, { ProcessOptions } from 'postcss'
import pxtransform from 'postcss-pxtransform'
import postcssImport from 'postcss-import'
import { recursiveMerge } from '@tarojs/helper'
import { resolveStyle } from '../utils'
import stylelintConfig from '../config/rn-stylelint.json'

export interface Config {
  options: ProcessOptions; // https://github.com/postcss/postcss#options
  scalable: boolean; // 控制是否对 css value 进行 scalePx2dp 转换
  pxtransform: {
    enable: boolean;
    config: any;
  },
}

const defaultPxtransformOption: {
  [key: string]: any
} = {
  enable: true,
  config: {
    platform: 'rn'
  }
}

export function getPostcssPlugins ({
  designWidth,
  deviceRatio,
  postcssConfig,
  transformOptions
}) {
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

  plugins.push(
    require('stylelint')(stylelintConfig),
    require('postcss-reporter')({ clearReportedMessages: true })
  )

  return plugins
}

export default function transform (src: string, filename: string, { options, plugins }) {
  return postcss(plugins)
    .process(src, { from: filename, ...options })
    .then(result => {
      const css = result.css
      return css
    })
}
