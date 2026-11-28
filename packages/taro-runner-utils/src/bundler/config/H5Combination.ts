import { REG_NODE_MODULES_DIR, REG_TARO_SCOPED_PACKAGE, resolveSync } from '@tarojs/helper'

import AppHelper from '../app'
import { parsePublicPath } from '../utils'

import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { PluginArgs } from './BundlerPlugin'

export function getH5OutputConfig (opts: {
  outputDir: string
  publicPath?: string
  chunkDirectory?: string
  customOutput?: Record<string, any>
  filename: any
}) {
  return {
    path: opts.outputDir,
    filename: opts.filename,
    chunkFilename: `${opts.chunkDirectory}/[name].js`,
    publicPath: parsePublicPath(opts.publicPath ?? '/'),
    ...opts.customOutput
  }
}

export function getH5OptimizationConfig (opts: {
  nodeEnv: string
  isBuildNativeComp?: boolean
}) {
  const isProd = opts.nodeEnv === 'production'
  const cacheGroups: Record<string, any> = {
    default: false,
    defaultVendors: false,
    common: { name: isProd ? false : 'common', minChunks: 2, priority: 1 },
    vendors: {
      name: isProd ? false : 'vendors',
      minChunks: 2,
      test: (module: any) => {
        const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)
        return nodeModulesDirRegx.test(module.resource)
      },
      priority: 10
    },
    taro: {
      name: isProd ? false : 'taro',
      test: (module: any) => REG_TARO_SCOPED_PACKAGE.test(module.context),
      priority: 100
    }
  }

  const optimization: Record<string, any> = {
    nodeEnv: opts.nodeEnv,
    chunkIds: isProd ? 'deterministic' : 'named', // false 或导致编译错误，natural、size、total-size 与 prebundle 特性不兼容
    removeEmptyChunks: true,
    splitChunks: {
      chunks: 'initial',
      hidePathInfo: true,
      minSize: 0,
      cacheGroups
    }
  }
  if (!isProd) {
    cacheGroups.name = false
    optimization.runtimeChunk = 'single'
  }
  // 组件编译模式下不做代码分割
  if (opts.isBuildNativeComp) {
    optimization.splitChunks = false
    optimization.runtimeChunk = false
  }
  return optimization
}

export function applyH5CombinationProcess (opts: {
  combination: any
  config: Record<string, any>
  baseConfig: { chain: any }
  bundlerPlugin: any
  bundlerModule: any
  componentConfig: IComponentConfig
  getVirtualModulePlugin: () => any
  getPlugin: (plugin: any, args: PluginArgs) => { plugin: any, args: PluginArgs }
  getOutput?: (opts: any) => Record<string, any>
  getOptimization?: (nodeEnv: string) => Record<string, any>
  mergeChain?: (chain: any, merged: Record<string, any>) => void
}) {
  const { combination, config, baseConfig, bundlerPlugin, bundlerModule, componentConfig, getVirtualModulePlugin, getPlugin, mergeChain } = opts
  const chain = combination.chain = baseConfig.chain
  const {
    entry = {}, output = {}, entryFileName = 'app', mode = 'production',
    sourceMapType = 'eval-cheap-module-source-map', publicPath = '/', chunkDirectory = 'chunk',
    alias = {}, defineConstants = {}, router, frameworkExts, modifyAppConfig, modifyComponentConfig
  } = config
  const routerMode = router?.mode || 'hash'
  combination.isMultiRouterMode = routerMode === 'multi'
  const appHelper = combination.appHelper = new AppHelper(entry as any, {
    sourceDir: combination.sourceDir, frameworkExts, entryFileName, alias, defineConstants, modifyAppConfig
  })

  modifyComponentConfig?.(componentConfig, config)

  let isVirtualEntry = false
  const virtualEntryMap: Record<string, string> = {}
  if (combination.isBuildNativeComp) {
    delete entry[entryFileName]
    appHelper.compsConfigList.forEach((comp, index) => {
      try {
        resolveSync(comp, { extensions: ['.js', '.ts'] })
      } catch {
        // 报错证明没有入口文件，通过虚拟模块补全入口文件
        isVirtualEntry = true
        // 添加后缀，否则 module.resource 解析出来的 name 是不带后缀的，导致 h5-loader 无法加入编译流程
        comp += '.js'
        virtualEntryMap[comp] = 'export default {}'
      }
      entry[index] = [comp]
    })
    bundlerPlugin.pages = appHelper.appConfig?.components
  } else if (combination.isMultiRouterMode) {
    delete entry[entryFileName]
    appHelper.pagesConfigList.forEach((page, index) => {
      entry[index] = [page]
    })
    bundlerPlugin.pages = appHelper.appConfig?.pages
  }
  combination.isVirtualEntry = isVirtualEntry

  const getOutput = opts.getOutput || (o => combination.getOutput(o))
  const getOptimization = opts.getOptimization || (env => combination.getOptimization(env))
  const bundlerOutput = getOutput({ publicPath, chunkDirectory, customOutput: output as Record<string, any>, entryFileName })
  const module = bundlerModule.getModules()
  const [, pxtransformOption] = bundlerModule.__postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
  bundlerPlugin.pxtransformOption = pxtransformOption as any
  const plugin = bundlerPlugin.getPlugins()

  if (combination.isBuildNativeComp) {
    if (combination.isVirtualEntry) {
      plugin.VirtualModule = getPlugin(getVirtualModulePlugin(), [virtualEntryMap])
    }
    // Note: 当开发者没有配置时，优先使用 module 导出组件
    if (!bundlerOutput.libraryTarget && !bundlerOutput.library?.type) {
      bundlerOutput.library = { name: bundlerOutput.library, type: 'umd' }
    }
  }

  const mergedConfig = {
    entry,
    output: bundlerOutput,
    mode,
    devtool: combination.getDevtool(sourceMapType),
    resolve: { alias },
    plugin,
    module,
    optimization: getOptimization(mode),
    externals: [] as any[]
  }
  mergeChain ? mergeChain(chain, mergedConfig) : chain.merge(mergedConfig)
}
