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

import * as path from 'path'
import { get, mapValues, merge } from 'lodash'
import { FRAMEWORK_MAP } from '@tarojs/helper'
import { addLeadingSlash, addTrailingSlash } from '../util'
import {
  getCopyWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getHtmlWebpackPlugin,
  getMiniCssExtractPlugin,
  getMainPlugin,
  getFastRefreshPlugin,
  getModule,
  getOutput,
  processEnvOption
} from '../util/chain'
import { BuildConfig } from '../util/types'
import getBaseChain from './base.conf'
import { customVueChain } from './vue'
import { customVue3Chain } from './vue3'

const emptyObj = {}

export default function (appPath: string, config: Partial<BuildConfig>): any {
  const chain = getBaseChain(appPath, config)
  const {
    alias = {},
    copy,
    entry = emptyObj,
    entryFileName = 'app',
    output = emptyObj,
    sourceRoot = 'src',
    outputRoot = 'dist',
    publicPath = '',
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    router = emptyObj,

    designWidth = 750,
    deviceRatio,
    enableSourceMap = true,
    sourceMapType,
    enableExtract = false,

    defineConstants = emptyObj,
    env = emptyObj,
    styleLoaderOption = emptyObj,
    cssLoaderOption = emptyObj,
    sassLoaderOption = emptyObj,
    lessLoaderOption = emptyObj,
    stylusLoaderOption = emptyObj,
    mediaUrlLoaderOption = emptyObj,
    fontUrlLoaderOption = emptyObj,
    imageUrlLoaderOption = emptyObj,

    miniCssExtractPluginOption = emptyObj,
    esnextModules = [],

    useHtmlComponents = false,

    postcss = emptyObj
  } = config
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  const plugin = {} as any

  const isMultiRouterMode = get(router, 'mode') === 'multi'

  plugin.mainPlugin = getMainPlugin({
    framework: config.framework,
    entryFileName,
    sourceDir,
    outputDir,
    routerConfig: router,
    useHtmlComponents,
    designWidth,
    deviceRatio
  })

  if (enableExtract) {
    plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([
      {
        filename: 'css/[name].css',
        chunkFilename: 'css/[name].css'
      },
      miniCssExtractPluginOption
    ])
  }

  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({ copy, appPath })
  }

  if (isMultiRouterMode) {
    merge(plugin, mapValues(entry, (filePath, entryName) => {
      return getHtmlWebpackPlugin([{
        filename: `${entryName}.html`,
        template: path.join(appPath, sourceRoot, 'index.html'),
        chunks: [entryName]
      }])
    }))
  } else {
    plugin.htmlWebpackPlugin = getHtmlWebpackPlugin([{
      filename: 'index.html',
      template: path.join(appPath, sourceRoot, 'index.html')
    }])
  }
  plugin.definePlugin = getDefinePlugin([processEnvOption(env), defineConstants])

  if (config.framework === FRAMEWORK_MAP.REACT && config.devServer?.hot !== false) {
    // 默认开启 fast-refresh
    plugin.fastRefreshPlugin = getFastRefreshPlugin()
  }

  const mode = 'development'

  if (config.framework === FRAMEWORK_MAP.REACT || config.framework === FRAMEWORK_MAP.NERV) {
    if (useHtmlComponents && config.framework === FRAMEWORK_MAP.REACT) {
      alias['@tarojs/components$'] = '@tarojs/components-react/index'
    } else {
      alias['@tarojs/components$'] = '@tarojs/components/dist-h5/react'
    }
  }

  chain.merge({
    mode,
    devtool: getDevtool({ enableSourceMap, sourceMapType }),
    entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: addLeadingSlash(addTrailingSlash(publicPath)),
      chunkDirectory
    }, output]),
    resolve: { alias },
    module: getModule(appPath, {
      designWidth,
      deviceRatio,
      enableExtract,
      enableSourceMap,

      styleLoaderOption,
      cssLoaderOption,
      lessLoaderOption,
      sassLoaderOption,
      stylusLoaderOption,
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,
      esnextModules,

      postcss,
      staticDirectory
    }),
    plugin,
    optimization: {
      noEmitOnErrors: true
    }
  })

  switch (config.framework) {
    case FRAMEWORK_MAP.VUE:
      customVueChain(chain, {
        styleLoaderOption
      })
      break
    case FRAMEWORK_MAP.VUE3:
      customVue3Chain(chain, {
        styleLoaderOption
      })
      break
    default:
  }

  return chain
}
