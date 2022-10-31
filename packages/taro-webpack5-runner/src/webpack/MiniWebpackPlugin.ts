import { PLATFORMS } from '@tarojs/helper'
import { isArray, isFunction } from '@tarojs/shared'
import { ICopyOptions } from '@tarojs/taro/types/compile'

import BuildNativePlugin from '../plugins/BuildNativePlugin'
import MiniPlugin from '../plugins/MiniPlugin'
import MiniSplitChunksPlugin from '../plugins/MiniSplitChunksPlugin'
import WebpackPlugin, { PluginArgs } from './WebpackPlugin'

import type { MiniCombination } from './MiniCombination'

export class MiniWebpackPlugin {
  combination: MiniCombination

  constructor (combination: MiniCombination) {
    this.combination = combination
  }

  getPlugins () {
    const plugins: Record<string, { plugin: any, args: PluginArgs }> = {
      providerPlugin: this.getProviderPlugin(),
      definePlugin: this.getDefinePlugin(),
      miniCssExtractPlugin: this.getMiniCssExtractPlugin()
    }

    const copyWebpackPlugin = this.getCopyWebpackPlugin()
    if (copyWebpackPlugin) plugins.copyWebpackPlugin = copyWebpackPlugin

    /** 需要在 MiniPlugin 前，否则无法获取 entry 地址 */
    const miniSplitChunksPlugin = this.getMiniSplitChunksPlugin()
    if (miniSplitChunksPlugin) plugins.miniSplitChunksPlugin = miniSplitChunksPlugin

    const definePluginOptions = plugins.definePlugin.args[0]
    const mainPlugin = this.getMainPlugin(definePluginOptions)
    plugins.miniPlugin = mainPlugin

    return plugins
  }

  getProviderPlugin () {
    return WebpackPlugin.getProviderPlugin({
      window: ['@tarojs/runtime', 'window'],
      document: ['@tarojs/runtime', 'document'],
      navigator: ['@tarojs/runtime', 'navigator'],
      requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
      cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame'],
      Element: ['@tarojs/runtime', 'TaroElement'],
      SVGElement: ['@tarojs/runtime', 'SVGElement'],
      MutationObserver: ['@tarojs/runtime', 'MutationObserver']
    })
  }

  getDefinePlugin () {
    const {
      env = {},
      runtime = {} as Record<string, boolean>,
      defineConstants = {},
      framework = 'react',
      buildAdapter = PLATFORMS.WEAPP
    } = this.combination.config

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    const runtimeConstants = {
      ENABLE_INNER_HTML: runtime.enableInnerHTML ?? true,
      ENABLE_ADJACENT_HTML: runtime.enableAdjacentHTML ?? false,
      ENABLE_SIZE_APIS: runtime.enableSizeAPIs ?? false,
      ENABLE_TEMPLATE_CONTENT: runtime.enableTemplateContent ?? false,
      ENABLE_CLONE_NODE: runtime.enableCloneNode ?? false,
      ENABLE_CONTAINS: runtime.enableContains ?? false,
      ENABLE_MUTATION_OBSERVER: runtime.enableMutationObserver ?? false
    }

    return WebpackPlugin.getDefinePlugin([envConstants, defineConstants, runtimeConstants])
  }

  getCopyWebpackPlugin () {
    const combination = this.combination
    const { appPath, config, isBuildPlugin } = combination
    let { copy } = config
    let copyWebpackPlugin

    if (isBuildPlugin) {
      copy ||= {} as ICopyOptions
      copy!.patterns ||= []
      copy.patterns.push(combination.buildNativePlugin.getCopyPattern())
    }

    if (copy?.patterns.length) {
      copyWebpackPlugin = WebpackPlugin.getCopyWebpackPlugin(appPath, copy)
    }

    return copyWebpackPlugin
  }

  getMiniCssExtractPlugin () {
    const { fileType } = this.combination
    const { miniCssExtractPluginOption = {} } = this.combination.config
    const args = Object.assign({
      filename: `[name]${fileType.style}`,
      chunkFilename: `[name]${fileType.style}`
    }, miniCssExtractPluginOption)
    return WebpackPlugin.getMiniCssExtractPlugin(args)
  }

  getMiniSplitChunksPlugin () {
    const { fileType } = this.combination
    const { optimizeMainPackage } = this.combination
    let miniSplitChunksPlugin

    if (optimizeMainPackage?.enable) {
      miniSplitChunksPlugin = WebpackPlugin.getPlugin(MiniSplitChunksPlugin, [{
        exclude: optimizeMainPackage.exclude,
        fileType
      }])
    }

    return miniSplitChunksPlugin
  }

  getMainPlugin (definePluginOptions) {
    const {
      sourceDir,
      outputDir,
      isBuildNativeComp,
      isBuildPlugin,
      buildNativePlugin,
      config,
      fileType
    } = this.combination
    const plugin = isBuildNativeComp ? BuildNativePlugin : MiniPlugin
    const options = {
      /** paths */
      sourceDir,
      outputDir,
      runtimePath: config.runtimePath,
      nodeModulesPath: config.nodeModulesPath,
      /** config & message */
      framework: config.framework || 'react',
      frameworkExts: config.frameworkExts,
      fileType,
      template: config.template,
      commonChunks: this.getCommonChunks(),
      designWidth: config.designWidth || 750,
      deviceRatio: config.deviceRatio,
      baseLevel: config.baseLevel || 16,
      minifyXML: config.minifyXML || {},
      alias: config.alias || {},
      constantsReplaceList: definePluginOptions,
      /** building mode */
      hot: false,
      prerender: config.prerender,
      blended: config.blended,
      isBuildNativeComp,
      isBuildPlugin: isBuildPlugin,
      pluginConfig: buildNativePlugin?.pluginConfig,
      pluginMainEntry: buildNativePlugin?.pluginMainEntry,
      /** hooks & methods */
      addChunkPages: config.addChunkPages,
      modifyMiniConfigs: config.modifyMiniConfigs,
      modifyBuildAssets: config.modifyBuildAssets,
      onCompilerMake: config.onCompilerMake,
      onParseCreateElement: config.onParseCreateElement,
      logger: config.logger
    }

    return WebpackPlugin.getPlugin(plugin, [options])
  }

  getCommonChunks () {
    const { buildNativePlugin, config } = this.combination
    const { commonChunks } = config
    const defaultCommonChunks = buildNativePlugin?.commonChunks || ['runtime', 'vendors', 'taro', 'common']
    let customCommonChunks: string[] = defaultCommonChunks
    if (isFunction(commonChunks)) {
      customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
    } else if (isArray(commonChunks) && commonChunks.length) {
      customCommonChunks = commonChunks
    }
    return customCommonChunks
  }
}
