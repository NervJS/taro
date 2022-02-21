import { isEmptyObject, readConfig, recursiveMerge, resolveMainFilePath } from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import * as path from 'path'
import webpack from 'webpack'
import { Combination } from './Combination'
import { H5BaseConfig } from './H5BaseConfig'
import { WebpackPlugin } from './WebpackPlugin'
import { H5WebpackPlugin } from './H5WebpackPlugin'
import { H5WebpackModule } from './H5WebpackModule'
import { addLeadingSlash, addTrailingSlash } from '../utils'

import type { H5BuildConfig } from '../utils/types'

export class H5Combination extends Combination<H5BuildConfig> {
  enableSourceMap: boolean
  defaultTerserOptions: {
    keep_fnames: true,
    output: {
      comments: false,
      keep_quoted_props: true,
      quote_keys: true,
      beautify: false
    },
    warnings: false
  }

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
      router
    } = config
    const routerMode = router?.mode || 'hash'
    const isMultiRouterMode = routerMode === 'multi'
    const pages: string[] = this.getAppConfig(entryFileName, entry).pages ?? []
    if (isMultiRouterMode) {
      this.getPagesConfigList(pages).forEach((page, index) => {
        entry[index] = [page]
      })
    }
    console.log('entry', entry)

    this.enableSourceMap = enableSourceMap

    const webpackOutput = this.getOutput({
      mode,
      publicPath,
      chunkDirectory,
      customOutput: output
    })
    const webpackPlugin = new H5WebpackPlugin(this)
    const webpackModule = new H5WebpackModule(this)

    chain.merge({
      entry,
      output: webpackOutput,
      mode,
      devtool: this.getDevtool(enableSourceMap, sourceMapType),
      resolve: { alias },
      plugin: webpackPlugin.getPlugins(isMultiRouterMode, pages),
      module: webpackModule.getModules(),
      optimization: this.getOptimization(mode)
    })
  }

  getOutput ({ mode, publicPath, chunkDirectory, customOutput }: {
    mode: H5BuildConfig['mode']
    publicPath: string
    chunkDirectory: H5BuildConfig['chunkDirectory']
    customOutput: H5BuildConfig['output']
  }) {
    publicPath = addTrailingSlash(publicPath)
    if (mode === 'development') {
      publicPath = addLeadingSlash(publicPath)
    }
    return {
      path: this.outputDir,
      filename: 'js/[name].js',
      chunkFilename: `${chunkDirectory}/[name].js`,
      publicPath,
      ...customOutput
    }
  }

  getOptimization (mode: string) {
    const isProd = mode === 'production'
    const { terser } = this.config
    const minimizer: Record<string, any> = {}
    const isTerserEnabled = !(terser?.enable === false)

    if (isProd && isTerserEnabled) {
      const terserOptions = recursiveMerge({}, this.defaultTerserOptions, terser?.config || {})
      minimizer.terserPlugin = WebpackPlugin.getTerserPlugin(terserOptions)
    }

    const cacheGroups: Record<string, unknown> = {
      default: false,
      defaultVendors: false,
      common: {
        name: isProd ? false : 'common',
        minChunks: 2,
        priority: 1
      },
      vendors: {
        name: isProd ? false : 'vendors',
        minChunks: 2,
        test: module => /[\\/]node_modules[\\/]/.test(module.resource),
        priority: 10
      },
      taro: {
        name: isProd ? false : 'taro',
        test: module => /@tarojs[\\/][a-z]+/.test(module.context),
        priority: 100
      }
    }
    if (!isProd) cacheGroups.name = false
    return {
      minimizer,
      splitChunks: {
        chunks: 'initial',
        hidePathInfo: true,
        minSize: 0,
        cacheGroups
      }
    }
  }

  getAppConfig (entryFileName = 'app', entry: webpack.Entry): AppConfig {
    const appEntry = this.getAppEntry(entryFileName, entry)
    const appConfigPath = this.getConfigFilePath(appEntry)
    const appConfig = readConfig(appConfigPath)
    if (isEmptyObject(appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
    }
    return appConfig
  }

  getAppEntry (entryFileName = 'app', entry: webpack.Entry) {
    const appEntry = entry[entryFileName]
    if (Array.isArray(appEntry)) {
      return appEntry.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    } else if (Array.isArray(appEntry.import)) {
      return appEntry.import.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    }
    return appEntry
  }

  getConfigFilePath (filePath = '') {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getPagesConfigList (pages: string[] = []) {
    const pageMap = new Map()
    pages.forEach((page) => pageMap.set(page, this.getConfigFilePath(path.join(this.appPath, this.sourceRoot, page))))
    return pageMap
  }
}
