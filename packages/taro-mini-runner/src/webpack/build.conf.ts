import { PLATFORMS, taroJsComponents } from '@tarojs/helper'
import { isArray, isFunction, PLATFORM_TYPE } from '@tarojs/shared'
import * as path from 'path'

import { createTarget } from '../plugins/MiniPlugin'
import { componentConfig } from '../template/component'
import { IBuildConfig } from '../utils/types'
import getBaseConf from './base.conf'
import {
  getBuildNativePlugin,
  getCopyWebpackPlugin,
  getCssoWebpackPlugin,
  getDefinePlugin,
  getDevtool,
  getEntry,
  getMiniCssExtractPlugin,
  getMiniPlugin,
  getMiniSplitChunksPlugin,
  getModule,
  getOutput,
  getProviderPlugin,
  getRuntimeConstants,
  getTerserPlugin,
  mergeOption,
  processEnvOption
} from './chain'

export default (appPath: string, mode, config: Partial<IBuildConfig>): any => {
  const chain = getBaseConf(appPath)
  const {
    buildAdapter = PLATFORMS.WEAPP,
    alias = {},
    entry = {},
    output = {},
    fileType = {
      style: '.wxss',
      config: '.json',
      script: '.js',
      templ: '.wxml'
    },
    globalObject = 'wx',
    outputRoot = 'dist',
    sourceRoot = 'src',
    isBuildPlugin = false,
    runtimePath,
    taroComponentsPath,

    designWidth = 750,
    deviceRatio,
    enableSourceMap = process.env.NODE_ENV !== 'production',
    sourceMapType,
    baseLevel = 16,
    framework = 'nerv',
    frameworkExts,
    prerender,
    minifyXML = {},
    hot = false,

    defineConstants = {},
    runtime = {},
    env = {},
    cssLoaderOption = {},
    sassLoaderOption = {},
    lessLoaderOption = {},
    stylusLoaderOption = {},
    mediaUrlLoaderOption = {},
    fontUrlLoaderOption = {},
    imageUrlLoaderOption = {},
    miniCssExtractPluginOption = {},

    postcss = {},
    nodeModulesPath,
    isBuildQuickapp = false,
    template,
    quickappJSON,

    csso,
    terser,
    commonChunks,
    addChunkPages,
    optimizeMainPackage = {
      enable: false
    },

    blended,
    isBuildNativeComp,

    modifyMiniConfigs,
    modifyBuildAssets,
    onCompilerMake,
    onParseCreateElement
  } = config

  config.modifyComponentConfig?.(componentConfig, config)

  let { copy } = config

  const plugin: any = {}
  const minimizer: any[] = []
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  const taroBaseReg = /@tarojs[\\/][a-z]+/
  if (isBuildPlugin) {
    const patterns = copy ? copy.patterns : []
    patterns.push({
      from: path.join(sourceRoot, 'plugin', 'doc'),
      to: path.join(outputRoot, 'doc')
    })
    copy = Object.assign({}, copy, { patterns })
  }
  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({ copy, appPath })
  }
  alias[taroJsComponents + '$'] = taroComponentsPath || `${taroJsComponents}/mini`

  env.FRAMEWORK = JSON.stringify(framework)
  env.TARO_ENV = JSON.stringify(buildAdapter)
  env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.MINI)
  const runtimeConstants = getRuntimeConstants(runtime)
  const constantsReplaceList = mergeOption([processEnvOption(env), defineConstants, runtimeConstants])
  const entryRes = getEntry({
    sourceDir,
    entry,
    isBuildPlugin
  })
  const defaultCommonChunks = isBuildPlugin
    ? ['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']
    : ['runtime', 'vendors', 'taro', 'common']
  let customCommonChunks = defaultCommonChunks
  if (isFunction(commonChunks)) {
    customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
  } else if (isArray(commonChunks) && commonChunks.length) {
    customCommonChunks = commonChunks
  }
  plugin.definePlugin = getDefinePlugin([constantsReplaceList])

  /** 需要在miniPlugin前，否则无法获取entry地址 */
  if (optimizeMainPackage.enable) {
    plugin.miniSplitChunksPlugin = getMiniSplitChunksPlugin({
      ...optimizeMainPackage,
      fileType
    })
  }

  const miniPluginOptions = {
    sourceDir,
    outputDir,
    constantsReplaceList,
    nodeModulesPath,
    isBuildQuickapp,
    template,
    fileType,
    quickappJSON,
    designWidth,
    deviceRatio,
    pluginConfig: entryRes!.pluginConfig,
    pluginMainEntry: entryRes!.pluginMainEntry,
    isBuildPlugin: Boolean(isBuildPlugin),
    commonChunks: customCommonChunks,
    baseLevel,
    framework,
    frameworkExts,
    prerender,
    addChunkPages,
    modifyMiniConfigs,
    modifyBuildAssets,
    onCompilerMake,
    onParseCreateElement,
    minifyXML,
    runtimePath,
    blended,
    isBuildNativeComp,
    alias,
    hot
  }
  plugin.miniPlugin = !isBuildNativeComp ? getMiniPlugin(miniPluginOptions) : getBuildNativePlugin(miniPluginOptions)

  plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
    filename: `[name]${fileType.style}`,
    chunkFilename: `[name]${fileType.style}`
  }, miniCssExtractPluginOption])

  plugin.providerPlugin = getProviderPlugin({
    window: ['@tarojs/runtime', 'window'],
    document: ['@tarojs/runtime', 'document'],
    navigator: ['@tarojs/runtime', 'navigator'],
    requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
    cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame'],
    Element: ['@tarojs/runtime', 'TaroElement'],
    SVGElement: ['@tarojs/runtime', 'SVGElement'],
    MutationObserver: ['@tarojs/runtime', 'MutationObserver'],
    history: ['@tarojs/runtime', 'history'],
    location: ['@tarojs/runtime', 'location'],
    URLSearchParams: ['@tarojs/runtime', 'URLSearchParams'],
    URL: ['@tarojs/runtime', 'URL'],
  })

  const isCssoEnabled = !((csso && csso.enable === false))

  const isTerserEnabled = !((terser && terser.enable === false))

  if (mode === 'production') {
    if (isTerserEnabled) {
      minimizer.push(getTerserPlugin([
        enableSourceMap,
        terser ? terser.config : {}
      ]))
    }

    if (isCssoEnabled) {
      const cssoConfig: any = csso ? csso.config : {}
      plugin.cssoWebpackPlugin = getCssoWebpackPlugin([cssoConfig])
    }
  }

  chain.merge({
    mode,
    devtool: getDevtool(enableSourceMap, sourceMapType),
    entry: entryRes!.entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: '/',
      globalObject
    }, output]),
    target: createTarget({
      framework
    }),
    resolve: { alias },
    module: getModule(appPath, {
      sourceDir,

      buildAdapter,
      isBuildQuickapp,
      // constantsReplaceList,
      designWidth,
      deviceRatio,
      enableSourceMap,
      compile: config.compile || {},

      cssLoaderOption,
      lessLoaderOption,
      sassLoaderOption,
      stylusLoaderOption,
      fontUrlLoaderOption,
      imageUrlLoaderOption,
      mediaUrlLoaderOption,

      postcss,
      fileType
    }),
    plugin,
    optimization: {
      usedExports: true,
      minimizer,
      runtimeChunk: {
        name: isBuildPlugin ? 'plugin/runtime' : 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          common: {
            name: isBuildPlugin ? 'plugin/common' : 'common',
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: isBuildPlugin ? 'plugin/vendors' : 'vendors',
            minChunks: 2,
            test: module => {
              return /[\\/]node_modules[\\/]/.test(module.resource)
            },
            priority: 10
          },
          taro: {
            name: isBuildPlugin ? 'plugin/taro' : 'taro',
            test: module => {
              return taroBaseReg.test(module.context)
            },
            priority: 100
          }
        }
      }
    }
  })

  return chain
}
