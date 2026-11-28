import path from 'node:path'

import { recursiveMerge, REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE } from '@tarojs/helper'
import { getDefaultMiniTerserOptions } from '@tarojs/runner-utils'
import { BaseBuildNativePluginConfig } from '@tarojs/runner-utils/bundler/config/BuildNativePlugin'
import { type IRule } from '@tarojs/runner-utils/bundler/config/BundlerModule'
import { getMiniBaseConfigMerge } from '@tarojs/runner-utils/bundler/config/MiniBaseConfig'
import {
  applyMiniCombinationProcess,
  getMiniAliasConfig,
  getMiniOptimizationConfig,
  getMiniOutputConfig
} from '@tarojs/runner-utils/bundler/config/MiniCombination'
import { BaseMiniModule } from '@tarojs/runner-utils/bundler/config/MiniModule'
import { BaseMiniPluginConfig } from '@tarojs/runner-utils/bundler/config/MiniPluginConfig'

import MiniPlugin, { BuildNativePlugin } from '../plugins/MiniPlugin'
import MiniSplitChunksPlugin from '../plugins/MiniSplitChunksPlugin'
import { componentConfig, TARO_ENTRY_QUERY_KEY, TARO_TEMPLATE_QUERY_KEY } from '../utils/context'
import { BaseConfig, Combination, mergeRspackChain, RspackModule, RspackPlugin } from './base'

import type { EntryObject } from '@rspack/core'
import type { IFileType, IMiniBuildConfig } from '../utils/rspack'

export class MiniBaseConfig extends BaseConfig {
  defaultTerserOptions = getDefaultMiniTerserOptions()

  constructor (appPath: string, config: Partial<IMiniBuildConfig>) {
    super(appPath, config)
    const mergeConfig = getMiniBaseConfigMerge(appPath, require.resolve('regenerator-runtime'))
    mergeConfig.resolve.alias['@tarojs/runtime'] ||= require.resolve('@tarojs/runtime')
    mergeConfig.resolve.alias['@tarojs/shared'] ||= require.resolve('@tarojs/shared')
    this.chain.merge(mergeConfig)
    this.setMinimizer(config, this.defaultTerserOptions)
  }
}

export class MiniRspackPlugin extends BaseMiniPluginConfig<MiniCombination> {
  splitChunksInstance?: MiniSplitChunksPlugin

  protected getPluginHelper () {
    return RspackPlugin
  }

  getMiniSplitChunksPlugin () {
    const { fileType, optimizeMainPackage } = this.combination
    if (!optimizeMainPackage?.enable) return

    this.splitChunksInstance = new MiniSplitChunksPlugin({
      ...optimizeMainPackage,
      fileType,
      combination: this.combination
    })
    const instance = this.splitChunksInstance
    return RspackPlugin.getPlugin(
      class BoundMiniSplitChunksPlugin {
        apply (compiler: any) {
          instance.apply(compiler)
        }
      },
      []
    )
  }

  protected getMiniPluginClass (isBuildNativeComp: boolean) {
    return isBuildNativeComp ? BuildNativePlugin : MiniPlugin
  }
}

export class MiniRspackModule extends BaseMiniModule<MiniCombination> {
  protected getModuleClass () {
    return RspackModule
  }

  protected getEffectivePostcssOption (postcssOption: Record<string, any>) {
    const platform = process.env.TARO_ENV || this.combination.config.buildAdapter
    if (!platform) return postcssOption
    return recursiveMerge({}, {
      pxtransform: { config: { platform } },
      htmltransform: { config: { platform } }
    }, postcssOption)
  }

  protected getBaseScriptRule (): IRule {
    return RspackModule.getScriptRule(this.combination.config.onParseCreateElement)
  }

  protected getPostScriptRules (): Record<string, IRule> {
    return {
      taroMiniEntry: {
        enforce: 'post',
        resourceQuery: new RegExp(`${TARO_ENTRY_QUERY_KEY}|${TARO_TEMPLATE_QUERY_KEY}`),
        use: [RspackModule.getLoader(path.resolve(__dirname, '../loaders/taroEntryLoader'), { mode: 'mini' })]
      }
    }
  }

  protected getExtraRules (): Record<string, IRule> {
    if (!this.combination.isBuildNativeComp) return {}
    return {
      taroRuntime: {
        test: /@tarojs[\\/]runtime/,
        enforce: 'post',
        use: [RspackModule.getLoader('@tarojs/taro-loader/lib/taro-runtime', {
          runtimePath: this.combination.config.runtimePath
        })]
      }
    }
  }
}

export class MiniCombination extends Combination<IMiniBuildConfig> {
  buildNativePlugin: BaseBuildNativePluginConfig<MiniCombination, EntryObject>
  fileType: IFileType
  isBuildPlugin = false
  optimizeMainPackage: { enable?: boolean, exclude?: any[] } = {
    enable: true
  }

  process (config: Partial<IMiniBuildConfig>) {
    applyMiniCombinationProcess({
      combination: this,
      config,
      baseConfig: new MiniBaseConfig(this.appPath, config),
      createBuildNativePlugin: () => new BaseBuildNativePluginConfig<MiniCombination, EntryObject>(this),
      createMiniPlugin: () => new MiniRspackPlugin(this),
      createMiniModule: () => new MiniRspackModule(this),
      componentConfig,
      getEntry: entry => this.getEntry(entry),
      getOutput: opts => this.getOutput(opts),
      getAlias: () => this.getAlias(),
      getOptimization: (miniPlugin: MiniRspackPlugin) => this.getOptimization(miniPlugin.splitChunksInstance?.getCacheGroups() || {}),
      mergeChain: mergeRspackChain
    })
  }

  getEntry (entry: IMiniBuildConfig['entry']) {
    return this.isBuildPlugin ? this.buildNativePlugin.entry : entry
  }

  getOutput ({ publicPath, globalObject, isBuildPlugin, output }) {
    return getMiniOutputConfig({
      outputDir: this.outputDir,
      publicPath,
      globalObject,
      isBuildPlugin,
      output
    })
  }

  getAlias () {
    return getMiniAliasConfig(this.config)
  }

  getOptimization (extraCacheGroups: Record<string, any> = {}) {
    const optimization = getMiniOptimizationConfig({ extraCacheGroups })
    const cacheGroups = optimization.splitChunks?.cacheGroups as Record<string, any> | undefined
    if (cacheGroups?.vendors) {
      cacheGroups.vendors.test = (module: any) => {
        const res = module.nameForCondition?.() || module.resource || ''
        return Boolean(res && new RegExp(REG_NODE_MODULES_DIR).test(res))
      }
    }
    if (cacheGroups?.taro) {
      cacheGroups.taro.test = (module: any) => {
        const ctx = module.context || module.nameForCondition?.() || module.resource || ''
        return Boolean(
          ctx &&
          (REG_TARO_SCOPED_PACKAGE.test(ctx) || /[\\/]packages[\\/](taro(-[a-z0-9-]+)?|shared)[\\/]/.test(ctx))
        )
      }
    }
    return optimization
  }
}
