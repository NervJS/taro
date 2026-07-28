import path from 'node:path'

import { REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE, taroJsComponents } from '@tarojs/helper'

import { SHARED_GLOBAL_ASYNC, SHARED_GLOBAL_HOST } from '../shared-runtime/constants'
import { componentConfig } from '../utils/component'
import { BuildNativePlugin } from './BuildNativePlugin'
import { Combination } from './Combination'
import { MiniBaseConfig } from './MiniBaseConfig'
import { MiniWebpackModule } from './MiniWebpackModule'
import { MiniWebpackPlugin } from './MiniWebpackPlugin'

import type { IFileType, IMiniBuildConfig } from '../utils/types'

export class MiniCombination extends Combination<IMiniBuildConfig> {
  buildNativePlugin: BuildNativePlugin
  fileType: IFileType
  isBuildPlugin = false
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
      sharedRuntimeMode = 'host',
      sharedRuntimeExtraPackages = [],
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

    // sharedRuntime：把 Taro/React 运行时 external 到全局，由运行时核提供。
    // 三模式分用全局名，共存零冲突：host/async-host→wx.__TARO_RT__（同名，语义一致：全量核挂载点），split→wx.__TARO_RT_ASYNC__。
    const globalKey = sharedRuntimeMode === 'split' ? SHARED_GLOBAL_ASYNC : SHARED_GLOBAL_HOST
    const REG_SHARED_REACT = /^(react|react-dom|react-reconciler|scheduler)(\/|$)/
    const shouldShareExternal = (request?: string) => {
      if (!request) return false
      // 只处理裸模块请求：排除内联 loader(!)、query(?)、相对/绝对路径
      if (/[!?]/.test(request) || request.startsWith('.') || request.startsWith('/')) return false
      // @tarojs/taro-loader 是编译期 loader，不能 external
      if (request.startsWith('@tarojs/taro-loader')) return false
      // @tarojs/components 不能 external：Taro 的 base.wxml 模板收集依赖组件在编译模块图中可见，
      // external 后模板生成器扫不到组件使用会漏生成模板（如 Button 的 tmpl_0_14）。
      // 且组件本身是 'view'/'button' 字符串常量，体积极小，各业务包自带无成本。
      if (request === '@tarojs/components' || request.startsWith('@tarojs/components/')) return false
      // 接入方声明的额外共享包（CLI 不认识具体包名，全由 config.mini.sharedRuntimeExtraPackages 传入）
      if (sharedRuntimeExtraPackages.some((p: string) => request === p || request.startsWith(p + '/'))) return true
      return REG_TARO_SCOPED_PACKAGE.test(request) || REG_SHARED_REACT.test(request)
    }
    const sharedExternals: any[] = sharedRuntime
      ? [({ request }, cb) => {
        if (shouldShareExternal(request)) {
          return cb(null, `wx.${globalKey}[${JSON.stringify(request)}]`)
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
    const REG_SHARED_REACT = /^(react|react-dom|react-reconciler|scheduler)(\/|$)/
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
          const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
          // sharedRuntime 下 react 全家桶已 external，剔出 vendors，避免空跑
          if (sharedRuntime && REG_SHARED_REACT.test(module.rawRequest || '')) {
            return false
          }
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
