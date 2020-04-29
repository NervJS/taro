import * as path from 'path'
import { BUILD_TYPES, MINI_APP_FILES, FRAMEWORK_MAP, taroJsComponents } from '@tarojs/runner-utils'

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
import { Targets } from '../plugins/MiniPlugin'

export default (appPath: string, mode, config: Partial<IBuildConfig>): any => {
  const chain = getBaseConf(appPath)
  const {
    buildAdapter = BUILD_TYPES.WEAPP,
    alias = {},
    entry = {},
    output = {},
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
    quickappJSON,

    csso,
    terser,
    commonChunks,
    addChunkPages
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
  if (framework === FRAMEWORK_MAP.VUE) {
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    plugin.vueLoaderPlugin = {
      plugin: new VueLoaderPlugin()
    }
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
    quickappJSON,
    designWidth,
    pluginConfig: entryRes!.pluginConfig,
    isBuildPlugin: !!config.isBuildPlugin,
    commonChunks: customCommonChunks,
    baseLevel,
    framework,
    prerender,
    addChunkPages
  })

  plugin.miniCssExtractPlugin = getMiniCssExtractPlugin([{
    filename: `[name]${MINI_APP_FILES[buildAdapter].STYLE}`,
    chunkFilename: `[name]${MINI_APP_FILES[buildAdapter].STYLE}`
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
      buildAdapter
    }, output]),
    target: Targets[buildAdapter],
    resolve: { alias },
    module: getModule(appPath, {
      sourceDir,

      buildAdapter,
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

      postcss
      // babel
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
  return chain
}
