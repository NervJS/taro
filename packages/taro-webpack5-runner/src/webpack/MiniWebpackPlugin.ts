import { PLATFORMS } from '@tarojs/helper'
import { isArray, isFunction, PLATFORM_TYPE } from '@tarojs/shared'
import { IPostcssOption } from '@tarojs/taro/types/compile'

import BuildNativePlugin from '../plugins/BuildNativePlugin'
import MiniCompileModePlugin from '../plugins/MiniCompileModePlugin'
import MiniPlugin from '../plugins/MiniPlugin'
import MiniSplitChunksPlugin from '../plugins/MiniSplitChunksPlugin'
import TaroInjectSyncCorePlugin from '../plugins/TaroInjectSyncCorePlugin'
import { SHARED_SYNC_CORE_NAME } from '../shared-runtime/constants'
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

    // 共享运行时（split 模式）：给 app 入口头部注入 require('taro-shared-sync')，
    // 使同步核先于页面注册执行（填共享全局 + 装占位 shim + 触发异步核加载）。
    // native-components(F6）场景：BuildNativePlugin 删了 ENTRY dep、无 app.js, 每个
    // native-component 是 META_TYPE.PAGE，需在 PAGE chunk 顶部也注入同步核 require。
    if (this.combination.config.sharedRuntime) {
      plugins.taroInjectSyncCorePlugin = WebpackPlugin.getPlugin(TaroInjectSyncCorePlugin, [{
        syncCoreName: SHARED_SYNC_CORE_NAME,
        injectOnPage: !!this.combination.isBuildNativeComp,
      }])
    }

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
      MutationObserver: ['@tarojs/runtime', 'MutationObserver'],
      history: ['@tarojs/runtime', 'history'],
      location: ['@tarojs/runtime', 'location'],
      URLSearchParams: ['@tarojs/runtime', 'URLSearchParams'],
      URL: ['@tarojs/runtime', 'URL'],
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
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.MINI)
    env.SUPPORT_TARO_POLYFILL = env.SUPPORT_TARO_POLYFILL || '"disabled"'
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
    const { commonChunks, sharedRuntime } = config
    const defaultCommonChunks = buildNativePlugin?.commonChunks || ['runtime', 'vendors', 'taro', 'common']
    let customCommonChunks: string[] = defaultCommonChunks
    if (isFunction(commonChunks)) {
      customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
    } else if (isArray(commonChunks) && commonChunks.length) {
      customCommonChunks = commonChunks
    }
    // sharedRuntime 下不再产出 taro chunk，从 commonChunks 过滤，否则页面 require 头会引用不存在的 taro.js
    if (sharedRuntime) {
      customCommonChunks = customCommonChunks.filter(name => name !== 'taro')
    }
    return customCommonChunks
  }
}
