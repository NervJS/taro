import {
  getCommonChunksList,
  getDefaultMiniProviderGlobals,
  getMiniDefineConstants
} from '../utils'

import type { IPostcssOption } from '@tarojs/taro/types/compile'
import type { BundlerPlugin, PluginArgs } from './BundlerPlugin'

export abstract class BaseMiniPluginConfig<TCombination extends Record<string, any> = any> {
  combination: TCombination
  pxtransformOption: IPostcssOption<'mini'>['pxtransform']

  constructor (combination: TCombination) {
    this.combination = combination
  }

  protected abstract getPluginHelper (): typeof BundlerPlugin
  protected abstract getMiniSplitChunksPlugin (): { plugin: any, args: PluginArgs } | undefined
  protected abstract getMiniPluginClass (isBuildNativeComp: boolean): any

  protected getExtraPlugins (): Record<string, { plugin: any, args: PluginArgs }> {
    return {}
  }

  getPlugins () {
    const plugins: Record<string, { plugin: any, args: PluginArgs }> = {
      providerPlugin: this.getProviderPlugin(),
      definePlugin: this.getDefinePlugin(),
      miniCssExtractPlugin: this.getMiniCssExtractPlugin()
    }

    const copyWebpackPlugin = this.getCopyWebpackPlugin()
    if (copyWebpackPlugin) { plugins.copyWebpackPlugin = copyWebpackPlugin }

    if (!this.combination.isBuildPlugin) {
      /** 需要在 MiniPlugin 前，否则无法获取 entry 地址 */
      const miniSplitChunksPlugin = this.getMiniSplitChunksPlugin()
      if (miniSplitChunksPlugin) { plugins.miniSplitChunksPlugin = miniSplitChunksPlugin }
    }

    const definePluginOptions = plugins.definePlugin.args[0]
    const mainPlugin = this.getMainPlugin(definePluginOptions)
    plugins.miniPlugin = mainPlugin

    Object.assign(plugins, this.getExtraPlugins())

    return plugins
  }

  getProviderPlugin () {
    return this.getPluginHelper().getProviderPlugin(getDefaultMiniProviderGlobals())
  }

  getDefinePlugin () {
    return this.getPluginHelper().getDefinePlugin(getMiniDefineConstants(this.combination.config))
  }

  getCopyWebpackPlugin () {
    const combination = this.combination
    const { appPath, config } = combination
    const { copy } = config
    let copyWebpackPlugin

    if (copy?.patterns.length) {
      copyWebpackPlugin = this.getPluginHelper().getCopyWebpackPlugin(appPath, copy)
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
    return this.getPluginHelper().getMiniCssExtractPlugin(args)
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

    const plugin = this.getMiniPluginClass(Boolean(combination.isBuildNativeComp))
    return this.getPluginHelper().getPlugin(plugin, [options])
  }

  getCommonChunks () {
    const { buildNativePlugin, config } = this.combination
    return getCommonChunksList(buildNativePlugin, config)
  }
}
