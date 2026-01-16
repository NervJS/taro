import { PLATFORMS } from '@tarojs/helper'
import { isArray, isFunction, PLATFORM_TYPE } from '@tarojs/shared'

import HarmonyPlugin from '../plugins/HarmonyPlugin'
import WebpackPlugin, { PluginArgs } from './WebpackPlugin'

import type { IPostcssOption } from '@tarojs/taro/types/compile'
import type { HarmonyCombination } from './HarmonyCombination'

export class HarmonyWebpackPlugin {
  combination: HarmonyCombination
  pxtransformOption: IPostcssOption<'harmony'>['pxtransform']

  constructor (combination: HarmonyCombination) {
    this.combination = combination
  }

  getPlugins () {
    const plugins: Record<string, { plugin: any, args: PluginArgs }> = {
      providerPlugin: this.getProviderPlugin(),
      definePlugin: this.getDefinePlugin(),
    }

    const copyWebpackPlugin = this.getCopyWebpackPlugin()
    if (copyWebpackPlugin) plugins.copyWebpackPlugin = copyWebpackPlugin

    const definePluginOptions = plugins.definePlugin.args[0]
    plugins.mainPlugin = this.getMainPlugin(definePluginOptions)

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
      defineConstants = {},
      framework = 'react',
      buildAdapter = PLATFORMS.WEAPP
    } = this.combination.config

    env.FRAMEWORK = JSON.stringify(framework)
    env.TARO_ENV = JSON.stringify(buildAdapter)
    env.TARO_PLATFORM = JSON.stringify(process.env.TARO_PLATFORM || PLATFORM_TYPE.HARMONY)
    const envConstants = Object.keys(env).reduce((target, key) => {
      target[`process.env.${key}`] = env[key]
      return target
    }, {})

    return WebpackPlugin.getDefinePlugin([envConstants, defineConstants])
  }

  getCopyWebpackPlugin () {
    const combination = this.combination
    const { appPath, config } = combination
    let copyWebpackPlugin

    if (config.copy?.patterns.length) {
      copyWebpackPlugin = WebpackPlugin.getCopyWebpackPlugin(appPath, config.copy)
    }

    return copyWebpackPlugin
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

    return WebpackPlugin.getPlugin(HarmonyPlugin, [options])
  }

  getCommonChunks () {
    const { config } = this.combination
    const { commonChunks } = config
    const defaultCommonChunks = ['runtime', 'vendors', 'taro', 'common']
    let customCommonChunks: string[] = defaultCommonChunks
    if (isFunction(commonChunks)) {
      customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
    } else if (isArray(commonChunks) && commonChunks.length) {
      customCommonChunks = commonChunks
    }
    return customCommonChunks
  }
}
