import { type PluginArgs } from '@tarojs/runner-utils/bundler/config/BundlerPlugin'
import { BaseMiniPluginConfig } from '@tarojs/runner-utils/bundler/config/MiniPluginConfig'

import BuildNativePlugin from '../plugins/BuildNativePlugin'
import MiniCompileModePlugin from '../plugins/MiniCompileModePlugin'
import MiniPlugin from '../plugins/MiniPlugin'
import MiniSplitChunksPlugin from '../plugins/MiniSplitChunksPlugin'
import WebpackPlugin from './WebpackPlugin'

import type { MiniCombination } from './MiniCombination'

export class MiniWebpackPlugin extends BaseMiniPluginConfig<MiniCombination> {
  protected getPluginHelper () {
    return WebpackPlugin
  }

  getMiniSplitChunksPlugin () {
    const { fileType, optimizeMainPackage } = this.combination
    if (!optimizeMainPackage?.enable) { return }

    return WebpackPlugin.getPlugin(MiniSplitChunksPlugin, [{
      exclude: optimizeMainPackage.exclude,
      fileType,
      combination: this.combination
    }])
  }

  protected getMiniPluginClass (isBuildNativeComp: boolean) {
    return isBuildNativeComp ? BuildNativePlugin : MiniPlugin
  }

  protected getExtraPlugins (): Record<string, { plugin: any, args: PluginArgs }> {
    if (this.combination.config.experimental?.compileMode !== true) { return {} }
    return {
      taroCompileModePlugin: WebpackPlugin.getPlugin(MiniCompileModePlugin, [{
        combination: this.combination,
      }])
    }
  }
}
