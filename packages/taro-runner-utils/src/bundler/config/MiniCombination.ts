import path from 'node:path'

import { REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE, taroJsComponents } from '@tarojs/helper'

import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { IFileType } from '../types'

export function getMiniOutputConfig (opts: {
  outputDir: string
  publicPath: string
  globalObject: string
  isBuildPlugin: boolean
  output?: Record<string, any>
}) {
  return {
    path: opts.outputDir,
    publicPath: opts.publicPath,
    filename: '[name].js',
    chunkFilename: '[name].js',
    globalObject: opts.globalObject,
    enabledLibraryTypes: opts.isBuildPlugin ? ['commonjs'] : [],
    ...opts.output
  }
}

export function getMiniOptimizationConfig (opts: {
  extraCacheGroups?: Record<string, any>
} = {}) {
  return {
    usedExports: true,
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      chunks: 'all' as const,
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        default: false as const,
        defaultVendors: false as const,
        common: { name: 'common', minChunks: 2, priority: 1 },
        vendors: {
          name: 'vendors',
          minChunks: 2,
          test: (module: any) => {
            const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
            return nodeModulesDirRegx.test(module.resource)
          },
          priority: 10
        },
        taro: {
          name: 'taro',
          test: (module: any) => REG_TARO_SCOPED_PACKAGE.test(module.context),
          priority: 100
        },
        ...opts.extraCacheGroups
      }
    }
  }
}

export function getMiniAliasConfig (config: Record<string, any>): Record<string, any> {
  const { alias = {}, taroComponentsPath } = config
  return {
    ...alias,
    [`${taroJsComponents}$`]: taroComponentsPath
  }
}

export function applyMiniCombinationProcess (opts: {
  combination: any
  config: Record<string, any>
  baseConfig: { chain: any }
  createBuildNativePlugin: () => any
  createMiniPlugin: () => any
  createMiniModule: () => any
  componentConfig: IComponentConfig
  getEntry?: (entry: any) => any
  getOutput?: (opts: any) => Record<string, any>
  getAlias?: () => Record<string, any>
  getOptimization?: (miniPlugin: any) => Record<string, any>
  mergeChain?: (chain: any, merged: Record<string, any>) => void
}) {
  const { combination, config, baseConfig, createBuildNativePlugin, createMiniPlugin, createMiniModule, componentConfig, mergeChain } = opts
  const chain = combination.chain = baseConfig.chain
  const {
    entry = {}, output = {}, mode = 'production', globalObject = 'wx',
    sourceMapType = 'cheap-module-source-map',
    fileType = { style: '.wxss', config: '.json', script: '.js', templ: '.wxml' } as IFileType,
    isBuildPlugin = false, modifyComponentConfig, optimizeMainPackage
  } = config

  combination.fileType = fileType
  modifyComponentConfig?.(componentConfig, config)

  if (isBuildPlugin) {
    // 编译目标 - 小程序原生插件
    combination.isBuildPlugin = true
    combination.buildNativePlugin = createBuildNativePlugin()
    chain.merge({ context: path.join(process.cwd(), combination.sourceRoot, 'plugin') })
  }
  if (optimizeMainPackage) {
    combination.optimizeMainPackage = optimizeMainPackage
  }

  const bundlerEntry = (opts.getEntry || (e => combination.getEntry(e)))(entry)
  const bundlerOutput = (opts.getOutput || (o => combination.getOutput(o)))({ publicPath: '/', globalObject, isBuildPlugin, output })
  const bundlerPlugin = createMiniPlugin()
  const bundlerModule = createMiniModule()

  const module = bundlerModule.getModules()
  const [, pxtransformOption] = bundlerModule.__postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
  bundlerPlugin.pxtransformOption = pxtransformOption as any
  const plugin = bundlerPlugin.getPlugins()

  const mergedConfig = {
    entry: bundlerEntry,
    output: bundlerOutput,
    mode,
    devtool: combination.getDevtool(sourceMapType),
    resolve: { alias: (opts.getAlias || (() => combination.getAlias()))() },
    plugin,
    module,
    optimization: (opts.getOptimization || (p => combination.getOptimization(p)))(bundlerPlugin)
  }
  mergeChain ? mergeChain(chain, mergedConfig) : chain.merge(mergedConfig)
}
