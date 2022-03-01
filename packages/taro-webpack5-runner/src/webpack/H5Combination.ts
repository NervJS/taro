import { FRAMEWORK_MAP, resolveMainFilePath } from '@tarojs/helper'
import * as path from 'path'
import * as webpack from 'webpack'
import { Combination } from './Combination'
import { H5BaseConfig } from './H5BaseConfig'
import { H5WebpackPlugin } from './H5WebpackPlugin'
import { H5WebpackModule } from './H5WebpackModule'
import { addLeadingSlash, addTrailingSlash } from '../utils'

import H5AppInstance from '../utils/H5AppInstance'
import type { H5BuildConfig } from '../utils/types'
type Output = Required<webpack.Configuration>['output']

export class H5Combination extends Combination<H5BuildConfig> {
  enableSourceMap: boolean

  inst: H5AppInstance

  process (config: Partial<H5BuildConfig>) {
    const baseConfig = new H5BaseConfig(this.appPath, config)
    const chain = this.chain = baseConfig.chain
    const {
      entry = {},
      output = {},
      entryFileName = 'app',
      mode = 'production',
      enableSourceMap = process.env.NODE_ENV !== 'production',
      sourceMapType = 'eval-cheap-module-source-map',
      publicPath = '/',
      chunkDirectory = 'chunk',
      alias = {},
      router,
      framework
    } = config
    const routerMode = router?.mode || 'hash'
    const isMultiRouterMode = routerMode === 'multi'
    this.inst = new H5AppInstance(entry as webpack.EntryNormalized, {
      sourceDir: this.sourceDir,
      framework: framework as FRAMEWORK_MAP,
      entryFileName
    })
    if (isMultiRouterMode) {
      delete entry[entryFileName]
      this.inst.pagesConfigList.forEach((page, index) => {
        entry[index] = [page]
      })
    }

    this.enableSourceMap = enableSourceMap

    const webpackOutput = this.getOutput({
      mode,
      publicPath,
      chunkDirectory,
      customOutput: output as Output,
      entryFileName
    })
    const webpackPlugin = new H5WebpackPlugin(this)
    const webpackModule = new H5WebpackModule(this)

    chain.merge({
      entry,
      output: webpackOutput,
      mode,
      devtool: this.getDevtool(enableSourceMap, sourceMapType),
      resolve: { alias },
      plugin: webpackPlugin.getPlugins(isMultiRouterMode, this.inst.appConfig?.pages ?? []),
      module: webpackModule.getModules(),
      optimization: this.getOptimization(mode)
    })
  }

  getOutput ({
    mode, publicPath, chunkDirectory, customOutput = {}, entryFileName = 'app'
  }: {
    mode: H5BuildConfig['mode']
    publicPath: string
    chunkDirectory: H5BuildConfig['chunkDirectory']
    customOutput?: Output
    entryFileName?: string
  }): Output {
    publicPath = addTrailingSlash(publicPath)
    if (mode === 'development') {
      publicPath = addLeadingSlash(publicPath)
    }
    const filename: Output['filename'] = (chunk) => chunk.runtime === entryFileName ? 'js/[name].js' : '[name].js'
    return {
      path: this.outputDir,
      filename,
      chunkFilename: `${chunkDirectory}/[name].js`,
      publicPath,
      ...customOutput
    }
  }

  getOptimization (mode: string) {
    const isProd = mode === 'production'

    const cacheGroups: Record<string, unknown> = {
      default: false,
      defaultVendors: false,
      common: {
        name: isProd ? false : 'common',
        filename: 'js/[name].js',
        minChunks: 2,
        priority: 1
      },
      vendors: {
        name: isProd ? false : 'vendors',
        filename: 'js/[name].js',
        minChunks: 2,
        test: module => /[\\/]node_modules[\\/]/.test(module.resource),
        priority: 10
      },
      taro: {
        name: isProd ? false : 'taro',
        filename: 'js/[name].js',
        test: module => /@tarojs[\\/][a-z]+/.test(module.context),
        priority: 100
      }
    }
    if (!isProd) cacheGroups.name = false
    return {
      splitChunks: {
        chunks: 'initial',
        hidePathInfo: true,
        minSize: 0,
        cacheGroups
      }
    }
  }

  getConfigFilePath (filePath = '') {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getPagesConfigList (pages: string[] = []) {
    const pageMap = new Map()
    pages.forEach((page) => pageMap.set(page, this.getConfigFilePath(path.join(this.sourceDir, page))))
    return pageMap
  }
}
