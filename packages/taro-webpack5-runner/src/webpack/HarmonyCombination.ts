import { REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE } from '@tarojs/helper'

import { Combination } from './Combination'
import { HarmonyBaseConfig } from './HarmonyBaseConfig'
import { HarmonyWebpackModule } from './HarmonyWebpackModule'
import { HarmonyWebpackPlugin } from './HarmonyWebpackPlugin'

import type { IFileType, IHarmonyBuildConfig } from '../utils/types'

export class HarmonyCombination extends Combination<IHarmonyBuildConfig> {
  fileType: IFileType

  process (config: Partial<IHarmonyBuildConfig>) {
    const baseConfig = new HarmonyBaseConfig(this.appPath, config)
    const chain = this.chain = baseConfig.chain
    const {
      entry = {},
      output = {},
      mode = 'production',
      sourceMapType = 'cheap-module-source-map',
      fileType = {
        style: '.css',
        config: '.json',
        script: '.js',
        templ: '.hml'
      },
    } = config

    this.fileType = fileType

    const webpackEntry = this.getEntry(entry)
    const webpackOutput = this.getOutput({
      publicPath: '/',
      output
    })
    const webpackPlugin = new HarmonyWebpackPlugin(this)
    const webpackModule = new HarmonyWebpackModule(this)

    const module = webpackModule.getModules()
    const [, pxtransformOption] = webpackModule.__postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
    webpackPlugin.pxtransformOption = pxtransformOption as any
    const plugin = webpackPlugin.getPlugins()

    chain.merge({
      entry: webpackEntry,
      output: webpackOutput,
      mode,
      devtool: this.getDevtool(sourceMapType),
      resolve: {
        alias: this.getAlias()
      },
      plugin,
      module,
      optimization: this.getOptimization()
    })
  }

  getEntry (entry: IHarmonyBuildConfig['entry']) {
    return entry
  }

  getOutput ({ publicPath, output }) {
    return {
      path: this.outputDir,
      publicPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      enabledLibraryTypes: [],
      ...output
    }
  }

  getAlias () {
    const { alias = {} } = this.config
    return { ...alias }
  }

  getOptimization () {
    return {
      usedExports: true,
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          default: false,
          defaultVendors: false,
          common: {
            name: 'common',
            minChunks: 2,
            priority: 1
          },
          vendors: {
            name: 'vendors',
            minChunks: 2,
            test: module => {
              const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
              return nodeModulesDirRegx.test(module.resource)
            },
            priority: 10
          },
          taro: {
            name: 'taro',
            test: module => REG_TARO_SCOPED_PACKAGE.test(module.context),
            priority: 100
          }
        }
      }
    }
  }
}
