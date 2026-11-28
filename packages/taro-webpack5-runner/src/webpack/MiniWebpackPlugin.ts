import {
  getCommonChunksList,
  getDefaultMiniProviderGlobals,
  getMiniDefineConstants
} from '@tarojs/runner-utils'
import { IPostcssOption } from '@tarojs/taro/types/compile'

import BuildNativePlugin from '../plugins/BuildNativePlugin'
import MiniCompileModePlugin from '../plugins/MiniCompileModePlugin'
import MiniPlugin from '../plugins/MiniPlugin'
import MiniSplitChunksPlugin from '../plugins/MiniSplitChunksPlugin'
import WebpackPlugin, { PluginArgs } from './WebpackPlugin'

import type { MiniCombination } from './MiniCombination'

export class MiniWebpackPlugin {
  combination: MiniCombination
  pxtransformOption: IPostcssOption<'mini'>['pxtransform']

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

    if (!this.combination.isBuildPlugin) {
      /** 需要在 MiniPlugin 前，否则无法获取 entry 地址 */
      const miniSplitChunksPlugin = this.getMiniSplitChunksPlugin()
      if (miniSplitChunksPlugin) plugins.miniSplitChunksPlugin = miniSplitChunksPlugin
    }

    const definePluginOptions = plugins.definePlugin.args[0]
    const mainPlugin = this.getMainPlugin(definePluginOptions)
    plugins.miniPlugin = mainPlugin

    if (this.combination.config.experimental?.compileMode === true) {
      plugins.taroCompileModePlugin = WebpackPlugin.getPlugin(MiniCompileModePlugin, [{
        combination: this.combination,
      }])
    }

    return plugins
  }

  getProviderPlugin () {
    return WebpackPlugin.getProviderPlugin(getDefaultMiniProviderGlobals())
  }

  getDefinePlugin () {
    return WebpackPlugin.getDefinePlugin(getMiniDefineConstants(this.combination.config))
  }

  getCopyWebpackPlugin () {
    const combination = this.combination
    const { appPath, config } = combination
    const { copy } = config
    let copyWebpackPlugin

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
        fileType,
        combination: this.combination
      }])
    }

    return miniSplitChunksPlugin
  }

  getMainPlugin (definePluginOptions) {
    const { combination } = this

    const options = {
      commonChunks: this.getCommonChunks(),
      constantsReplaceList: definePluginOptions,
      pxTransformConfig: this.pxtransformOption?.config || {},
      hot: false,
      combination,
    }

    const plugin = combination.isBuildNativeComp ? BuildNativePlugin : MiniPlugin
    return WebpackPlugin.getPlugin(plugin, [options])
  }

  getCommonChunks () {
    const { buildNativePlugin, config } = this.combination
    return getCommonChunksList(buildNativePlugin, config)
  }
}
