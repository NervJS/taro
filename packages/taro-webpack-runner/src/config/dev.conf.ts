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

import { chalk, recursiveMerge, SCRIPT_EXT } from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import { get, mapValues, merge } from 'lodash'
import * as path from 'path'

import { addTrailingSlash, getConfigFilePath, getPages, parseHtmlScript } from '../util'
import {
  getCopyWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getHtmlWebpackPlugin,
  getMainPlugin,
  getMiniCssExtractPlugin,
  getOutput,
  parseModule,
  processEnvOption
} from '../util/chain'
import { BuildConfig } from '../util/types'
import getBaseChain from './base.conf'

export default function (appPath: string, config: Partial<BuildConfig>, appConfig: AppConfig): any {
  const chain = getBaseChain(appPath, config)
  const {
    alias = {},
    copy,
    entry = {},
    entryFileName = 'app',
    output = {},
    sourceRoot = 'src',
    outputRoot = 'dist',
    publicPath = '/',
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    router = {},

    designWidth = 750,
    deviceRatio,
    enableSourceMap = true,
    sourceMapType,
    enableExtract = false,

    defineConstants = {},
    env = {},
    styleLoaderOption = {},
    cssLoaderOption = {},
    sassLoaderOption = {},
    lessLoaderOption = {},
    stylusLoaderOption = {},
    mediaUrlLoaderOption = {},
    fontUrlLoaderOption = {},
    imageUrlLoaderOption = {},

    miniCssExtractPluginOption = {},
    esnextModules = [],

    compile = {},
    postcss = {},
    htmlPluginOption = {}
  } = config
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  const isMultiRouterMode = get(router, 'mode') === 'multi'

  const { rule, postcssOption } = parseModule(appPath, {
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

    compile,
    postcss,
    sourceDir,
    staticDirectory
  })
  const [, pxtransformOption] = postcssOption.find(([name]) => name === 'postcss-pxtransform') || []

  const plugin = {} as any

  plugin.mainPlugin = getMainPlugin({
    framework: config.framework,
    frameworkExts: config.frameworkExts,
    entryFileName,
    sourceDir,
    outputDir,
    routerConfig: router,
    runtimePath: config.runtimePath,
    pxTransformConfig: pxtransformOption?.config || {}
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

  const htmlScript = parseHtmlScript(pxtransformOption)
  if (process.env.NODE_ENV !== 'production' && Object.hasOwnProperty.call(htmlPluginOption, 'script')) {
    console.warn(
      chalk.yellowBright('配置文件覆盖 htmlPluginOption.script 参数会导致 pxtransform 脚本失效，请慎重使用！')
    )
  }
  if (isMultiRouterMode) {
    const frameworkExts = config.frameworkExts || SCRIPT_EXT
    const pages = getPages(appConfig.pages, sourceDir, frameworkExts)
    delete entry[entryFileName]
    pages.forEach(({ name, path }) => {
      entry[name] = [getConfigFilePath(path)]
    })
    merge(plugin, mapValues(entry, (_filePath, entryName) => {
      return getHtmlWebpackPlugin([recursiveMerge({
        filename: `${entryName}.html`,
        template: path.join(appPath, sourceRoot, 'index.html'),
        script: htmlScript,
        chunks: [entryName]
      }, htmlPluginOption)])
    }))
  } else {
    plugin.htmlWebpackPlugin = getHtmlWebpackPlugin([recursiveMerge({
      filename: 'index.html',
      template: path.join(appPath, sourceRoot, 'index.html'),
      script: htmlScript
    }, htmlPluginOption)])
  }
  env.SUPPORT_DINGTALK_NAVIGATE = env.SUPPORT_DINGTALK_NAVIGATE || '"disabled"'
  plugin.definePlugin = getDefinePlugin([processEnvOption(env), defineConstants])

  const mode = 'development'

  chain.merge({
    mode,
    devtool: getDevtool({ enableSourceMap, sourceMapType }),
    entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: ['', 'auto'].includes(publicPath) ? publicPath : addTrailingSlash(publicPath),
      chunkDirectory
    }, output]),
    resolve: { alias },
    module: { rule },
    plugin,
    optimization: {
      noEmitOnErrors: true,
      splitChunks: {
        chunks: 'initial',
        minSize: 0,
        cacheGroups: {
          common: {
            name: 'common',
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: 'vendors',
            minChunks: 2,
            test: module => /[\\/]node_modules[\\/]/.test(module.resource),
            priority: 10
          },
          taro: {
            name: 'taro',
            test: module => /@tarojs[\\/][a-z]+/.test(module.context),
            priority: 100
          }
        }
      }
    }
  })

  return chain
}
