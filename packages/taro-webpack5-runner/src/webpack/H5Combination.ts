import { resolveMainFilePath } from '@tarojs/helper'
import path from 'path'
import { Configuration, EntryNormalized } from 'webpack'

import { parsePublicPath } from '../utils'
import H5AppInstance from '../utils/H5AppInstance'
import type { H5BuildConfig } from '../utils/types'
import { Combination } from './Combination'
import { H5BaseConfig } from './H5BaseConfig'
import { H5WebpackModule } from './H5WebpackModule'
import { H5WebpackPlugin } from './H5WebpackPlugin'

type Output = Required<Configuration>['output']

export class H5Combination extends Combination<H5BuildConfig> {
  inst: H5AppInstance
  webpackPlugin = new H5WebpackPlugin(this)
  webpackModule = new H5WebpackModule(this)

  process (config: Partial<H5BuildConfig>) {
    const baseConfig = new H5BaseConfig(this.appPath, config)
    const chain = this.chain = baseConfig.chain
    const {
      entry = {},
      output = {},
      entryFileName = 'app',
      mode = 'production',
      sourceMapType = 'eval-cheap-module-source-map',
      publicPath = '/',
      chunkDirectory = 'chunk',
      alias = {},
      router,
      frameworkExts
    } = config
    const routerMode = router?.mode || 'hash'
    const isMultiRouterMode = routerMode === 'multi'
    this.inst = new H5AppInstance(entry as EntryNormalized, {
      sourceDir: this.sourceDir,
      frameworkExts,
      entryFileName
    })
    if (isMultiRouterMode) {
      delete entry[entryFileName]
      this.inst.pagesConfigList.forEach((page, index) => {
        entry[index] = [page]
      })
    }

    const webpackOutput = this.getOutput({
      mode,
      publicPath,
      chunkDirectory,
      customOutput: output as Output,
      entryFileName
    })
    const module = this.webpackModule.getModules()
    const [, pxtransformOption] = this.webpackModule.__postcssOption.find(([name]) => name === 'postcss-pxtransform') || []
    if (isMultiRouterMode) {
      this.webpackPlugin.pages = this.inst.appConfig?.pages
    }
    this.webpackPlugin.pxtransformOption = pxtransformOption as any
    const plugin = this.webpackPlugin.getPlugins()

    chain.merge({
      entry,
      output: webpackOutput,
      mode,
      devtool: this.getDevtool(sourceMapType),
      resolve: { alias },
      plugin,
      module,
      optimization: this.getOptimization(mode)
    })
  }

  getOutput ({
    publicPath = '/', chunkDirectory, customOutput = {}, entryFileName = 'app'
  }: {
    mode: H5BuildConfig['mode']
    publicPath: string
    chunkDirectory: H5BuildConfig['chunkDirectory']
    customOutput?: Output
    entryFileName?: string
  }): Output {
    const filename: Output['filename'] = (chunk) => chunk.runtime === entryFileName ? 'js/[name].js' : '[name].js'
    return {
      path: this.outputDir,
      filename,
      chunkFilename: `${chunkDirectory}/[name].js`,
      publicPath: parsePublicPath(publicPath),
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
