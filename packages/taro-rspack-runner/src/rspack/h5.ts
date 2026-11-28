import path from 'node:path'

import { rspack } from '@rspack/core'
import { REG_NODE_MODULES_DIR, REG_SCRIPTS, REG_TARO_SCOPED_PACKAGE } from '@tarojs/helper'
import { getDefaultH5TerserOptions } from '@tarojs/runner-utils'
import { type IRule } from '@tarojs/runner-utils/bundler/config/BundlerModule'
import { getH5ResolveConfig } from '@tarojs/runner-utils/bundler/config/H5BaseConfig'
import {
  applyH5CombinationProcess,
  getH5OptimizationConfig,
  getH5OutputConfig
} from '@tarojs/runner-utils/bundler/config/H5Combination'
import { BaseH5Module } from '@tarojs/runner-utils/bundler/config/H5Module'
import { BaseH5PluginConfig } from '@tarojs/runner-utils/bundler/config/H5PluginConfig'
import { BaseH5Plugin, resolveH5EntryLoaderConfig } from '@tarojs/runner-utils/bundler/h5Plugin'
import { getH5HtmlPluginArgs } from '@tarojs/runner-utils/bundler/utils'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import { componentConfig, setH5EntryLoaderResolver, syncModuleComponentMetas } from '../utils/context'
import { BaseConfig, Combination, mergeRspackChain, RspackModule, RspackPlugin } from './base'

import type { Compiler, Configuration } from '@rspack/core'
import type AppHelper from '@tarojs/runner-utils/bundler/app'
import type { IH5BuildConfig } from '../utils/rspack'

type Output = NonNullable<Configuration['output']>
type Optimization = NonNullable<Configuration['optimization']>

class TaroH5Plugin extends BaseH5Plugin {
  private registerResolver () {
    setH5EntryLoaderResolver((resourcePath: string) =>
      resolveH5EntryLoaderConfig(resourcePath, this.appHelper, this.options, id => require.resolve(id))
    )
  }

  protected onAfterRun () {
    this.registerResolver()
  }

  protected applyBundlerHooks (compiler: Compiler) {
    this.registerResolver()
    compiler.hooks.thisCompilation.tap('TaroH5Plugin', compilation => {
      compilation.hooks.finishModules.tap('TaroH5Plugin', () => {
        syncModuleComponentMetas(this.options.onParseCreateElement)
      })
    })
  }
}

export class H5BaseConfig extends BaseConfig {
  defaultTerserOptions = getDefaultH5TerserOptions()

  constructor (appPath: string, config: Partial<IH5BuildConfig>) {
    super(appPath, config)
    const resolve = getH5ResolveConfig(appPath, config.mode)
    resolve.alias['@tarojs/runtime'] ||= require.resolve('@tarojs/runtime')
    resolve.alias['@tarojs/shared'] ||= require.resolve('@tarojs/shared')
    this.chain.merge({ resolve })
    this.setMinimizer(config, this.defaultTerserOptions)
  }
}

export class H5RspackPlugin extends BaseH5PluginConfig<H5Combination> {
  protected getPluginHelper () {
    return RspackPlugin
  }

  protected getHtmlWebpackPluginClass () {
    return HtmlWebpackPlugin
  }

  protected getMainPluginClass () {
    return TaroH5Plugin
  }

  getHtmlWebpackPlugin (template: string, entry = '', chunks: string[] = []) {
    const pxConfig = this.pxtransformOption?.config || {}
    const options = {
      ...pxConfig,
      designWidth: pxConfig.designWidth ?? 750,
      deviceRatio: pxConfig.deviceRatio ?? {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    }
    const args = getH5HtmlPluginArgs(template, entry, chunks, this.combination.config || {}, options)
    return this.getPluginHelper().getPlugin(this.getHtmlWebpackPluginClass(), [args])
  }
}

export class H5RspackModule extends BaseH5Module<H5Combination> {
  protected getModuleClass () {
    return RspackModule
  }

  protected getBaseScriptRule (): IRule {
    return RspackModule.getScriptRule(this.combination.config.onParseCreateElement)
  }

  protected getPreScriptRules (): Record<string, IRule> {
    return {
      taroH5Entry: {
        test: REG_SCRIPTS,
        enforce: 'pre',
        include: [this.combination.sourceDir],
        use: [RspackModule.getLoader(path.resolve(__dirname, '../loaders/taroEntryLoader'), { mode: 'h5' })]
      }
    }
  }
}

export class H5Combination extends Combination<IH5BuildConfig> {
  appHelper: AppHelper
  rspackPlugin = new H5RspackPlugin(this)
  rspackModule = new H5RspackModule(this)

  isMultiRouterMode = false
  isVirtualEntry = false
  noInjectGlobalStyle = false

  constructor (appPath: string, config: IH5BuildConfig) {
    super(appPath, config)
    this.noInjectGlobalStyle = !!config.noInjectGlobalStyle
  }

  process (config: Partial<IH5BuildConfig>) {
    applyH5CombinationProcess({
      combination: this,
      config,
      baseConfig: new H5BaseConfig(this.appPath, config),
      bundlerPlugin: this.rspackPlugin,
      bundlerModule: this.rspackModule,
      componentConfig,
      getVirtualModulePlugin: () => rspack.experiments.VirtualModulesPlugin,
      getPlugin: RspackPlugin.getPlugin,
      getOutput: opts => this.getOutput(opts),
      getOptimization: nodeEnv => this.getOptimization(nodeEnv),
      mergeChain: mergeRspackChain
    })
  }

  getOutput ({
    publicPath = '/',
    chunkDirectory,
    customOutput = {},
    entryFileName = 'app'
  }: {
    publicPath: string
    chunkDirectory: IH5BuildConfig['chunkDirectory']
    customOutput?: Output
    entryFileName?: string
  }): Output {
    const filename: Output['filename'] = (pathData: any) => {
      const runtime = pathData?.chunk?.runtime
      const isEntryRuntime = typeof runtime === 'string'
        ? runtime === entryFileName
        : (typeof runtime?.has === 'function' ? runtime.has(entryFileName) : pathData?.chunk?.name === entryFileName)
      return isEntryRuntime ? 'js/[name].js' : '[name].js'
    }
    return getH5OutputConfig({
      outputDir: this.outputDir,
      publicPath,
      chunkDirectory,
      customOutput,
      filename
    })
  }

  getOptimization (nodeEnv: string): Optimization {
    const optimization = getH5OptimizationConfig({
      nodeEnv,
      isBuildNativeComp: this.isBuildNativeComp
    })
    const splitChunks = optimization.splitChunks
    if (splitChunks && typeof splitChunks === 'object') {
      delete splitChunks.hidePathInfo
      if (nodeEnv !== 'production') {
        delete splitChunks.cacheGroups?.name
        splitChunks.name = false
      }
      if (splitChunks.cacheGroups?.vendors) {
        splitChunks.cacheGroups.vendors.test = (module: any) => {
          const res = module.nameForCondition?.() || module.resource || ''
          return Boolean(res && new RegExp(REG_NODE_MODULES_DIR).test(res))
        }
      }
      if (splitChunks.cacheGroups?.taro) {
        splitChunks.cacheGroups.taro.test = (module: any) => {
          const ctx = module.context || module.nameForCondition?.() || module.resource || ''
          return Boolean(ctx && REG_TARO_SCOPED_PACKAGE.test(ctx))
        }
      }
    }
    return optimization as Optimization
  }
}
