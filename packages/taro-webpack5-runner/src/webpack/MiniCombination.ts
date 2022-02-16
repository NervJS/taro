import { recursiveMerge, taroJsComponents } from '@tarojs/helper'
import { Combination } from './Combination'
import { MiniBaseConfig } from './MiniBaseConfig'
import { WebpackPlugin } from './WebpackPlugin'
import { MiniWebpackPlugin } from './MiniWebpackPlugin'
import { MiniWebpackModule } from './MiniWebpackModule'
import { BuildNativePlugin } from './BuildNativePlugin'
import { componentConfig } from '../template/component'

import type { Entry } from 'webpack'
import type { MiniBuildConfig, IFileType } from '../utils/types'

export class MiniCombination extends Combination<MiniBuildConfig> {
  isBuildNativeComp = false
  isBuildPlugin = false
  enableSourceMap: boolean
  buildNativePlugin: BuildNativePlugin
  fileType: IFileType
  defaultTerserOptions: {
    parse: {
      ecma: 8
    },
    compress: {
      ecma: 5,
      warnings: false,
      arrows: false,
      collapse_vars: false,
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      inline: false,
      loops: false,
      negate_iife: false,
      properties: false,
      reduce_funcs: false,
      reduce_vars: false,
      switches: false,
      toplevel: false,
      typeofs: false,
      booleans: true,
      if_return: true,
      sequences: true,
      unused: true,
      conditionals: true,
      dead_code: true,
      evaluate: true
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true
    }
  }

  process (config: Partial<MiniBuildConfig>) {
    const baseConfig = new MiniBaseConfig(this.appPath, config)
    const chain = this.chain = baseConfig.chain
    const {
      entry = {},
      output = {},
      mode = 'production',
      globalObject = 'wx',
      enableSourceMap = process.env.NODE_ENV !== 'production',
      sourceMapType = 'cheap-module-source-map',
      fileType = {
        style: '.wxss',
        config: '.json',
        script: '.js',
        templ: '.wxml'
      },
      /** special mode */
      isBuildNativeComp = false,
      isBuildPlugin = false,
      /** hooks */
      modifyComponentConfig
    } = config

    this.fileType = fileType
    this.enableSourceMap = enableSourceMap

    modifyComponentConfig?.(componentConfig, config)

    if (isBuildNativeComp) {
      this.isBuildNativeComp = true
    }

    if (isBuildPlugin) {
      // 编译目标 - 小程序原生插件
      this.isBuildPlugin = true
      this.buildNativePlugin = BuildNativePlugin.getPlugin(this)
    }

    const webpackEntry = this.getEntry(entry)
    const webpackOutput = this.getOutput({
      publicPath: '/',
      globalObject,
      isBuildPlugin,
      output
    })
    const webpackPlugin = new MiniWebpackPlugin(this)
    const webpackModule = new MiniWebpackModule(this)

    chain.merge({
      entry: webpackEntry,
      output: webpackOutput,
      mode,
      devtool: this.getDevtool(enableSourceMap, sourceMapType),
      resolve: {
        alias: this.getAlias()
      },
      plugin: webpackPlugin.getPlugins(),
      module: webpackModule.getModules(),
      optimization: this.getOptimization(mode)
    })
  }

  getEntry (entry: Entry) {
    return this.isBuildPlugin ? this.buildNativePlugin.entry : entry
  }

  getOutput ({ publicPath, globalObject, isBuildPlugin, output }) {
    return {
      path: this.outputDir,
      publicPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      globalObject,
      enabledLibraryTypes: isBuildPlugin ? ['commonjs'] : [],
      ...output
    }
  }

  getAlias () {
    const { alias = {}, taroComponentsPath } = this.config
    return {
      ...alias,
      [`${taroJsComponents}$`]: taroComponentsPath || `${taroJsComponents}/mini`
    }
  }

  getOptimization (mode: string) {
    const { terser } = this.config
    const minimizer: Record<string, any> = {}
    const isTerserEnabled = !(terser?.enable === false)

    if (mode === 'production' && isTerserEnabled) {
      const terserOptions = recursiveMerge({}, this.defaultTerserOptions, terser?.config || {})
      minimizer.terserPlugin = WebpackPlugin.getTerserPlugin(terserOptions)
    }

    const chunkPrefix = this.isBuildPlugin ? this.buildNativePlugin.chunkPrefix : ''

    return {
      usedExports: true,
      minimizer,
      runtimeChunk: {
        name: `${chunkPrefix}runtime`
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          default: false,
          defaultVendors: false,
          common: {
            name: `${chunkPrefix}common`,
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: `${chunkPrefix}vendors`,
            minChunks: 2,
            test: module => /[\\/]node_modules[\\/]/.test(module.resource),
            priority: 10
          },
          taro: {
            name: `${chunkPrefix}taro`,
            test: module => /@tarojs[\\/][a-z]+/.test(module.context),
            priority: 100
          }
        }
      }
    }
  }
}
