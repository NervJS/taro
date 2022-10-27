import { chalk, recursiveMerge, SCRIPT_EXT } from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import { get, mapValues, merge } from 'lodash'
import * as path from 'path'

import { addTrailingSlash, emptyObj, getConfigFilePath, getPages, parseHtmlScript } from '../util'
import {
  getCopyWebpackPlugin,
  getCssoWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getHtmlWebpackPlugin,
  getMainPlugin,
  getMiniCssExtractPlugin,
  getOutput,
  getTerserPlugin,
  parseModule,
  processEnvOption
} from '../util/chain'
import { BuildConfig } from '../util/types'
import getBaseChain from './base.conf'

export default function (appPath: string, config: Partial<BuildConfig>, appConfig: AppConfig): any {
  const chain = getBaseChain(appPath, config)
  const {
    alias = emptyObj,
    copy,
    entry = emptyObj,
    entryFileName = 'app',
    output = emptyObj,
    sourceRoot = '',
    outputRoot = 'dist',
    publicPath = '/',
    staticDirectory = 'static',
    chunkDirectory = 'chunk',
    router = emptyObj,

    designWidth = 750,
    deviceRatio,
    enableSourceMap = false,
    sourceMapType,
    enableExtract = true,

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

    postcss,
    htmlPluginOption = emptyObj,
    csso,
    uglify,
    terser
  } = config
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.resolve(appPath, outputRoot)
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

    postcss,
    staticDirectory
  })
  const [, pxtransformOption] = postcssOption.find(([name]) => name === 'postcss-pxtransform') || []

  const plugin: any = {}

  plugin.mainPlugin = getMainPlugin({
    framework: config.framework,
    frameworkExts: config.frameworkExts,
    entryFileName,
    sourceDir,
    outputDir,
    routerConfig: router,
    useHtmlComponents,
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

  const isCssoEnabled = !(csso && csso.enable === false)

  if (isCssoEnabled) {
    plugin.cssoWebpackPlugin = getCssoWebpackPlugin([csso ? csso.config : {}])
  }

  const mode = 'production'

  const minimizer: any[] = []
  const uglifyConfig = uglify || terser
  const isUglifyEnabled = !(uglifyConfig && uglifyConfig.enable === false)

  if (isUglifyEnabled) {
    minimizer.push(getTerserPlugin([
      enableSourceMap,
      uglifyConfig ? uglifyConfig.config : {}
    ]))
  }

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
      minimizer,
      splitChunks: {
        name: false,
        chunks: 'initial',
        minSize: 0,
        cacheGroups: {
          default: false,
          common: {
            name: false,
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: false,
            minChunks: 2,
            test: module => /[\\/]node_modules[\\/]/.test(module.resource),
            priority: 10
          },
          taro: {
            name: false,
            test: module => /@tarojs[\\/][a-z]+/.test(module.context),
            priority: 100
          }
        }
      }
    }
  })

  return chain
}
