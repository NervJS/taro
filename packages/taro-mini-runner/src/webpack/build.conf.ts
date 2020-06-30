import * as path from 'path'
import { PLATFORMS, FRAMEWORK_MAP, taroJsComponents } from '@tarojs/helper'

import { IBuildConfig } from '../utils/types'
import {
  getCopyWebpackPlugin,
  getDefinePlugin,
  processEnvOption,
  getCssoWebpackPlugin,
  getTerserPlugin,
  getDevtool,
  getOutput,
  getModule,
  mergeOption,
  getMiniPlugin,
  getProviderPlugin,
  getMiniCssExtractPlugin,
  getEntry
} from './chain'
import getBaseConf from './base.conf'
import { createTarget } from '../plugins/MiniPlugin'
import { weixinAdapter } from '../template/adapters'
import { customVueChain } from './vue'
import { customVue3Chain } from './vue3'

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
    templateAdapter = weixinAdapter,
    isSupportXS = true,
    globalObject = 'wx',
    outputRoot = 'dist',
    sourceRoot = 'src',

    designWidth = 750,
    deviceRatio,
    enableSourceMap = process.env.NODE_ENV !== 'production',
    baseLevel = 16,
    framework = 'nerv',
    prerender,

    defineConstants = {},
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
    isSupportRecursive = false,
    quickappJSON,

    csso,
    terser,
    commonChunks,
    addChunkPages,

    modifyMiniConfigs,
    modifyBuildAssets
  } = config

  let { copy } = config

  const plugin: any = {}
  const minimizer: any[] = []
  const sourceDir = path.join(appPath, sourceRoot)
  const outputDir = path.join(appPath, outputRoot)
  const taroBaseReg = /@tarojs[\\/][a-z]+/
  if (config.isBuildPlugin) {
    const patterns = copy ? copy.patterns : []
    patterns.push({
      from: path.join(sourceRoot, 'plugin', 'doc'),
      to: path.join(outputRoot, 'doc')
    })
    patterns.push({
      from: path.join(sourceRoot, 'plugin', 'plugin.json'),
      to: path.join(outputRoot, 'plugin', 'plugin.json')
    })
    copy = Object.assign({}, copy, { patterns })
  }
  if (copy) {
    plugin.copyWebpackPlugin = getCopyWebpackPlugin({ copy, appPath })
  }
  alias[taroJsComponents + '$'] = `${taroJsComponents}/mini`
  if (framework === 'react') {
    alias['react-dom'] = '@tarojs/react'
  }
  if (framework === 'nerv') {
    alias['react-dom'] = 'nervjs'
    alias.react = 'nervjs'
  }

  env.FRAMEWORK = JSON.stringify(framework)
  env.TARO_ENV = JSON.stringify(buildAdapter)
  const constantsReplaceList = mergeOption([processEnvOption(env), defineConstants])
  const entryRes = getEntry({
    sourceDir,
    entry,
    isBuildPlugin: config.isBuildPlugin
  })
  const defaultCommonChunks = config.isBuildPlugin
    ? ['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']
    : ['runtime', 'vendors', 'taro', 'common']
  let customCommonChunks = defaultCommonChunks
  if (typeof commonChunks === 'function') {
    customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
  } else if (Array.isArray(commonChunks) && commonChunks.length) {
    customCommonChunks = commonChunks
  }
  plugin.definePlugin = getDefinePlugin([constantsReplaceList])
  plugin.miniPlugin = getMiniPlugin({
    sourceDir,
    outputDir,
    buildAdapter,
    constantsReplaceList,
    nodeModulesPath,
    isBuildQuickapp,
    isSupportRecursive,
    fileType,
    templateAdapter,
    isSupportXS,
    quickappJSON,
    designWidth,
    pluginConfig: entryRes!.pluginConfig,
    isBuildPlugin: !!config.isBuildPlugin,
    commonChunks: customCommonChunks,
    baseLevel,
    framework,
    prerender,
    addChunkPages,
    modifyMiniConfigs,
    modifyBuildAssets
  })

  plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
    filename: `[name]${fileType.style}`,
    chunkFilename: `[name]${fileType.style}`
  }, miniCssExtractPluginOption])

  plugin.providerPlugin = getProviderPlugin({
    window: ['@tarojs/runtime', 'window'],
    document: ['@tarojs/runtime', 'document'],
    navigator: ['@tarojs/runtime', 'navigator'],
    requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
    cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame']
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
    devtool: getDevtool(enableSourceMap),
    entry: entryRes!.entry,
    output: getOutput(appPath, [{
      outputRoot,
      publicPath: '/',
      globalObject
    }, output]),
    target: createTarget(buildAdapter),
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
        name: config.isBuildPlugin ? 'plugin/runtime' : 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          common: {
            name: config.isBuildPlugin ? 'plugin/common' : 'common',
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: config.isBuildPlugin ? 'plugin/vendors' : 'vendors',
            minChunks: 2,
            test: module => {
              return /[\\/]node_modules[\\/]/.test(module.resource)
            },
            priority: 10
          },
          taro: {
            name: config.isBuildPlugin ? 'plugin/taro' : 'taro',
            test: module => {
              return taroBaseReg.test(module.context)
            },
            priority: 100
          }
        }
      }
    }
  })

  switch (framework) {
    case FRAMEWORK_MAP.VUE:
      customVueChain(chain)
      break
    case FRAMEWORK_MAP.VUE3:
      customVue3Chain(chain)
      break
    default:
  }

  return chain
}
