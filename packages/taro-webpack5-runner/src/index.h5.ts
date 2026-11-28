import { format as formatUrl } from 'node:url'

import { chalk, recursiveMerge } from '@tarojs/helper'
import { getH5DevServerOptions } from '@tarojs/runner-utils/dist/bundler/devServer'
import { isFunction } from '@tarojs/shared'
import Prebundle from '@tarojs/webpack5-prebundle'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import { formatOpenHost } from './utils'
import { bindDevLogger, bindProdLogger, printBuildError } from './utils/logHelper'
import { errorHandling } from './utils/webpack'
import { H5Combination } from './webpack/H5Combination'

import type { EntryObject, Stats } from 'webpack'
import type { IH5BuildConfig } from './utils/types'

export default async function build (appPath: string, rawConfig: IH5BuildConfig): Promise<Stats | void> {
  const combination = new H5Combination(appPath, rawConfig)
  await combination.make()

  const { chunkDirectory = 'chunk', devServer, enableSourceMap, entryFileName = 'app', entry = {}, publicPath } = combination.config
  let prebundle: Prebundle | null = null
  if (!combination.isBuildNativeComp) {
    prebundle = new Prebundle({
      appPath,
      sourceRoot: combination.sourceRoot,
      chain: combination.chain,
      chunkDirectory,
      devServer,
      enableSourceMap,
      entryFileName,
      entry,
      isWatch: combination.config.isWatch,
      publicPath,
      alias: combination.config.alias,
      defineConstants: combination.config.defineConstants,
      modifyAppConfig: combination.config.modifyAppConfig
    })
    try {
      await prebundle.run(combination.getPrebundleOptions())
    } catch (error) {
      console.error(error)
      console.warn(chalk.yellow('依赖预编译失败，已经为您跳过预编译步骤，但是编译速度可能会受到影响。'))
    }
  }

  const webpackConfig = combination.chain.toConfig()
  const config = combination.config
  const errorLevel = typeof config.compiler !== 'string' && config.compiler?.errorLevel || 0

  try {
    if (!config.isWatch) {
      if (config.withoutBuild) return

      const compiler = webpack(webpackConfig)
      prebundle?.postCompilerStart(compiler)
      compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
        if (isFunction(config.modifyBuildAssets)) {
          await config.modifyBuildAssets(compilation.assets)
        }
        callback()
      })
      return new Promise<Stats>((resolve, reject) => {
        bindProdLogger(compiler)

        compiler.run((error, stats: Stats) => {
          compiler.close(error2 => {
            const err = error || error2

            if (isFunction(config.onBuildFinish)) {
              config.onBuildFinish({
                error: err,
                stats: err ? null : stats,
                isWatch: false
              })
            }

            err ? reject(err) : resolve(stats)

            errorHandling(errorLevel, stats)
          })
        })
      })
    } else {
      config.devServer = recursiveMerge(config.devServer || {}, webpackConfig.devServer)
      config.output = webpackConfig.output
      const routerConfig = config.router || {}
      const routerMode = routerConfig.mode || 'hash'
      const routerBasename = routerConfig.basename || '/'
      webpackConfig.devServer = await getH5DevServerOptions<WebpackDevServer.Configuration>(appPath, config as any)

      const firstEntry = Object.keys(entry as EntryObject)[0]
      const pathname = combination.isBuildNativeComp ? `/${firstEntry}.html` : '/'
      const devUrl = formatUrl({
        protocol: webpackConfig.devServer?.https ? 'https' : 'http',
        hostname: formatOpenHost(webpackConfig.devServer?.host),
        port: webpackConfig.devServer?.port,
        pathname: routerMode === 'browser' ? routerBasename : pathname
      })
      if (typeof webpackConfig.devServer.open === 'undefined' || webpackConfig.devServer.open === true) {
        webpackConfig.devServer.open = devUrl
      }

      if (config.withoutBuild) return

      const compiler = webpack(webpackConfig)
      const server = new WebpackDevServer(webpackConfig.devServer, compiler)
      prebundle?.postCompilerStart(compiler)
      bindDevLogger(compiler, devUrl)

      compiler.hooks.emit.tapAsync('taroBuildDone', async (compilation, callback) => {
        if (isFunction(config.modifyBuildAssets)) {
          await config.modifyBuildAssets(compilation.assets)
        }
        callback()
      })
      compiler.hooks.done.tap('taroBuildDone', stats => {
        if (isFunction(config.onBuildFinish)) {
          config.onBuildFinish({
            error: null,
            stats,
            isWatch: true
          })
        }
        errorHandling(errorLevel, stats)
      })
      compiler.hooks.failed.tap('taroBuildDone', error => {
        if (isFunction(config.onBuildFinish)) {
          config.onBuildFinish({
            error,
            stats: null,
            isWatch: true
          })
        }
        process.exit(1)
      })

      return new Promise<void>((resolve, reject) => {
        server.startCallback(err => {
          if (err) {
            printBuildError(err)
            reject(err)
            return console.log(err)
          }
          resolve()
        })
      })
    }
  } catch (err) {
    console.error(err)
    !config.isWatch && process.exit(1)
  }
}
