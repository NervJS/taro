import path from 'node:path'

import { REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE, taroJsComponents } from '@tarojs/helper'

import { SHARED_GLOBAL_ASYNC } from '../shared-runtime/constants'
import { REG_SHARED_REACT, shouldShareExternal } from '../shared-runtime/externals'
import { componentConfig } from '../utils/component'
import { BuildNativePlugin } from './BuildNativePlugin'
import { Combination } from './Combination'
import { MiniBaseConfig } from './MiniBaseConfig'
import { MiniWebpackModule } from './MiniWebpackModule'
import { MiniWebpackPlugin } from './MiniWebpackPlugin'

import type SubPackageIndiePlugin from '../plugins/SubPackageIndiePlugin'
import type { IFileType, IMiniBuildConfig } from '../utils/types'

export class MiniCombination extends Combination<IMiniBuildConfig> {
  buildNativePlugin: BuildNativePlugin
  fileType: IFileType
  isBuildPlugin = false
  // subPackageIndie(--new-blended)场景下,MiniPlugin.apply 把 SubPackageIndiePlugin 实例反向挂这里,
  // 供主构建结束后的 buildSharedRuntime 读取 mainPackageRoots(把同步核拷进每个 mainPackageRoot 实现自包含)。
  subPackageIndiePlugin?: SubPackageIndiePlugin
  optimizeMainPackage: { enable?: boolean | undefined, exclude?: any[] | undefined } = {
    enable: true
  }

  process (config: Partial<IMiniBuildConfig>) {
    const baseConfig = new MiniBaseConfig(this.appPath, config)
    const chain = this.chain = baseConfig.chain
    const {
      entry = {},
      output = {},
      mode = 'production',
      globalObject = 'wx',
      sourceMapType = 'cheap-module-source-map',
      fileType = {
        style: '.wxss',
        config: '.json',
        script: '.js',
        templ: '.wxml'
      },
      /** special mode */
      isBuildPlugin = false,
      sharedRuntime = false,
      sharedRuntimeExtraPackages = [],
      sharedRuntimeSyncExtraPackages = [],
      /** hooks */
      modifyComponentConfig,
      optimizeMainPackage
    } = config

    this.fileType = fileType

    modifyComponentConfig?.(componentConfig, config)

    if (isBuildPlugin) {
      // 编译目标 - 小程序原生插件
      this.isBuildPlugin = true
      this.buildNativePlugin = BuildNativePlugin.getPlugin(this)
      chain.merge({
        context: path.join(process.cwd(), this.sourceRoot, 'plugin')
      })
    }

    if (optimizeMainPackage) {
      this.optimizeMainPackage = optimizeMainPackage
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

    const module = webpackModule.getModules()
    const [, pxtransformOption] = webpackModule.__postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
    webpackPlugin.pxtransformOption = pxtransformOption as any
    const plugin = webpackPlugin.getPlugins()

    // 共享运行时（split 模式）：把 Taro/React 运行时 external 到全局，产物里不再含这些包，
    // 由运行时核（同步核 + 异步核）在加载时挂到 wx.__TARO_RT_ASYNC_V1__ 供业务包读取。
    // sharedRuntimeSyncExtraPackages 与 sharedRuntimeExtraPackages 都是"共享 external"清单
    // (external 判定与执行时机无关,时机差异只体现在异步核 vs 同步核 entry 归属),故合并.
    const allExtraPackages = [...sharedRuntimeExtraPackages, ...sharedRuntimeSyncExtraPackages]
    const sharedExternals: any[] = sharedRuntime
      ? [({ request }, cb) => {
        if (shouldShareExternal(request, allExtraPackages)) {
          // external 目标读平台全局对象（不硬编码 wx.），为多平台留口
          return cb(null, `${globalObject}.${SHARED_GLOBAL_ASYNC}[${JSON.stringify(request)}]`)
        }
        return cb()
      }]
      : []

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
      externals: sharedExternals,
      optimization: this.getOptimization(sharedRuntime)
    })
  }

  getEntry (entry: IMiniBuildConfig['entry']) {
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
      [`${taroJsComponents}$`]: taroComponentsPath
    }
  }

  getOptimization (sharedRuntime = false) {
    const cacheGroups: any = {
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
          // sharedRuntime 下 react 全家桶已 external，从 vendors 剔出，避免产出空 chunk
          if (sharedRuntime && REG_SHARED_REACT.test(module.rawRequest || '')) {
            return false
          }
          const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
          return nodeModulesDirRegx.test(module.resource)
        },
        priority: 10
      }
    }
    // sharedRuntime 下 @tarojs/* 已 external，不再产出 taro chunk
    if (!sharedRuntime) {
      cacheGroups.taro = {
        name: 'taro',
        test: module => REG_TARO_SCOPED_PACKAGE.test(module.context),
        priority: 100
      }
    }
    return {
      usedExports: true,
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups
      }
    }
  }
}
